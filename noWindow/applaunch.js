// TODO: we should have bForwardToApp determine if the user is viewing Inbox or Unread, and if we're loading the other one, then force the user's view to reload
enyo.kind({
	name: "myAppLaunch",
	kind: "Component",
    windowActivated: function()
    {
        enyo.log("windowActivated");
        enyo.application.mainApp.isForeground = true;
        enyo.application.mainApp.restartTimedRetrieval();
    },
    windowDeactivated: function()
    {
        enyo.log("windowDeactivated");
        enyo.application.mainApp.isForeground = false;
        enyo.application.mainApp.restartTimedRetrieval();
    },
    onDbSuccess: function(inSender, inResponse)
	{
		enyo.log("onDbSuccess", inResponse);
	},
	onDbFailure: function(inSender, inResponse)
	{
		enyo.log("onDbFailure", inResponse);
	},
	outboxMessage: function(inSender, inResponse)
	{
		enyo.log("fired=", inResponse.fired);
		enyo.log("results=", inResponse.results);
		if(inResponse.fired)
		{
			this.$.outboxWatch.call({
				"query":
				{
					"from":"com.ericblade.googlevoiceapp.immessage:1",
					"where": [
						{ "prop":"folder", "op":"=", "val":"outbox" },
						{ "prop":"status", "op":"=", "val":"pending" }, // TODO: mark these as successful!! or delete them
					]
				},
				"watch": true,
			});
		} else if(inResponse.results)
		{
			var mergeIDs = [ ];
			for(var x = 0; x < inResponse.results.length; x++)
			{
				mergeIDs.push( { "_id": inResponse.results[x]["_id"], "status":"successful" } );
				if(enyo.application.mainApp)
				{
					enyo.log(enyo.application.mainApp, "spooling message", inResponse.results[x]);
					// multiple recipients can be specified in the incoming array!! make sure we handle
					enyo.application.mainApp.$.outbox.queueMessage(inResponse.results[x].to[0].addr, inResponse.results[x].messageText);
				}
			}
			this.$.mergeStatus.call( { "objects": mergeIDs } );
			// queue automatically sends when online or sets timer when not
			//if(enyo.application.mainApp)
			//    enyo.application.mainApp.$.outbox.timedMessageSend();
		}
		enyo.log("outboxMessage", inResponse);
	},
	watchFail: function(inSender, inResponse)
	{
		enyo.log("watchFail", inResponse);
	},
	dbFailure: function(inSender, inResponse) { enyo.log("dbFailure", inResponse); },
	delSuccess: function(inSender, inResponse) { enyo.log("delSuccess", inResponse); },
	mergeStatusSuccess: function(inSender, inResponse) { enyo.log("mergeStatusSuccess", inResponse); },
	components: [
            { name: "api", kind: "GoogleVoiceAPI", onLoggedIn: "LoggedIn" },
            { kind: "WebService", onFailure: "webFailure", components:
                [
                    { contentType: "application/x-www-form-urlencoded; charset=utf-8", },
                    { name: "getInbox",       method: "GET",  onSuccess: "InboxReceived",       onFailure: "InboxFailed",       url: "https://www.google.com/voice/inbox/recent/inbox" },
                    { name: "getLogin",       method: "POST", onSuccess: "LoginReceived",       onFailure: "LoginFailed",       url: "https://www.google.com/accounts/ClientLogin" },
                ]
            },
			{ name: "dbPutService", kind: "PalmService", service: "palm://com.palm.db/", method: "put", onSuccess: "onDbSuccess", onFailure: "onDbFailure" },
			{ name: "dbFindService", kind: "PalmService", service: "palm://com.palm.db/", method: "find", onSuccess: "findSuccess", onFailure: "findFailure" },
			{ name: "outboxWatch", kind: "PalmService", service: "palm://com.palm.db/", method: "find", onSuccess: "outboxMessage", onFailure: "watchFail", subscribe: true },
			{ kind: "DbService", dbKind: "com.ericblade.googlevoiceapp.immessage", onFailure: "dbFailure", components:
				[
					{ name: "dbDel", method: "del", onSuccess: "delSuccess" },
					{ name: "mergeStatus", method: "merge", onSuccess: "mergeStatusSuccess" },
				]
			},
// Application events handlers
		{kind: "ApplicationEvents", 
			// we want to be able to save prefs or 
			// something when the app is close
			onUnload: "cleanup",
                        onWindowActived: "windowActivated", onWindowDeactived: "windowDeactivated",
                        onWindowParamsChanged: "windowParamsChanged",
		},
            { kind: "PalmService", service: "palm://com.palm.power/timeout/", onFailure: "timerFailure", components:
                [
                    { name: "setRefreshTimer", method: "set", onSuccess: "refreshTimerSet" },
                    { name: "clearRefreshTimer", method: "clear" },
                ]
            },
            { name: "CreateSynergyAccount", kind: "PalmService", service: "palm://com.palm.service.accounts/", method: "createAccount", onSuccess: "synergyAccountCreated", onFailure: "synergyAccountFailed" },
			{ name: "GetSynergyAccount", kind: "PalmService", service: "palm://com.palm.service.accounts/", method: "getAccountInfo", onSuccess: "synergyAccountReceived", onFailure: "synergyAccountInfoFail" },
 
	],
        windowParamsChanged: function() {
            this.log("************** WINDOW PARAMS CHANGED ", enyo.windowParams);
        },
	createSynergyAccount: function()
	{
		this.$.CreateSynergyAccount.call(
			{
				"templateId": "com.ericblade.googlevoiceapp.account",
				"capabilityProviders": [{ "id": "com.ericblade.googlevoiceapp.phone", "capability":"PHONE"},
										{ "id": "com.ericblade.googlevoiceapp.contacts", "capability": "CONTACTS" },
										//{ "id": "com.ericblade.googlevoiceapp.text", "capability":"MESSAGING", "capabilitySubtype": "SMS"},
										{"id": "com.ericblade.googlevoiceapp.im", "capability":"MESSAGING", "_sync": true }],
				"username": "blade.eric",
				"alias": "blade.eric @ GVoice",
				//"credentials": { "common": {"password":"password", "authToken":"authToken"} },
				"password": "password",
				"config": { "ip": "8.8.8.8" }
			} 
		);	
	},
	querySynergyAccount: function()
	{
		enyo.log("querySynergyAccount");
		this.$.GetSynergyAccount.call({ accountId: prefs.get("synergyAccount") });
	},
	synergyAccountInfoFail: function(inSender, res)
	{
		enyo.log("synergyAccountInfoFail", res);
		this.createSynergyAccount();
	},
	synergyAccountReceived: function(inSender, res)
	{
		enyo.log("synergyAccountReceived", res);
		if(res.result.beingDeleted)
		    this.createSynergyAccount();
		else {
			this.SynergyAccount = res.result["_id"];
			enyo.log("***************** SYNERGY ACCOUNT ID=", this.SynergyAccount);
			this.$.outboxWatch.call({
				"query":
				{
					"from":"com.ericblade.googlevoiceapp.immessage:1",
					"where": [
						{ "prop":"folder", "op":"=", "val":"outbox" },
						{ "prop":"status", "op":"=", "val":"pending" }, // TODO: mark these as successful!! or delete them
					]
				},
				"watch": true,
			});
		}
	},
	synergyAccountCreated: function(inSender, res)
	{
		/*  {"result":{"_kind":"com.palm.account:1","templateId":"com.ericblade.googlevoiceapp.account",
			"username":"(configure in GVoice app)","alias":"Google Voice","beingDeleted":false,
			"capabilityProviders":[{"id":"com.ericblade.googlevoiceapp.sms","capability":"PHONE"}],
			"_id":"++Hs9+gGfJF3eKSa"},"returnValue":true} */
		enyo.log("synergyAccountCreated", res);
		this.SynergyAccount = res.result["_id"];
		prefs.set("synergyAccount", this.SynergyAccount);
		enyo.log("***************** SYNERGY ACCOUNT ID=", this.SynergyAccount);
		this.$.outboxWatch.call({
			"query":
			{
				"from":"com.ericblade.googlevoiceapp.immessage:1",
				"where": [
					{ "prop":"folder", "op":"=", "val":"outbox" },
					{ "prop":"status", "op":"=", "val":"pending" }, // TODO: mark these as successful!! or delete them					
				]
			},
			"watch": true,
		});
	},
	synergyAccountFailed: function(inSender, res)
	{
		/*  {"errorText":"Unable to create a duplicate account","errorCode":"DUPLICATE_ACCOUNT","exception":"[object Object]","returnValue":false}, */
		enyo.log("synergyAccountFailed", res);
	},
	create: function (inSender, inEvent) {
        //this.USESYNERGY = true;
		this.USESYNERGY = false;
			
        prefs.def("fgRefresh", 2);
        prefs.def("bgRefresh", 5);
        prefs.def("smallFonts", true);
        prefs.def("enterSends", true);
		prefs.def("ignoreNotificationList", { });
		prefs.def("gvAlertTone", "Default");
		prefs.def("runcount", 0);
		prefs.def("ttsdisable", false);
		prefs.def("autoCheckNewMessages", true);
		prefs.def("newMessageNotifyDisable", false);
		prefs.def("ttsNotificationDisable", false);
		prefs.def("ttsAnnounceMessages", false);
		prefs.def("defaultBox", "Unread");
		
		this.inherited(arguments);
		try {
			var changedList;
			this.IgnoreNotificationsList = enyo.json.parse(prefs.get("ignoreNotificationsList"));
			var ctime = new Date().getTime() / 1000;
			for (x in this.IgnoreNotificationsList)
			{
				if(this.IgnoreNotificationsList.hasOwnProperty(x) && this.IgnoreNotificationsList[x] < (ctime - (86400 * 7)) ) // if it's more than a week old, kill it
				{
					enyo.log("***** Throwing Out ignoreNotification:", x, this.IgnoreNotificationsList[x]);
					changedList = true;
					delete this.IgnoreNotificationsList[x];
				}
			}
			if(changedList) {
				prefs.set("ignoreNotificationsList", enyo.json.stringify(this.IgnoreNotificationsList));
			}
		} catch(err) {
			this.IgnoreNotificationsList = { };
		}
		if(window.PalmSystem && this.USESYNERGY)
		{
			if(prefs.get("synergyAccount"))
				this.querySynergyAccount();
			else
				this.createSynergyAccount();
		}
	},
 
	constructor: function() {
		this.inherited(arguments);
	},
 
	startup: function () {
		// Get the initial launch parameters to pass to the relaunch handler
		// since this is the first time the window is opened
		// subsequent launches will call relaunch() directly through
		// the applicationRelaunchHandler defined in index.html
		var params = enyo.windowParams;
		enyo.application.launcher.relaunch(params);
	},
 
	relaunch: function (params) {
		enyo.log("Relaunch in myAppLaunch", params, params.action);
                this.setAlarm();
                if(params.action == "checkNewMessages")
                {
                    enyo.application.quickMessageCheck = true;
					var bg = prefs.get("bgRefresh");
					if(!enyo.application.mainApp && bg < 5) {
						enyo.log("creating message check dash at exit");
						this.createMessageCheckDash();
					}							
                    this.checkNewMessages();
                    return;
                }
                enyo.application.quickMessageCheck = false;
		this.openCard("mainApp", params, false);	
                if(params.action == "compose") {
                    this.composeMessage(params);
                }
                if(params.action == "call") {
                    this.placeCall(params);
                }
	},
        composeMessage: function(params)
        {
            setTimeout(
                function(params) {
                    if(isNaN(params.text))
                       enyo.application.mainApp.openComposePopup("", params.text);
                    else
                        enyo.application.mainApp.openComposePopup(params.text, "");
                }, 1000, params);
        },
        placeCall: function(params)
        {
            setTimeout(
                function(params) {
                    enyo.log("************************ CALLING OPENPLACECALLPOPUP ", params.text);
                    enyo.application.mainApp.openPlaceCallPopup(params.text);
                }, 1000, params);
        },
 
	openCard: function (type, windowParams, forceNewCard) {
		var path, basePath, existingWin;
 
		basePath = enyo.fetchAppRootPath() + "/";
 
		// this assumes a /mainApp folder under the applications root
		// path with a separate index.html to launch the mainApp window
		if (type === "mainApp") {
			path = basePath + "mainApp/index.html";
		}
		// or if we wanted to launch a different window
		else if (type === "somethingElse") {		
			path = basePath + "somethingElse/index.html";
 
		} 
		else {
			console.error("unknown launch type " + type);
			return; // bail out
		}
 
		// open the window
                if(window.PalmSystem)
                {
                    //if(!isNaN(window.PalmSystem.deviceInfo.platformVersion)) {
                        enyo.log("**** using windows.activate to launch new card");
                        this.mainApp = enyo.windows.activate(path, type, windowParams);
                    //} else {
                    //    enyo.log("**** attempting to render into current card");
                    //    new MyApps.GVoice().renderInto(document.body);
                    //}
                }
                else if( (typeof PhoneGap !== "undefined") )
                    new MyApps.GVoice().renderInto(document.body);
                else {
                    // TODO: Learn how to detect WebWorks ..
                    new MyApps.GVoice().renderInto(document.body);
                    enyo.log("*************** I DON'T KNOW HOW TO OPEN A WINDOW ON THIS PLATFORM!?!? WHERE ARE WE?! WHAT AM I DOING IN THIS HANDBASKET?!");
                }
	},
        logmessage: function()
        {
            enyo.log("timer check");
        },
        startTimer: function(x) {
			if(!prefs.get("autoCheckNewMessages"))
			    return;
            var interval = enyo.application.mainApp.isForeground ? prefs.get("fgRefresh") : prefs.get("bgRefresh");
			if(interval < 1 || interval === undefined) interval = 1;
			enyo.log("startTimer interval=", interval);
            if(!this.timerInterval || this.timerInterval === 0)
                this.timerInterval = setInterval(this.sendMessageToApp, 60 * interval * 1000);
        },
        setAlarm: function() // TODO: need to make this accept an incoming time, and set "in" to that
        {
            if(Platform.isWebOS() && isNaN(Platform.platformVersion) ) {
                enyo.log("setAlarm bailing on Open webOS, as the service may not be yet available");
                return;
            }
			var bg = prefs.get("bgRefresh");
			if(bg === undefined)
			    bg = 5;
			var time = (bg < 5) ? "00:05:00" : secondsToTime(bg * 60);
			/*if(bg < 5) {
				if(bg < 4) bg = 4;
				var dt = new Date(Date.now() + (bg * 60 * 1000));
				var month = parseInt(dt.getMonth()) + 1;
				var day = dt.getDate();
				var hours = dt.getHours();
				var minutes = dt.getMinutes();
				var seconds = dt.getSeconds();
				
				if(parseInt(month) < 10) month = "0" + month;
				if(parseInt(day) < 10) day = "0" + day;
				if(parseInt(hours) < 10) hours = "0" + hours;
				if(parseInt(minutes) < 10) minutes = "0" + minutes;
				if(parseInt(seconds) < 10) seconds = "0" + seconds;
				
				time = month + "/" + day + "/" + dt.getFullYear() + " " + hours + ":" + minutes + ":" + seconds;
			}*/
			enyo.error("**** Set Alarm for ", time, bg);
            if(window.PalmSystem && prefs.get("autoCheckNewMessages"))
            {
				/*if(bg < 5) {
					this.$.setRefreshTimer.call({
						"key": "com.ericblade.gvoicerefreshtimer",
						"at": time,
						"uri": "palm://com.palm.applicationManager/launch",
						"params": enyo.json.stringify(
							{
								'id':'com.ericblade.googlevoiceapp',
								'params': { 'action' : 'checkNewMessages' },
							})
					});
					
				} else {*/
				    var appid = enyo.fetchAppInfo();
					if(typeof appid == "object")
					    appid = appid.id;
					else
					    appid = JSON.parse(appid).id;
					if(!appid || appid == "")
					{
						enyo.error("**** APPID UNKNOWN, ASSUMING WE'RE GVOICE PRE!!!");
						appid = "com.ericblade.gvoicepre";
					}
					this.$.setRefreshTimer.call({
						"key": "com.ericblade.gvoicerefreshtimer",
						"in": time,
						"uri": "palm://com.palm.applicationManager/launch",
						"params": enyo.json.stringify(
							{
								'id':appid,
								'params': { 'action' : 'checkNewMessages' },
							})
					});
				//}
            }
        },
        stupid: function(x) {
            x.postMessage("stupid", "*");
        },
        stopTimer: function(x) {
            clearInterval(this.timerInterval);
            this.timerInterval = 0;
        },
        sendMessageToApp: function() {
            //if(enyo.application.mainAppWindow && enyo.application.mainAppWindow.name)
            //    enyo.application.mainAppWindow.postMessage("retrieveInbox", "*");
			enyo.log("sendMessageToApp");
			enyo.application.quickMessageCheck = true;
			enyo.application.launcher.checkNewMessages();
        },
 
	something: function () {
		enyo.log("We're gonna do something without an app window! (better hope it's quick)");
	},
 
	// cleanup was defined above as the onUnload handler for application events
	// we'll use it to save any changes to our appPrefs
	cleanup: function () {
		enyo.log("Cleanup in appLaunch");
                //window.close();
        },
    getAlertPath: function() {
        var x = prefs.get("gvAlertTone");
		if(!x || x == "" || x == "None")
		    return "";
		if(window.PalmSystem)
		{
			switch(x) {
				case "Default": return "Bell"; // non-existant one should give us a "ding"
				case "Anticipation":
				case "Cymbells":
				case "Dulcimer":
				case "Flurry":
				case "Rain Dance":
				case "Shimmer":
				case "Subtle":
				case "Triangle":
				case "Vibes":
				    return "/media/internal/ringtones/"+x+" (short).mp3";
			}
		}
		//var path = window.PalmSystem ? "" : "mainApp/";
		// since the sound is played from the launcher, we don't need to conditionally prefix
		var path = "mainApp/";
		return path + "sounds/" + x + ".mp3";
    },
	PostNotification: function(msgid, msg, nonamemsg, msgtext)
	{
		var wkn = window.webkitNotifications;
		if(window.PalmSystem || (typeof plugins !== "undefined" && plugins.localNotification) )
		{
			this.actuallyPostNotification(msgid, msg, nonamemsg, msgtext);
		} else if(wkn) {
			if(wkn.checkPermission() && !this.checkedPermission) { // 1 = Not Allowed, 2 = Denied, 0 = Allowed
				this.playAlertSound();
                                this.checkedPermission = true;
				setTimeout(function() {
					wkn.requestPermission(enyo.bind(this, this.actuallyPostNotification, msgid, msg, nonamemsg, msgtext));
				}, 2000);
			} else if(this.checkedPermission) {
				this.actuallyPostNotification(msgid, msg, nonamemsg, msgtext);
			}
		} 
	},
	createMessageCheckDash: function()
	{
		if(this.messageCheckDash || !window.PalmSystem)
		    return;
		this.messageCheckDash = this.createComponent( {
			kind: "Dashboard",
			smallIcon: "images/google-voice-icon24.png",
			icon: "images/google-voice-icon48.png",
			//onMessageTap: "dashboardTap",
			//onIconTap: "dashboardTap",
		});
		var x = { icon: "mainApp/images/google-voice-icon48.png",
				  smallIcon: "mainApp/images/google-voice-icon24.png",
				  title: "SynerGV Notification Panel", text: "Swipe to return to 5 minute notification minimum" };
		this.messageCheckDash.push(x);
	},
    actuallyPostNotification: function(msgid, msg, nonamemsg, msgtext)
    {
		var ignoreid = msgid.substr(-5) + (typeof msgtext == "string" ? msgtext.substr(-5) : "vm?"); // just use the last 5 characters of the id and the text .. hopefully will work
		
        enyo.log("actuallyPostNotification");
		/* Initialize some junk we need */
		if(!this.NotificationDashboards)
			this.NotificationDashboards = { };
		if(!this.NotificationDashboards[0])
		{
			this.NotificationDashboards[0] = this.createComponent( {
				kind: "gvoice.Dashboard",
				smallIcon: "images/google-voice-icon24.png",
				icon: "images/google-voice-icon48.png",
				onMessageTap: "dashboardTap",
				onIconTap: "dashboardTap",
			});
		}
		
        if(window.PalmSystem)
        {
			if(this.IgnoreNotificationsList[ignoreid]) {
				enyo.log("*** IGNORING POSTNOTIFICATION FOR " + ignoreid);
				return;
			}
			if(msg.indexOf("New missed call from ") == 0) {
				msgtext = "from " + msg.substr(20);
				msg = "Missed Call";
			}
			if( (!msgtext || msgtext == "") && msg.indexOf("New voicemail from ") == 0) {
				msgtext = "from " + msg.substr(18);
				msg = "New Voicemail";
			}
			if(!this.NotificationDashboards[msgid] || this.NotificationDashboards[msgid].ignoreid != ignoreid) {
				this.NotificationDashboards[msgid] = { icon: "mainApp/images/google-voice-icon48.png",
														smallIcon: "mainApp/images/google-voice-icon24.png",
														title: msg, text: msgtext,
														id: msgid, ignoreid: ignoreid };
														
				/* TODO: We shouldn't do this without also retracting any previous notifications for this same conversation */
				/* may require some major rewriting ugh */
				
				if(false && Platform.isWebOS() && Platform.platformVersion < 3) { 
					var newDash = this.createComponent({
						kind: "gvoice.Dashboard",
						smallIcon: "images/google-voice-icon24.png",
						icon: "images/google-voice-icon48.png",
						onMessageTap: "dashboardTap",
						onIconTap: "dashboardTap",
					});
					newDash.push(this.NotificationDashboards[msgid]);
				} else {
					this.NotificationDashboards[0].push(this.NotificationDashboards[msgid]);
				}
				enyo.error("Playing alert", this.getAlertPath());
				enyo.windows.addBannerMessage(msg, '{}', "mainApp/images/google-voice-icon24.png", "", this.getAlertPath());
				enyo.log("***** NOTIFICATION : TTS DISABLE", prefs.get("ttsNotificationDisable"), enyo.application.mainApp, (enyo.application.mainApp !== undefined && prefs.get("ttsNotificationDisable") !== false ));
				if((enyo.application.mainApp !== undefined && prefs.get("ttsNotificationDisable") !== false ) ) // TODO: can't speak until mainApp is loaded :(
				{
					if(prefs.get("ttsNotificationDisable") !== true)
					{
						enyo.log("***** TTS ATTEMPTING TO SPEAK");
						if(typeof chrome !== "undefined" && chrome.tts) {
							chrome.tts.speak(prefs.get("ttsAnnounceName") === true ? msg : nonamemsg);
							if(prefs.get("ttsAnnounceMessages") === true && msgtext && msgtext != "")
							{
								chrome.tts.speak(msgtext); // TODO: Move the speech plugin to here ... 
							}
						} else {
							enyo.application.mainApp.speak( prefs.get("ttsAnnounceName") === true ? msg : nonamemsg );
							if(prefs.get("ttsAnnounceMessages") === true && msgtext && msgtext != "")
							{
								enyo.application.mainApp.speak(msgtext); // TODO: Move the speech plugin to here ... 
							}
						}
					}
				}
				enyo.log("************************ NOTIFICATION POSTED ******************** ");
			}
			//this.NotificationDashboards[0].onDashboardActivated = "dashboardActivated";
			this.NotificationDashboards[0].onLayerSwipe = "dashboardLayerSwipe";
			this.NotificationDashboards[0].onUserClose = "dashboardClosed";
		} else if(window.webkitNotifications) {
			var wkn = window.webkitNotifications;
			enyo.log("webkitNotifications available, permission=" + wkn.checkPermission());
			if(!this.NotificationDashboards[ignoreid] || this.NotificationDashboards[ignoreid].ignoreid != ignoreid) 
			{
			    //this.playAlertSound();
				if(wkn.checkPermission() === 0) // 0 = Allowed, 1 = Not Allowed, 2 = Denied
				{
					try {
						var note = wkn.createNotification("mainApp/images/google-voice-icon48.png", msg, msgtext);
						note.id = msgid;
						note.ignoreid = ignoreid;
						
						note.onclose = enyo.bind(this, this.dashboardLayerSwipe, note, note);
						note.onclick = enyo.bind(this, function() { enyo.log("How do we bring the app forward?"); });
						note.ondisplay = enyo.bind(this, function() { enyo.log("notification ondisplay"); });
						note.onerror = enyo.bind(this, function() { enyo.log("notification onerror"); });
						
						note.show();
						this.NotificationDashboards[0] = "temp holder";
						this.NotificationDashboards[ignoreid] = { "ignoreid": ignoreid };
						enyo.log("************************ NOTIFICATION POSTED ******************** ");
					} catch(err) { // throw security error
						enyo.log("error posting notification:" + err);
					}
				} else {
					enyo.log("duplicate notification");
				}
			}
		} else if(typeof plugins !== "undefined" && plugins.localNotification) {
			this.NotificationDashboards[0] = "temp holder";
			if(!this.NotificationDashboards[ignoreid] || this.NotificationDashboards[ignoreid].ignoreid != ignoreid) {
				this.NotificationDashboards[ignoreid] = { "ignoreid": ignoreid };
				plugins.localNotification.add({
					date: new Date(),
					message: msg + "\r\n" + msgtext,
					ticker: msg + ": " + msgtext,
					repeatDaily: false,
					id: msgid
				});
				//this.playAlertSound();
			}
		}
		else 
		{
			enyo.log("No known notification system");
		}
    },
	playAlertSound: function()
	{
		var path = this.getAlertPath();
		if(path && path != "")
			this.createComponent({ name: "AlertSound", kind: "PlatformSound", preload: true, src: this.getAlertPath() }, { owner: this }).play();
	},
    dashboardLayerSwipe: function(inSender, layer)
    {
        var ignoreid;
        var x;
        if(!layer) {
            for(x in this.NotificationDashboards)
            {
                enyo.log("ignoreid could be", this.NotificationDashboards[x].ignoreid);
                ignoreid = this.NotificationDashboards[x].ignoreid;
            }
        } else {
            ignoreid = layer.id.substr(-5) + layer.text.substr(-5); // just use the last 5 characters of the id and the text .. hopefully will work
            this.clearNotificationsFor(layer.id);
        }
        enyo.log("Ignoring Notification for", ignoreid);
        this.IgnoreNotificationsList[ignoreid] = (new Date().getTime() / 1000); // unix timestamp
        prefs.set("ignoreNotificationsList", enyo.json.stringify(this.IgnoreNotificationsList));
    },
    dashboardClosed: function(inSender)
    {
        this.dashboardLayerSwipe(inSender);
        delete this.NotificationDashboards;
    },
    /*dashboardActivated: function(dash) {
        //dash.applyStyle("background-color", "black");
        enyo.log("**************** DASHBOARD ACTIVATED ***************** ");
        var l;
        for(l in dash)
        {
            var c = dash[l].dashboardContent;
            if(c)
            {
                console.log(c);
                c.$.topSwipeable.applyStyle("background-color", "black");
            }
        }
    },*/
    
    dashboardTap: function(inSender, dashProps, inEvent)
    {
	this.openCard("mainApp", {}, false);
        if(enyo.application.mainApp)
            enyo.application.mainApp.dashboardTap(inSender, dashProps, inEvent);
    },
    clearNotificationsFor: function(msgid)
    {
        if(!this.NotificationDashboards || !this.NotificationDashboards[0])
            return;
		var wkn = window.webkitNotifications;
		if(wkn) {
			this.NotificationDashboards[msgid].cancel();
			delete this.NotificationDashboards[msgid];
			return;
		}
		if(typeof plugins !== "undefined" && plugins.localNotification)
		{
			plugins.localNotification.cancel(msgid);
			delete this.NotificationDashboards[msgid];
			return;
		}
        if(this.NotificationDashboards[msgid])
        {
            delete this.NotificationDashboards[msgid];
        }
        if(this.NotificationDashboards[0])
        {
            var layers = this.NotificationDashboards[0].layers;
            var temp = [ ];
            for(var l in layers)
            {
                if(layers[l].id != msgid)
                    temp.push(layers[l]);
            }
            this.NotificationDashboards[0].setLayers(temp);
        }
    },
    LoggedIn: function() {
        enyo.log(enyo.application.quickMessageCheck);
        if(enyo.application.quickMessageCheck)
        {
			enyo.log("LoggedIn");
            this.checkNewMessages();
        }
    },
    checkNewMessages: function()
    {
        enyo.log("checkNewMessages");
        if(!prefs.get("autoCheckNewMessages"))
        {
            return;
        }
        if(this.$.api.AuthCode)
        {
			var defbox = prefs.get("defaultBox");
			var type = "inbox";
			switch(defbox) {
				case "Inbox": type = "inbox"; break;
				case "Unread": type = "unread"; break;
				default: type = "unread"; break;
			}
			
			//var type = "unread";
            this.$.getInbox.setUrl("https://www.google.com/voice/inbox/recent/" + type + "/");
            this.$.getInbox.headers= { "Authorization":"GoogleLogin auth="+this.$.api.AuthCode };
            this.$.getInbox.call( { page:"p1" } );
        } else {
            enyo.log("can't check messages, we aren't logged in");
        }
    },
    InboxFailed: function(inSender, inResponse)
    {
        enyo.log("InboxFailed", inResponse);
        if(inResponse.indexOf("Unauthorized") > -1 && inResponse.indexOf("Error 401") > -1)
        {
            this.doLogin(prefs.get("gvUsername"), prefs.get("gvPassword"));   
        }
    },
    InboxReceived: function(inSender, inResponse)
    {
		var bForwardToApp = false;
		var db = { };
        //enyo.log(inResponse);
		enyo.error("Launcher InboxReceived");
        var i = inResponse.indexOf("<json><!")+14;
        var j = inResponse.lastIndexOf("></json>")-1;
        
        try {
            inboxJSON = JSON.parse(inResponse.substring(i, j))[0];
        } catch(err) {
            enyo.log("********** UNABLE TO READ INBOX, ARE WE OFFLINE? ");
            return;
        }

        i = inResponse.indexOf("<div id=");
        j = inResponse.indexOf("<div class=\"gc-footer\">");
        var inboxHTML = inResponse.substring(i, j) + '<div id="';
               
        var index = 0;
        // reset the display completely, so if we have fewer messages than last time, we don't get duplicates showing!
        if(!this.Messages) this.Messages = [ ];
        if(!this.MessageIndex) this.MessageIndex = [ ];
        if(!this.ExpandedIDs) this.ExpandedIDs = [ ]; // TODO: we never used this, right? remove?
        this.Messages.length = 0;
        this.MessageIndex.length = 0;
        
        for( id in inboxJSON.messages )
        {
            if(inboxJSON.messages.hasOwnProperty(id))
            {
                i = inboxHTML.indexOf('<div id="'+id+'"');
                j = inboxHTML.indexOf('<div id="', i+1);
                this.Messages[index] = ParseMessages(inboxHTML.substring(i,j));
                this.MessageIndex[index] = inboxJSON.messages[id];
                
                this.MessageIndex[index].isMissedCall = this.Messages[index].isMissedCall;
                this.MessageIndex[index].isBlockedCaller = this.Messages[index].isBlockedCaller;
                this.MessageIndex[index].Portrait = this.Messages[index].Portrait;
                //enyo.WebosConnect.putFile(this.MessageIndex[index].Portrait, "/media/interal/gvoice-icons/"+id+".jpg");
                this.MessageIndex[index].Location = this.Messages[index].Location;
                if(!this.ExpandedIDs[this.MessageIndex[index].id])
                    this.ExpandedIDs[this.MessageIndex[index].id] = false;
                               
                for(i = 0; i < this.Messages[index].length; i++) {
                    if(this.Messages[index][i].VoicemailTranscript)
                        this.MessageIndex[index].isVoicemail = true;
                    this.Messages[index][i].SentTime = enyo.string.trim(this.Messages[index][i].SentTime);
                    this.Messages[index][i].UniqueID = this.MessageIndex[index].id + this.Messages[index][i].SentTime + this.Messages[index][i].SentBy;
                    this.Messages[index][i].id = this.MessageIndex[index].id;
                    this.Messages[index].id = this.MessageIndex[index].id;
/* {
      "objects":
      [
          {
              "_kind":"com.ericblade.googlevoiceapp.immessage:1",
              "folder":"inbox",
              "status":"successful",
              "messageText": "hi",
              "serviceName": "type_gvoice",
              "localTimestamp": 1322630507003,
              "from": {"addr": "hamboy96"},
              "to": [{"addr": "blahblah"}]
           }
        ]
    }
*/
                    if(this.USESYNERGY)
					{
					    var dbfrom;
					    if(this.Messages[index][i].SentBy == "Me:")
						{
						    dbfrom = "blade.eric";
							dbto = this.MessageIndex[index].displayNumber;
						}
						else
						{
						    dbfrom = this.MessageIndex[index].displayNumber;
							dbto = "blade.eric";
						}
						
						db = { "objects": [{
							_kind: "com.ericblade.googlevoiceapp.immessage:1",
							accountId: this.SynergyAccount,
							localTimestamp: parseInt(this.MessageIndex[index].startTime),
							timestamp: parseInt(this.MessageIndex[index].startTime),//Math.round(this.MessageIndex[index].startTime / 100),
							folder: this.Messages[index][i].SentBy == "Me:" ? "outbox" : "inbox",
							status: "successful",
							//flags: { read: this.MessageIndex[index].isRead, visible: true },
							messageText: this.Messages[index][i].SentMessage,
							from: { addr: dbfrom },
							to: [{ addr: dbto }],
							serviceName: "type_gvoice",
							username: "blade.eric",
							gConversationId: id
						}] };
						var query = {
							query: {
								from: "com.ericblade.googlevoiceapp.immessage:1",
								where: [
									{ prop: "gConversationId", op:"=", val: id },
									{ prop: "messageText", op:"=", val: this.Messages[index][i].SentMessage },
								]
							}
						};
						enyo.log("querying database for duplicate", query);
						if(this.Messages[index][i].SentBy != "Me:")
						    this.$.dbFindService.call(query, { insert: db });
					}
                }
                if(!this.MessageIndex[index].isRead)
                {
					bForwardToApp = true;
                    var type = "text";
                    if(this.MessageIndex[index].isVoicemail)
                        type = "voicemail";
                    if(this.MessageIndex[index].isMissedCall)
                        type = "missed call";
                    var disable = prefs.get("newMessageNotifyDisable");
                    if(disable !== true)
                        this.PostNotification(this.MessageIndex[index].id, "New "+type+" from " + this.displayNameOrNumber(index), "New " + type + " received", this.Messages[index][i-1] ? this.Messages[index][i-1].SentMessage : "");
                } else if(this.NotificationDashboards && this.NotificationDashboards[this.MessageIndex[index].id]) 
                {
                    this.clearNotificationsFor(this.MessageIndex[index].id);
                }
                index++;
            }
        }
		//enyo.error("Launcher bForwardToApp", bForwardToApp, enyo.application.mainApp, enyo.application.mainApp.$.boxPicker.getValue(), parseInt(enyo.application.mainApp.$.pagePicker.getValue()));
		var app = enyo.application.mainApp;
		
		var defbox = prefs.get("defaultBox");
		var type = "inbox";
		switch(defbox) {
			case "Inbox": type = "inbox"; break;
			case "Unread": type = "unread"; break;
			default: type = "unread"; break;
		}
		
		// TODO: This function is -only- called with Unread or Inbox as the type, if we ever use this function for others, this if will need to be changed
		if(bForwardToApp && app && app.$ && app.$.boxPicker && app.$.pagePicker && app.$.boxPicker.getValue().toLowerCase() == type && parseInt(app.$.pagePicker.getValue()) == 1)
		{
			// HACK: forward all the crap we already did anyway over to the main app.. sigh.
			enyo.application.mainApp.InboxReceived(inSender, inResponse);
		}
    },
	findSuccess: function(inSender, inResponse, inQuery)
	{
		enyo.log("findSuccess", inResponse);
		if(inResponse.results.length == 0)
		{
			enyo.log("length=0, putting ", inQuery.insert)
			this.$.dbPutService.call(inQuery.insert);
		}
	},
	findFail: function(inSender, inResponse, inQuery)
	{
		enyo.log("findFail", inResponse);
		enyo.log("did not find anything matching, attempting insert of ", inQuery.insert);
	},
    displayNameOrNumber: function(index)
    {
        if(enyo.application.mainApp)
        {
            var x = enyo.application.mainApp.getMessageIndexById(this.MessageIndex[index].id);
            return enyo.application.mainApp.displayNameOrNumber(x);
        }
        if(!this.MessageIndex[index].displayName && !this.MessageIndex[index].displayNumber)
        {
            this.MessageIndex[index].displayName = "Unknown Caller";
        }
        this.MessageIndex[index].displayName = this.MessageIndex[index].displayNumber;
        // TODO: pull in contacts at login, BEFORE WE CHECK MESSAGES THE FIRST TIME, and convert contacts, like the existing function in gvoice does
        return this.MessageIndex[index].displayName;        
    },
    doLogin: function(username, password)
    {
        if(!username || username === undefined || username == "undefined") username = "";
        if(!password || password === undefined || password == "undefined") password = "";
        if(username == "" || password == "")
            return;
        else {
            var params= {
                "accountType": "GOOGLE",
                "Email": username,
                "Passwd": password,
                "service": "grandcentral",
                "source": "ericBlade-GoogleLogin-0.1.1",
            }
            prefs.set("gvUsername", username);
            prefs.set("gvPassword", password);
            enyo.log("doLogin");
            this.$.getLogin.call(params);
        }
        prefs.set("gvUsername", username);
        prefs.set("gvPassword", password);
    },
    LoginReceived: function(inSender, inResponse) {
        var AuthIndex = inResponse.lastIndexOf("Auth=");
        if(AuthIndex == -1)
            enyo.log("LoginReceived: " + inResponse);
        else
            enyo.log("LoginReceived ");
        
        /*if(this.cookieLoginAttempt) {
            this.headerIconClick();
        }*/
        this.AuthCode = inResponse.substring(AuthIndex+5, inResponse.length-1);
        
        var x = inResponse.indexOf("SID=");
        var y = inResponse.lastIndexOf("LSID=");
        this.SID = inResponse.substring(x+4,y-1);
        this.LSID = inResponse.substring(y+5, AuthIndex-1);
        
        enyo.setCookie("SID", this.SID, { "Max-Age": -1 });
        enyo.setCookie("LSID", this.LSID, { "Max-Age": -1 });
        enyo.log("LoginReceived checkNewMessages");
        this.checkNewMessages();
        //this.RetrieveInbox("Inbox");
        //this.RetrievePrimaryData();
        // we don't need to start it, retrieving it already starts it, right?
        //this.StartTimedRetrieval();
        //this.$.getGALX.call();
        
        //enyo.application.mainAppWindow = window;
        //this.$.outbox.timedMessageSend();
    },
    
});

enyo.kind({
    name: "GoogleVoiceAPI",
    kind: "Component",
    components: [
        { kind: "WebService", onFailure: "webFailure", components:
            [
                { contentType: "application/x-www-form-urlencoded; charset=utf-8", },
                { name: "getInbox", method: "GET", onSuccess: "InboxReceived", onFailure: "InboxFailed", url: "https://www.google.com/voice/inbox/recent/inbox" },
                { name: "getGALX", method: "GET", onSuccess: "GALXReceived", onFailure: "GALXFailed", url: "https://accounts.google.com/ServiceLoginAuth" /*url: "http://www.google.com/voice/m"*/ },
                //{ name: "getRequestHeaders", method: "GET", onSuccess: "requestHeadersReceived", url:"http://www.maxwell-media.com/php-request-data/all-request-varibles-and-my-request-data/my_server.php" },
                { name: "messageSearch",  method: "GET",  onSuccess: "InboxReceived",       onFailure: "InboxFailed",       url: "https://www.google.com/voice/inbox/search" },
                { name: "getPrimaryData", method: "GET",  onSuccess: "PrimaryDataReceived", onFailure: "PrimaryDataFailed", url: "https://www.google.com/voice/?ui=desktop" },
                { name: "CallNumber",     method: "POST", onSuccess: "CallSent",            onFailure: "CallFailed",        url: "https://www.google.com/voice/call/connect/" },
                { name: "callCancel",     method: "POST", onSuccess: "CallCancelled",       onFailure: "CallCancelFailed",  url: "https://www.google.com/voice/call/cancel/" },
                { name: "getLogin",       method: "POST", onSuccess: "LoginReceived",       onFailure: "LoginFailed",       url: "https://www.google.com/accounts/ClientLogin" },
                { name: "markRead", method: "GET", onSuccess: "MarkReadSuccess", onFailure: "MarkReadFailed", url:"https://www.google.com/voice/m/mark", },
                { name: "archiveMessages",       method: "POST", onSuccess: "archiveSuccess",     onFailure: "archiveFailed",    url: "https://www.google.com/voice/inbox/archiveMessages/", },
                { name: "deleteMessage",      method: "POST", onSuccess: "deleteSuccess",       onFailure: "deleteFailed",      url: "https://www.google.com/voice/inbox/deleteMessages/" },
                { name: "deleteForeverMessage", method: "POST", onSuccess: "deleteForeverSuccess", onFailure: "deleteForeverFailed", url: "https://www.google.com/voice/inbox/deleteForeverMessage/" },
                { name: "starMessage",    method: "POST", onSuccess: "StarSuccess",         onFailure: "StarFailed",        url: "https://www.google.com/voice/inbox/star/", },
                { name: "vmDownload",     method: "GET", onSuccess: "DownloadSuccess",     onFailure: "DownloadFailure",   url: "https://www.google.com/voice/media/send_voicemail/" },
                { name: "queryBillingCredit", method: "POST", onSuccess: "billingCreditReceived", onFailure: "billingCreditFailed", url: "https://www.google.com/voice/settings/billingcredit/", components: [ { contentType: "application/x-www-form-urlencoded; charset=utf-8" }, ]},
                // TODO: can you /getGeneralSettings/ ?
                { name: "genSettings", method: "POST", onSuccess: "settingsChanged", onFailure: "settingsFailed", url: "https://www.google.com/voice/settings/editGeneralSettings/" },
                { name: "gvLoginMobile", method: "POST", onSuccess: "mobileLoginSuccess", url: "https://accounts.google.com/ServiceLoginAuth" },
                { name: "gvLogoutMobile", method: "GET", onSuccess: "mobileLogoutSuccess", url:"https://www.google.com/voice/account/msignout" },
                { name: "gvAddToContacts", method: "POST", onSuccess: "addContactSuccess", onFailure: "addContactFailure", url: "https://www.google.com/voice/phonebook/quickAdd/", },
                { name: "editDefaultForwarding", method: "POST", onSuccess: "forwardingChanged", url: "https://www.google.com/voice/settings/editDefaultForwarding/" },
                { name: "blockCaller", method: "POST", onSuccess: "callerBlocked", url: "https://www.google.com/voice/inbox/block/", },
            ]
        },
    ],
    events: {
        "onLoggedIn": "",
    },
    create: function()
    {
        this.inherited(arguments);
        this.AuthCode = "";
        this.Messages = [];
        this.MessageIndex = [];
        this.selectedID = "";
        enyo.log("create");
        enyo.loggingIn = false;
        enyo.application.api = this;
    },
    ready: function()
    {
        var username = prefs.get("gvUsername");
        var pass = prefs.get("gvPassword");
        if(!username || !pass)
            return;
        enyo.log("ready");
        enyo.loggingIn = true;
        this.$.gvLogoutMobile.call(); // make sure we're getting a fresh login
        enyo.application.api = this;
    },
    beginLogin: function(username, password) {
        if(enyo.loggingIn)
            return;
        prefs.set("gvUsername", username);
        prefs.set("gvPassword", password);
        enyo.loggingIn = true;
        this.$.gvLogoutMobile.call();
    },
    mobileLogoutSuccess: function(inSender, inResponse)
    {
        var username = prefs.get("gvUsername");
        var pass = prefs.get("gvPassword");
        if(!username || !pass || username == "undefined" || pass == "undefined")
        {
            enyo.loggingIn = false;
            return;
        }
        this.GALXReceived(inSender, inResponse); // try to parse it from our logout!
    },
    GALXReceived: function(inSender, inResponse)
    {
        try {
            this.GALX = inResponse.match(/name="GALX"\s*value="?(.*)?"/)[0];
            var i = this.GALX.indexOf("value=")+6;
            this.GALX = this.GALX.substring(i+1, this.GALX.length-1);
        } catch(e) {
            enyo.log("GALXReceived: did not find GALX .. reget?");
            this.GALX = enyo.getCookie("GALX");
            //this.RetrieveInbox();
        }
        try {
            this.dsh = inResponse.match(/name="dsh"\s*value="?(.*)?"/)[0];
            var i = this.dsh.indexOf("value=")+6;
            this.dsh = this.dsh.substring(i+1, this.dsh.length-1);
        } catch(e) {
            this.dsh = enyo.getCookie("dsh");
        }

        enyo.log("GALX=", this.GALX, "dsh=", this.dsh);        
        if(!this.GALX)
        {
            enyo.log("Failed to find GALX, but Google isn't always sending it to us anymore??..");
            this.doMobileLogin();
            //this.$.gvLogoutMobile.call();
            //this.regettingGALX = true;
        } else {
            this.doMobileLogin();
        }        
    },
    doMobileLogin: function()
    {
        var params = {
            ltmpl:"mobile",
            "continue":"https://www.google.com/voice/m",
            followup:"https://www.google.com/voice/m",
            service:"grandcentral",
            btmpl:"mobile",
            timeStmp:"",
            secTok:"",
            GALX:this.GALX,
            Email:prefs.get("gvUsername"),
            Passwd:prefs.get("gvPassword"),
            PersistentCookie:"yes",
            rmShown:"1",
            signIn:"Sign in",
        };
        enyo.log("doMobileLogin", params);        
        this.$.gvLoginMobile.call( params );
    },
    mobileLoginSuccess: function(inSender, inResponse)
    {
        //enyo.log("mobileLoginSuccess inResponse=" + inResponse);
        this.doLogin(prefs.get("gvUsername"), prefs.get("gvPassword"));
    },
    doLogin: function(username, password)
    {
        var params= {
            "accountType": "GOOGLE",
            "Email": username,
            "Passwd": password,
            "service": "grandcentral",
            "source": "ericBlade-GoogleLogin-0.2.0",
        }
        this.$.getLogin.call(params);
        prefs.set("gvUsername", username);
        prefs.set("gvPassword", password);
    },
    LoginReceived: function(inSender, inResponse)
    {
        //enyo.log("response", inResponse);
        var AuthIndex = inResponse.lastIndexOf("Auth=");
        if(AuthIndex == -1)
            enyo.log("LoginReceived: " + inResponse);
        else
            enyo.log("LoginReceived ");
        
        this.AuthCode = inResponse.substring(AuthIndex+5, inResponse.length-1);
        enyo.log("AuthCode received", this.AuthCode);
        
        var x = inResponse.indexOf("SID=");
        var y = inResponse.lastIndexOf("LSID=");
        this.SID = inResponse.substring(x+4,y-1);
        this.LSID = inResponse.substring(y+5, AuthIndex-1);
        
        enyo.setCookie("SID", this.SID, { "Max-Age": -1 });
        enyo.setCookie("LSID", this.LSID, { "Max-Age": -1 });
        
        enyo.log("SID", this.SID, "LSID", this.LSID);
        
        this.RetrievePrimaryData();
        if(enyo.application.mainApp)
        {
            if(this.AuthCode)
            {
                enyo.application.mainApp.LoginReceived();
            }
            else
            {
                enyo.application.mainApp.LoginFailed();
                enyo.loggingIn = false;
            }
        }
    },
    LoginFailed: function(inSender, inResponse) {
        if(enyo.application.mainApp)
        {
            enyo.loggingIn = false;
            enyo.application.mainApp.LoginFailed(inSender, inResponse);
        }
    },
    RetrievePrimaryData: function()
    {
        this.$.getPrimaryData.headers= { "Authorization":"GoogleLogin auth="+this.AuthCode };
        this.$.getPrimaryData.call();
    },
    PrimaryDataReceived: function(inSender, inResponse)
    {
        enyo.log("PrimaryDataReceived");
        enyo.loggingIn = false;
        this.PrimaryData = ParsePrimaryData(inResponse);
        //enyo.log(this.PrimaryData);
        if(this.PrimaryData && this.PrimaryData.userName && this.PrimaryData._rnr_se && enyo.application.mainApp)
        {
            enyo.application.mainApp.PrimaryDataReceived();
        }
        this.doLoggedIn();        
    },
    doLogout: function()
    {
        enyo.log("doLogout");
        enyo.loggingIn = false;
        this.$.gvLogoutMobile.call();
        prefs.del("gvUsername");
        prefs.del("gvPassword");
        enyo.setCookie("GALX", undefined, { "Max-Age":0 });
        enyo.setCookie("dsh", undefined, { "Max-Age":0 });
        enyo.setCookie("SID", undefined, { "Max-Age":0 });
        enyo.setCookie("LSID", undefined, { "Max-Age":0 });
        delete this.GALX;
        delete this.AuthCode;
                
        this.PrimaryData.length = 0;
        this.MessageIndex.length = 0;
        this.Messages.length = 0;
        
        if(enyo.application.mainApp)
        {
            enyo.nextTick(enyo.application.mainApp, enyo.bind(enyo.application.mainApp, enyo.application.mainApp.doLogout));
            //enyo.application.mainApp.doLogout();
        }
    },
});

function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    return (hours < 10 ? "0" : "") + hours+":" + (minutes < 10 ? "0" : "") + minutes+":"+(seconds < 10 ? "0" : "") + seconds;
    return (minutes < 10 ? "0" : "") + minutes+":" + (seconds < 10 ? "0" : "") + seconds;
}
