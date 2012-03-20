enyo.kind({
	name: "myAppLaunch",
	kind: "Component",
    windowActivated: function()
    {
        this.log();
        enyo.application.mainApp.isForeground = true;
        enyo.application.mainApp.restartTimedRetrieval();
    },
    windowDeactivated: function()
    {
        this.log();
        enyo.application.mainApp.isForeground = false;
        enyo.application.mainApp.restartTimedRetrieval();
    },
        
	components: [
            { name: "api", kind: "GoogleVoiceAPI", onLoggedIn: "LoggedIn" },
            { kind: "WebService", onFailure: "webFailure", components:
                [
                    { contentType: "application/x-www-form-urlencoded; charset=utf-8", },
                    { name: "getInbox",       method: "GET",  onSuccess: "InboxReceived",       onFailure: "InboxFailed",       url: "https://www.google.com/voice/inbox/recent/inbox" },
                    { name: "getLogin",       method: "POST", onSuccess: "LoginReceived",       onFailure: "LoginFailed",       url: "https://www.google.com/accounts/ClientLogin" },
                ]
            },
// Application events handlers
		{kind: "ApplicationEvents", 
			// we want to be able to save prefs or 
			// something when the app is close
			onUnload: "cleanup",
                        onWindowActived: "windowActivated", onWindowDeactived: "windowDeactivated",
		},
            { kind: "PalmService", service: "palm://com.palm.power/timeout/", onFailure: "timerFailure", components:
                [
                    { name: "setRefreshTimer", method: "set", onSuccess: "refreshTimerSet" },
                    { name: "clearRefreshTimer", method: "clear" },
                ]
            },
            { name: "CreateSynergyAccount", kind: "PalmService", service: "palm://com.palm.service.accounts/", method: "createAccount", onSuccess: "synergyAccountCreated", onFailure: "synergyAccountFailed" },
 
	],
        synergyAccountCreated: function(inSender, res)
        {
            /*  {"result":{"_kind":"com.palm.account:1","templateId":"com.ericblade.googlevoiceapp.account",
                "username":"(configure in GVoice app)","alias":"Google Voice","beingDeleted":false,
                "capabilityProviders":[{"id":"com.ericblade.googlevoiceapp.sms","capability":"PHONE"}],
                "_id":"++Hs9+gGfJF3eKSa"},"returnValue":true} */
            this.log(res);
        },
        synergyAccountFailed: function(inSender, res)
        {
            /*  {"errorText":"Unable to create a duplicate account","errorCode":"DUPLICATE_ACCOUNT","exception":"[object Object]","returnValue":false}, */
            this.log(res);
        },
	create: function (inSender, inEvent) {
            this.USESYNERGY = false;
		this.inherited(arguments);
                prefs.def("ignoreNotificationList", { });
                prefs.def("gvAlertTone", "Default");
                try {
                    var changedList;
                    this.IgnoreNotificationsList = enyo.json.parse(prefs.get("ignoreNotificationsList"));
                    var ctime = new Date().getTime() / 1000;
                    for (x in this.IgnoreNotificationsList)
                    {
                        if(this.IgnoreNotificationsList.hasOwnProperty(x) && this.IgnoreNotificationsList[x] < (ctime - (86400 * 7)) ) // if it's more than a week old, kill it
                        {
                            this.log("***** Throwing Out ignoreNotification:", x, this.IgnoreNotificationsList[x]);
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
                this.$.CreateSynergyAccount.call(
                        {
                            "templateId": "com.ericblade.googlevoiceapp.account",
                            "capabilityProviders": [{ "id": "com.ericblade.googlevoiceapp.phone", "capability":"PHONE"},
                                                    { "id": "com.ericblade.googlevoiceapp.contacts", "capability": "CONTACTS" },
                                                    //{ "id": "com.ericblade.googlevoiceapp.text", "capability":"MESSAGING", "capabilitySubtype": "SMS"},
                                                    {"id": "com.ericblade.googlevoiceapp.im", "capability":"MESSAGING" }],
                            "username": "blade.eric",
                            "alias": "GVoice",
                            "credentials": { "common": {"password":"password", "authToken":"authToken"} },
                            "config": { "ip": "8.8.8.8" }
                        } 
                );
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
		this.log("Relaunch in myAppLaunch", params, params.action);
                this.setAlarm();
                if(params.action == "checkNewMessages")
                {
                    enyo.application.quickMessageCheck = true;
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
		    this.mainApp = enyo.windows.activate(path, type, windowParams);
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
            this.log("timer check");
        },
        startTimer: function(x) {
			prefs.def("fgRefresh", 2);
			prefs.def("bgRefresh", 5);
            
            var interval = enyo.application.mainApp.isForeground ? prefs.get("fgRefresh") : prefs.get("bgRefresh");
            if(!this.timerInterval || this.timerInterval === 0)
                this.timerInterval = setInterval(this.sendMessageToApp, 60 * interval * 1000);
        },
        setAlarm: function() // TODO: need to make this accept an incoming time, and set "in" to that
        {
			var bg = prefs.get("bgRefresh");
			var time = (bg < 5) ? "00:05:00" : secondsToTime(bg * 60);
			if(bg < 5) {
				var unixTime = parseInt((new Date).getTime() / 1000) + (bg * 60);
				var dt = new Date(unixTime * 1000);
				time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
			}
			enyo.error("**** Set Alarm for ", time, bg);
            if(window.PalmSystem)
            {
				if(bg < 5) {
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
					
				} else {
					this.$.setRefreshTimer.call({
						"key": "com.ericblade.gvoicerefreshtimer",
						"in": time,
						"uri": "palm://com.palm.applicationManager/launch",
						"params": enyo.json.stringify(
							{
								'id':'com.ericblade.googlevoiceapp',
								'params': { 'action' : 'checkNewMessages' },
							})
					});
				}
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
            if(enyo.application.mainAppWindow && enyo.application.mainAppWindow.name)
                enyo.application.mainAppWindow.postMessage("retrieveInbox", "*");
        },
 
	something: function () {
		this.log("We're gonna do something without an app window! (better hope it's quick)");
	},
 
	// cleanup was defined above as the onUnload handler for application events
	// we'll use it to save any changes to our appPrefs
	cleanup: function () {
		this.log("Cleanup in appLaunch");
                //window.close();
        },
    getAlertPath: function() {
        var x = prefs.get("gvAlertTone");
        switch(x) {
            case "None": return "";
            case "Default": return "Bell"; // non-existant one should give us a "ding"
            default: return "/media/internal/ringtones/"+x+" (short).mp3";
        }
    },
	PostNotification: function(msgid, msg, nonamemsg, msgtext)
	{
		var wkn = window.webkitNotifications;
		if(window.PalmSystem)
		{
			this.actuallyPostNotification(msgid, msg, nonamemsg, msgtext);
		} else if(wkn) {
			if(wkn.checkPermission()) { // 1 = Not Allowed, 2 = Denied, 0 = Allowed
				wkn.requestPermission(enyo.bind(this, this.actuallyPostNotification, msgid, msg, nonamemsg, msgtext));
			} else {
				this.actuallyPostNotification(msgid, msg, nonamemsg, msgtext);
			}
		}
	},
    actuallyPostNotification: function(msgid, msg, nonamemsg, msgtext)
    {
		var ignoreid = msgid.substr(-5) + msgtext.substr(-5); // just use the last 5 characters of the id and the text .. hopefully will work
		
        this.log();
		/* Initialize some junk we need */
		if(!this.NotificationDashboards)
			this.NotificationDashboards = { };
		if(!this.NotificationDashboards[0])
		{
			this.NotificationDashboards[0] = this.createComponent( {
				kind: "Dashboard",
				smallIcon: "images/google-voice-icon24.png",
				icon: "images/google-voice-icon48.png",
				onMessageTap: "dashboardTap",
				onIconTap: "dashboardTap",
			});
		}
		
        if(window.PalmSystem)
        {
			if(this.IgnoreNotificationsList[ignoreid]) {
				this.log("*** IGNORING POSTNOTIFICATION FOR " + ignoreid);
				return;
			}
			if(!this.NotificationDashboards[msgid] || this.NotificationDashboards[msgid].ignoreid != ignoreid) {
				this.NotificationDashboards[msgid] = { icon: "mainApp/images/google-voice-icon48.png",
														smallIcon: "mainApp/images/google-voice-icon24.png",
														title: msg, text: msgtext,
														id: msgid, ignoreid: ignoreid };
				this.NotificationDashboards[0].push(this.NotificationDashboards[msgid]);
				enyo.windows.addBannerMessage(msg, '{}', "mainApp/images/google-voice-icon24.png", "", this.getAlertPath());
				if(enyo.application.mainApp && prefs.get("ttsNotificationDisable", true) != 1) // TODO: can't speak until mainApp is loaded :(
				{
					enyo.application.mainApp.speak( prefs.get("ttsAnnounceName") == 1 ? msg : nonamemsg );
					if(prefs.get("ttsAnnounceMessages", true) == 1 && msgtext && msgtext != "")
					{
						enyo.application.mainApp.speak(msgtext); // TODO: Move the speech plugin to here ... 
					}
				}
				this.log("************************ NOTIFICATION POSTED ******************** ");
			}
			//this.NotificationDashboards[0].onDashboardActivated = "dashboardActivated";
			this.NotificationDashboards[0].onLayerSwipe = "dashboardLayerSwipe";
			this.NotificationDashboards[0].onUserClose = "dashboardClosed";
		} else if(window.webkitNotifications) {
			var wkn = window.webkitNotifications;
			enyo.log("webkitNotifications available, permission=" + wkn.checkPermission());
			if(wkn.checkPermission() === 0) // 0 = Allowed, 1 = Not Allowed, 2 = Denied
			{
				if(!this.NotificationDashboards[msgid] || this.NotificationDashboards[msgid].ignoreid != ignoreid) {
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
						this.NotificationDashboards[msgid] = note;
						this.log("************************ NOTIFICATION POSTED ******************** ");						
					} catch(err) { // throw security error
						enyo.log("error posting notification:" + err);
					}
				} else {
					enyo.log("duplicate notification");
				}
			}
		} else {
			enyo.log("No known notification system");
		}
    },
    dashboardLayerSwipe: function(inSender, layer)
    {
        var ignoreid;
        var x;
        if(!layer) {
            for(x in this.NotificationDashboards)
            {
                this.log("ignoreid could be", this.NotificationDashboards[x].ignoreid);
                ignoreid = this.NotificationDashboards[x].ignoreid;
            }
        } else {
            ignoreid = layer.id.substr(-5) + layer.text.substr(-5); // just use the last 5 characters of the id and the text .. hopefully will work
            this.clearNotificationsFor(layer.id);
        }
        this.log("Ignoring Notification for", ignoreid);
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
        this.log("**************** DASHBOARD ACTIVATED ***************** ");
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
        this.log(enyo.application.quickMessageCheck);
        if(enyo.application.quickMessageCheck)
        {
            this.checkNewMessages();
        }
    },
    checkNewMessages: function()
    {
        this.log();
        if(prefs.get("newMessageNotifyDisable") == 1)
        {
            return;
        }
        if(this.$.api.AuthCode)
        {
            var type = "inbox";
            this.$.getInbox.setUrl("https://www.google.com/voice/inbox/recent/" + type + "/");
            this.$.getInbox.headers= { "Authorization":"GoogleLogin auth="+this.$.api.AuthCode };
            this.$.getInbox.call( { page:"p1" } );
        } else {
            this.log("can't check messages, we aren't logged in");
        }
    },
    InboxFailed: function(inSender, inResponse)
    {
        this.log(inResponse);
        if(inResponse.indexOf("Unauthorized") > -1 && inResponse.indexOf("Error 401") > -1)
        {
            this.doLogin(prefs.get("gvUsername"), prefs.get("gvPassword"));   
        }
    },
    InboxReceived: function(inSender, inResponse)
    {
		var bForwardToApp = false;
        //this.log(inResponse);
		enyo.error("Launcher InboxReceived");
        var i = inResponse.indexOf("<json><!")+14;
        var j = inResponse.lastIndexOf("></json>")-1;
        
        try {
            inboxJSON = JSON.parse(inResponse.substring(i, j))[0];
        } catch(err) {
            this.log("********** UNABLE TO READ INBOX, ARE WE OFFLINE? ");
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
            this.log("parsing msg", id);
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
                    if(!disable || disable == 0)
                        this.PostNotification(this.MessageIndex[index].id, "New "+type+" from " + this.displayNameOrNumber(index), "New " + type + " received", this.Messages[index][i-1] ? this.Messages[index][i-1].SentMessage : "");
                } else if(this.NotificationDashboards && this.NotificationDashboards[this.MessageIndex[index].id]) 
                {
                    this.clearNotificationsFor(this.MessageIndex[index].id);
                }
                index++;
            }
        }
		enyo.error("Launcher bForwardToApp", bForwardToApp, enyo.application.mainApp, enyo.application.mainApp.$.boxPicker.getValue(), parseInt(enyo.application.mainApp.$.pagePicker));
		if(bForwardToApp && enyo.application.mainApp && enyo.application.mainApp.$.boxPicker.getValue() == "Inbox" && parseInt(enyo.application.mainApp.$.pagePicker) == 1)
		{
			// HACK: forward all the crap we already did anyway over to the main app.. sigh.
			enyo.application.mainApp.InboxReceived(inSender, inResponse);
		}
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
            this.log();
            this.$.getLogin.call(params);
        }
        prefs.set("gvUsername", username);
        prefs.set("gvPassword", password);
    },
    LoginReceived: function(inSender, inResponse) {
        var AuthIndex = inResponse.lastIndexOf("Auth=");
        if(AuthIndex == -1)
            this.log("LoginReceived: " + inResponse);
        else
            this.log("LoginReceived ");
        
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
        this.log();
        this.loggingIn = false;
        enyo.application.api = this;
    },
    ready: function()
    {
        var username = prefs.get("gvUsername");
        var pass = prefs.get("gvPassword");
        if(!username || !pass)
            return;
        this.log();
        this.loggingIn = true;
        this.$.gvLogoutMobile.call(); // make sure we're getting a fresh login
        enyo.application.api = this;
    },
    beginLogin: function(username, password) {
        if(this.loggingIn)
            return;
        prefs.set("gvUsername", username);
        prefs.set("gvPassword", password);
        this.loggingIn = true;
        this.$.gvLogoutMobile.call();
    },
    mobileLogoutSuccess: function(inSender, inResponse)
    {
        var username = prefs.get("gvUsername");
        var pass = prefs.get("gvPassword");
        if(!username || !pass || username == "undefined" || pass == "undefined")
        {
            this.loggingIn = false;
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
            this.log("GALXReceived: did not find GALX .. reget?");
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

        this.log("GALX=", this.GALX, "dsh=", this.dsh);        
        if(!this.GALX)
        {
            this.log("Failed to find GALX, but Google isn't always sending it to us anymore??..");
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
        this.log(params);        
        this.$.gvLoginMobile.call( params );
    },
    mobileLoginSuccess: function(inSender, inResponse)
    {
        this.log();
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
            this.log("LoginReceived: " + inResponse);
        else
            this.log("LoginReceived ");
        
        this.AuthCode = inResponse.substring(AuthIndex+5, inResponse.length-1);
        this.log("AuthCode received", this.AuthCode);
        
        var x = inResponse.indexOf("SID=");
        var y = inResponse.lastIndexOf("LSID=");
        this.SID = inResponse.substring(x+4,y-1);
        this.LSID = inResponse.substring(y+5, AuthIndex-1);
        
        enyo.setCookie("SID", this.SID, { "Max-Age": -1 });
        enyo.setCookie("LSID", this.LSID, { "Max-Age": -1 });
        
        this.log("SID", this.SID, "LSID", this.LSID);
        
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
                this.loggingIn = false;
            }
        }
    },
    LoginFailed: function(inSender, inResponse) {
        if(enyo.application.mainApp)
        {
            this.loggingIn = false;
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
        this.log();
        this.loggingIn = false;
        this.PrimaryData = ParsePrimaryData(inResponse);
        //this.log(this.PrimaryData);
        if(this.PrimaryData && this.PrimaryData.userName && this.PrimaryData._rnr_se && enyo.application.mainApp)
        {
            enyo.application.mainApp.PrimaryDataReceived();
        }
        this.doLoggedIn();        
    },
    doLogout: function()
    {
        this.log();
        this.loggingIn = false;
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
