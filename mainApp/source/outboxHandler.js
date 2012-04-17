enyo.kind({
	name: "WebRequestReturn",
	kind: "enyo.WebService.Request",
	call: function() {
		var params = this.params || "";
		params = enyo.isString(params) ? params : enyo.objectToQuery(params);
		//
		var url = this.url;
		if (this.method == "GET" && params) {
			url += (url.indexOf('?') >= 0 ? '&' : '?') + params;
			params = null;
		}
		//
		var headers = {
			"Content-Type": this.contentType
		};
		enyo.mixin(headers, this.headers);
		//
		return enyo.xhr.request({
			url: url,
			method: this.method,
			callback: enyo.bind(this, "receive"),
			body: params,
			headers: headers,
			sync: window.PalmSystem ? false : this.sync,
			username: this.username,
			password: this.password
		});
	}
});

enyo.kind( {
    name: "outboxHandler",
    kind: "Component",
    requestKind: "WebRequestReturn",
    components: [
        { kind: "WebService", onFailure: "webFailure", components:
            [
                { contentType: "application/x-www-form-urlencoded; charset=utf-8", },
                { name: "sendSMS", method: "POST", onSuccess: "SMSSent",             onFailure: "SMSFailed",         url: "https://www.google.com/voice/sms/send/" },
            ]
        }
    ],
    events: {
        "onAllMessagesSent":"",
    },
    constructor: function() {
        this.inherited(arguments);
        if(localStorage["outboxMessages"])
            this.messages = enyo.json.parse(localStorage["outboxMessages"]);
        else
            this.messages = [];
        this.sentCounter = 0;
        if(!this.messages)
            this.messages = [];
        enyo.log("outbox startup: size " + this.messages.length);
        if(!localStorage["outMsgId"])
            localStorage["outMsgId"] = "0";
        enyo.log("next outgoing msg id: " + localStorage["outMsgId"]);
        // todo: try to insta spool out here
        if(this.messages.length > 0)
            this.timer = setInterval(function(thisObj) { thisObj.timedMessageSend(); }, 10000, this);
    },
    startTimer: function() {
        this.timer = setInterval(function(thisObj) { thisObj.timedMessageSend(); }, 10000, this);
    },
    stopTimer: function() {
        clearInterval(this.timer);
        this.timer = 0;
    },
    timedMessageSend: function()
    {
        enyo.application.debuglog("**************************************************** outboxHandler: " + this.messages.length + " messages=" + this.messages);
        enyo.log("timedMessageSend");
        if(!this.messages || this.messages.length == 0)
        {
			// reload messages from the localStorage, in case we've been changed, such as due to messaging app sending us something
			// note that this could race condition, if we had a memory stored one and a local storage stored one .. derp
			if(localStorage["outboxMessages"])
			    this.messages = enyo.json.parse(localStorage["outboxMessages"]);
			else
			    this.messages = [];
			if(this.messages.length == 0)
			{
				clearInterval(this.timer);
				this.timer = 0;
				return;
			}
        }
        if(!enyo.application.mainApp.PrimaryData)
            return; // run it again next time maybe they've logged in by then
        for(var x = 0; x < this.messages.length; x++)
        {
            if(this.messages[x].to && this.messages[x].msg)
            {
                var params = {
                    id: "",
                    phoneNumber: this.messages[x].to,
                    text: this.messages[x].msg,
                    _rnr_se: enyo.application.mainApp.PrimaryData._rnr_se
                };
                this.$.sendSMS.headers = { "Authorization": "GoogleLogin auth=" + enyo.application.mainApp.AuthCode };
                enyo.application.debuglog("*> Spool SMS from Outbox to " + this.messages[x].to);
                //enyo.log("***> Spool SMS from Outbox to " + this.messages[x].to);
                var req = this.$.sendSMS.call(params);
                req.bog = this.messages[x].id;
            }
        }
		/* Clear all the shit out so it can't duplicate */
		this.messages = [];
    },
    queueMessage: function(to, msg)
    {
        enyo.log("queueMessage", to, msg);
        this.messages.push({ to:to, msg:msg, id:parseInt(localStorage["outMsgId"]) });
        var id = parseInt(localStorage["outMsgId"]) + 1;
        localStorage["outMsgId"] = id+'';
        /*if(!this.timer || this.timer == 0 && enyo.application.mainApp.Online)
        {
            this.timer = setInterval(function(thisObj) { thisObj.timedMessageSend(); }, 10000, this);
        }*/
        if(enyo.application.mainApp.Online)
            this.timedMessageSend();
        localStorage["outboxMessages"] = JSON.stringify(this.messages);
    },
    clearqueue: function() {
        localStorage["outboxMessages"] = JSON.stringify([ ]);
        this.messages = [ ];
    },
    SMSSent: function(x, y, z)
    {
        if(y.ok == true) {
            for(var i = 0; i < this.messages.length; i++)
            {
                if(parseInt(this.messages[i].id) == parseInt(z.bog))
                {
                    this.messages.splice(i, 1);
                    localStorage["outboxMessages"] = JSON.stringify(this.messages);
                    this.sentCounter++;
                    break;
                }
            }
            if(this.messages.length == 0)
            {
                clearInterval(this.timer);
                this.doAllMessagesSent(this.sentCounter);
				localStorage["outboxMessages"] = JSON.stringify( [ ] );
                this.sentCounter = 0;
                this.timer = 0;
            }
        } else if(!this.timer || this.timer == 0 /*&& enyo.application.mainApp.Online*/)
        {
            enyo.windows.addBannerMessage("Message Queued", '{}', "images/google-voice-icon24.png", "")
            this.startTimer();
        }
    },
    SMSFailed: function()
    {
        this.log();
        if(!timer || timer == 0 && enyo.application.mainApp.Online) {
            enyo.windows.addBannerMessage("Message Queued", '{}', "images/google-voice-icon24.png", "")
            this.startTimer();
        }
    }
});