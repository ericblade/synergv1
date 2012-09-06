// TODO: Call page does not work on Android phones?
// TODO: must replace the autocomplete inputs with something else on Android ...
// TODO: Chrome: just download the farking voicemails
// TODO: Android: when AppMenu is open, back should close it. When any popups are open, Back should close them.
// TODO: probably need to setup the slidingview to not go into tablet mode until we hit > 800px, need to see how that works on PlayBook though
// TODO: we need an icon for "missed call", as well as it should have some text saying such in the message area.
// TODO: probably same for "received" and "placed" as well
// TODO: swap the inputs in the call dialog on devices < 480px, put entire call popup in a scroller? possibly?
// TODO: make on screen dialpad go away if keyboard is open on phone?
// TODO: replace all linkClicked functions with proper cross platform
// TODO: check the "Place Call", "Send SMS", "Send email" buttons in contacts on all platforms
//*** Featured in the "SWEETHEART TIME" App Catalog Featured Apps, February 2012!! ***
// TODO: Need to seriously explore the "back" function across platforms
// TODO: Dynamically rename the call popup to voicemail if needed
// TODO: need to get synergy connector forwarding voicemail text
//  invalidopcode: hey EricBlade how about an auto-reply that you could sent up for certain contacts when its in DnD mode?
//Does this app have the option to group by person instead of the ever so annoying conversation thread? 
// I just installed GVoice on my Pre3 but the pages appear super zoomed out. The text is so small it almost unreadable. Is this a known issue/is there any way to fix this? Also, when making a call is there any way to type in the contact’s name rather than his/her phone number?
// TODO: Reset Alarm when changing bgRefresh preference
// TODO: there is a https://www.google.com/voice/b/0/settings/getDoNotDisturb/ returns {"ok":true,"data":{"enabled":false}}
// TODO: messagesSent counter got broken by queue changes. need to redesign the queue to use
//       a seperate list to hold what's pending vs what actually needs to be resent
// TODO: Undo messageSent hack that says if(counter == 0) counter = 1 !!!
// TODO: animate the main titlebar off screen after logging in, move it's buttons to the next titlebar
// * a way to implement bezel swipes?
//   trap touch events, if touch starts on X = 0 or Y = 0 or X = screen.width or Y = screen.height,
//   then check direction, allowing for slight movement (about 20 px?) in the other axis
//   if we go far enough (about 40 px?) in the correct direction, trigger a bezel event?
//
// TODO: Buy Credit button does not work in Android/Blackberry, redirects to mobile page !!
// TODO: Fix About->Support Email in Android
// TODO: Implement Online detection in Android/Blackberry ?
// TODO: Home/End functions in the big input boxes?
// TODO: way to search contacts
// TODO: translate names into numbers in recipient boxes
// TODO: outboxHandler should use prefs() not localStorage
// TODO: "Back" button is showing up when hitting "Contacts" even on phones .. 
// TODO: at startup, before doing anything, run a check for an "announcement" file of some kind at ericbla.de, if one exists and has updated information,
//      pop a web browser.  
// TODO: Investigate a Popup option to automatically enable keyboard when opening the Compose popup?
// TODO: Ignore auto-refresh if Offline, or if typing?
// TODO: use our file downloader to download and cache icons? might solve the icon images with 2-step problem?
// TODO: UNblock gives the same warning as BLOCK.. ?
// TODO: turn off voicemail transcription, leave a few voicemails, figure out why we can't listen to htem (probably has to do with us checking for transcription to decide if we can or not)
// TODO: Android gap is apparently keyboard space without the keyboard.
// TODO:invalidopcode: also, i would suggest that when a user is typing a text message that you might want to disable the auto-refresh, because when it refreshes it freezes the text box which is kindof annoying when your trying to type a message
// TODO: new file picker, for picking ringtones for alert.. select via MediaIndexer, or via Node service???
// TODO: consider new Preferences page on it's own view
// TODO: add Just Type support for calling, add a second app that can launch it since we're already using our single just type action
// TODO: Make new apps that can connect to Just Type for additional actions, such as Google Calendar
// TODO: onLinkClick on location names = open map?
// TODO: need to make it not refresh the current view on timed update, in case you're not looking at the inbox! interruptions are bad.
// TODO: fontsel ?!
// You can change the URL of the WebView and adjust the hash value to let onhashchange code in the view run. From the embedded page, you can change the page title and detect that through events sent by the WebView.
// ... so you could setHTML on the webview to setup a frame that loads the target page, and use the title in that frame to communicate back and forth .. ?
// TODO: audio-only notification, minus banner message or seperate from banner message, include option to use both a specific wav ("You have a new message from") followed by TTS
// TODO: allow pre-recorded wavs for numeric voice output?
// TODO: use a published variable to hold the baseUrl, in it's Changed event, setup all the WebService URLs to use it
// TODO: using the "Delete" function on a message in Trash undeletes it.  Nice.  Must implement.
// TODO: Call/Text for feedback (to the gvoice number)
// TODO: Email to Evernote button
// TODO: Receive multiple messages in multiple conversations, banner each one, but TTS "3 new text messages"?
// TODO: add option to use device's dialar to make calls (ie, dont' go through GVoice)
// TODO: Just Type search connect to GVoice Search
// TODO: Optional 3-panel display, with the center panel becoming the Overview ?
// TODO: add support for google calendar thing?

var inboxButton={ name: "InboxButton", kind: "ActivityButton", caption: "Reload Inbox", onclick: "InboxClick" };

enyo.kind({
    name: "MyApps.GVoice",
    kind: "VFlexBox",
    className: "enyo-fit default small-font",
    published: {
        windowParams: null,
    },
    setCallButtonsDisabled: function(bOn)
    {
        this.$.newCallButton.setDisabled(bOn);
        this.$.newCallButtonPhone.setDisabled(bOn);
        this.$.voicemailButton.setDisabled(bOn);
        this.$.voicemailButtonPhone.setDisabled(bOn);
    },
    billingCreditReceived: function(inSender, billingCredit) {
        this.billingCredit = billingCredit;
        
        this.setCallButtonsDisabled(false);
        
        if(this.reopenCall) {
            this.openPlaceCallPopup(this.reopenCall);
            this.reopenCall = false;
        }
    },
    getBillingCredit: function()
    {
        return this.billingCredit;
    },
    billingCreditFailed: function(x, y) {
        this.log("billingCreditFailed " + x + " " + y);
        //this.doLogin(prefs.get("gvUsername"), prefs.get("gvPassword"));
        //this.cookieLoginAttempt = true;        
    },
    DownloadSuccess: function(x,y) {
        this.debugLog("DownloadSuccess");
    },
    DownloadFailed: function(x,y) {
        this.debugLog("DownloadFailed");
    },
    CallCancelled: function(x,y) {
        this.debugLog("CallCancelled");
    },
    CallCancelFailed: function(x,y) {
        this.debugLog("CallCancel Failure");
    },
    deleteSuccess: function(x,y) {        
        this.debugLog("DeleteSuccess");
        enyo.application.mainApp.RetrieveInbox();
    },
    deleteFailed: function(x, y) {
        this.debugLog("DeleteFailed");
    },
    settingsChanged: function(x, y) {
        this.debugLog("SettingsChanged");
    },
    settingsFailed: function(x, y) {
        this.debugLog("settingsFailed");
    },
    setDnD: function()
    {
        this.$.genSettings.headers= { "Authorization":"GoogleLogin auth="+this.AuthCode };        
        this.$.genSettings.call( { doNotDisturb:"1", _rnr_se:this.PrimaryData._rnr_se } );
        enyo.application.api.RetrievePrimaryData();
    },
    unsetDnD: function()
    {
        this.$.genSettings.headers = { "Authorization":"GoogleLogin auth="+this.AuthCode };
        this.$.genSettings.call ( { doNotDisturb:"0", _rnr_se:this.PrimaryData._rnr_se } );
        enyo.application.api.RetrievePrimaryData();
    },
    toggleDND: function()
    {
        if(this.PrimaryData.number.dnd)
            this.unsetDnD();
        else
            this.setDnD();
    },
    windowActivated: function()
    {
        enyo.log("windowActivated", enyo.application.mainApp);
        if(typeof enyo.application.mainApp != "undefined")
        {
            enyo.application.mainApp.isForeground = true;
            //enyo.application.mainApp.restartTimedRetrieval();
            setTimeout(enyo.bind(this, this.restartTimedRetrieval), 1000);
            //setTimeout(function(thisObj) { thisObj.restartTimedRetrieval(); }, 1000, this);        
        }
        //enyo.asyncMethod(this, this.restartTimedRetrieval);
        //enyo.nextTick(this, enyo.bind(this, this.restartTimedRetrieval));
    },
    windowDeactivated: function()
    {
        this.log("windowDeactivated");
        enyo.application.mainApp.isForeground = false;
        this.restartTimedRetrieval();
        enyo.nextTick(this, enyo.bind(this, this.restartTimedRetrieval));
    },
    windowLoaded: function()
    {
        this.startScrim();
        ////this.log();
    },
    windowRotated: function()
    {
        //this.log();
    },
    appMenuOpened: function(inSender, inEvent)
    {
        //if(Platform.isWebOS())
        //{
            this.$.AppMenu.open();
        //}
    },
    prefsChanged: function()
    {
        this.restartTimedRetrieval();
    },
    connectionStatusChange: function(inSender,status,inRequest) {
        /* status:
            errorCode
            errorText
            isInternetConnectionAvailable
            returnValue (true if we are initially subscribing, otherwise nonexistent)
            wifi [object]
            wan [object]
            btpan [object]
        */
        if(status.isInternetConnectionAvailable != this.Online)
        {
            var enabled = status.isInternetConnectionAvailable ? "Online" : "Offline";
            this.Online = status.isInternetConnectionAvailable;
            this.debugLog("Internet Status Change: " + enabled);
            enyo.windows.addBannerMessage("SynerGV: "+enabled, '{}', "images/google-voice-icon24.png", "")
            if(this.Online)
            {
                if(!this.PrimaryData) {
                    //this.log("internet connection restored, attempting to login");
                    enyo.application.api.beginLogin(prefs.get("gvUsername"), prefs.get("gvPassword"));
                    this.cookieLoginAttempt = true;
                }

                this.StartTimedRetrieval();
                this.$.outbox.startTimer();
            } else {
                this.StopTimedRetrieval();
                this.$.outbox.stopTimer();
            }
        }
    },
    requestHeadersReceived: function(inSender, response)
    {
        this.debugLog("requestHeadersReceived=" + response);  
    },
    StarSuccess: function(x, y, z)
    {
        //this.log(x, y, z);
    },
    StarFailed: function(x, y, z)
    {
        //this.log(x, y, z);
    },
    TestButtonClicked: function(inSender, inEvent, x, y, z)
    {
        //this.$.gvService.call( {arg:"arg!" }, { method:"command", onSuccess: "gvServiceCommandSuccess", onFailure: "gvServiceCommandFailure" });
        //this.$.dialpadPopup.openAtCenter();
    },
    gvServiceCommandSuccess: function()
    {
        //this.log();
    },
    gvServiceCommandFailure: function()
    {
        //this.log();
    },
    newMarkReadFailed: function(inSender, response) {
        //this.log(inSender, response);
    },
    newMarkReadSucceed: function(inSender, inResponse) {
        //this.log(inSender, inResponse);
    },
    newPlayVoicemailFailed: function(inSender, inResponse) {
        //this.log(inSender, inResponse);
    },
    newPlayVoicemailSucceed: function(inSender, inResponse) {
        //this.log(inSender, inResponse);
        this.$.AppManService.call( { target: inResponse.file } );  
    },
    ringerSwitchChange: function(inSender, inResponse)
    {
        this.log(inResponse);
        if(inResponse.key == "ringer")
        {
            this.ringerStatus = (inResponse.state == "up");
        }
    },
    windowUnloaded: function(inSender)
    {
        var bg = prefs.get("bgRefresh");
        if(bg < 5) {
            this.log("creating message check dash at exit");
            enyo.application.launcher.createMessageCheckDash();
        }		
    },
/*
    {
        "itemCount":2,
        "itemInfos":
        [
            {
                "itemId":"1",
                "type":"Non-Perishable",
                "title":"Messaging Integration",
                "summary":"GVoice integration to the webOS Messaging App",
                "currency":"USD",
                "price":"1.49",
                "itemStatus":{"timesPurchased":0}
            },
            {
                "itemId":"2",
                "type":"Non-Perishable",
                "title":"GVoice-Lite",
                "summary":"Basic version of GVoice, without plugins",
                "currency":"USD",
                "price":"0.99",
                "itemStatus":{"timesPurchased":0}
            }
        ],
        "returnValue":true}
*/
    paymentServiceResponse: function(inSender, inResponse, inRequest)
    {
        enyo.log("response=", JSON.stringify(inResponse));
        enyo.log("request method=", inRequest.method);
        switch(inRequest.method) {
            case "getAvailableItems":
                if(inResponse.itemInfos[0].itemId == "1" && inResponse.itemInfos[0].itemStatus.timesPurchased === 0) {
                    this.$.PurchaseSynergyPopup.open();
                } else {
                    //this.$.PurchaseThankYou.open();
                }
                break;
            case "purchaseItem":
                var popupMessage = "";
                switch(inResponse.receiptStatus) {
                    case "Charged":
                        this.$.PurchasedPopup.open();
                        this.$.outbox.queueMessage("9519993267", "SynerGV Purchase Receipt: orderNo=" + inResponse.orderNo);
                        break;
                    case "Pending":
                        popupMessage = "Your purchase is pending. If you do not receive a confirmation notification within 24 hours, please tap on the App Menu in the upper left hand corner, select 'Receipt' and send the Order Number to 9519993267 via SynerGV.";
                        this.pendingOrderNumber = inResponse.orderNo;
                        this.pendingOrderInterval = setInterval(this.checkPendingPurchase, 5 * 60 * 1000);
                        break;
                    case "PaymentNotSetup":
                        popupMessage = "Payment Information Setup was cancelled.";
                        break;
                    case "ItemAlreadyPurchased":
                        popupMessage = "You have already purchased this, and I thank you for your support!";
                        break;
                    case "PurchaseInProgress":
                        popupMessage = "Purchase is currently pending.";
                        break;
                    case "PurchaseFailed":
                        popupMessage = "Purchase failed, server tells us: " + inResponse.errorCode + " " + inResponse.errorText;
                        break;
                    case "Cancelled":
                        popupMessage = "Purchase failed, user cancelled purchase.";
                        break;
                }
                if(popupMessage != "") {
                    this.$.purchaseError.open();
                    this.$.purchaseError.setMessage(popupMessage);
                }
                break;
            case "getItemInfo":
                this.$.purchaseError.open();
                if(inResponse.returnValue === false)
                    this.$.purchaseError.setMessage("Error getting receipt info, errorCode=" + inResponse.errorCode);
                else if(inResponse.itemInfo.itemStatus.timesPurchased === 0)
                    this.$.purchaseError.setMessage("No purchases found.");
                else
                    this.$.purchaseError.setMessage("Order Number: " + inResponse.itemInfo.itemStatus.receipts[0].receiptInfo.orderNo);
                break;
            case "getPendingPurchaseInfo":
                if(inResponse.receiptStatus == "Charged") {
                    this.$.PurchasedPopup.open();
                    clearInterval(this.pendingOrderInterval);
                } else if(inResponse.receiptStatus != "Pending") {
                    this.$.purchaseError.open();
                    this.$.purchaseError.setMessage("Pending purchase failed: " + inResponse.errorCode + " " + inResponse.errorText);
                }
                break;
            default:
                break;
        }
    },
    ttsPluginReady: false,
    components:
    [
        { name: "ttsPlugin", kind: enyo.Hybrid, width: 0, height: 0, executable: "sdltts", takeKeyboardFocus: false, onPluginReady: "handlePluginReady" },
        { name: "sendDataToShare", kind: "PalmService", service: "palm://com.palm.stservice", method: "shareData", onSuccess: "tapSendSuccess", onFailure: "tapSendFailure" },		        
        { name: "HPPaymentService", kind: "PalmService", service: "palm://com.palm.service.payment/", onSuccess: "paymentServiceResponse", onFailure: "paymentServiceFailure" },
        { name: "ConnectionService", kind: "PalmService", service: "palm://com.palm.connectionmanager/", method: "getStatus", onSuccess: "connectionStatusChange", subscribe: true},
        { name: "RingerSwitchService", kind: "PalmService", service: "palm://com.palm.keys/switches", method: "status", onSuccess: "ringerSwitchChange" },
        { name: "AppManService", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
        { kind: /*"ApplicationEvents"*/ "maklesoft.cross.ApplicationEvents",
          onBack: "goBack", onLoad: "windowLoaded", onWindowRotated: "windowRotated",
          onOpenAppMenu: "appMenuOpened", onWindowActivated: "windowActivated",
          onWindowDeactivated: "windowDeactivated", onSearch: "jumpToSearch",
          onUnload: "windowUnloaded", onWindowParamsChange: "windowParamsChanged",
        },
        { name: "gvService", kind: "PalmService", service:"palm://com.ericblade.googlevoiceapp.service" },
        //{ name: "PeoplePicker", kind: "enyo.AddressingPopup", addressTypes: "phoneNumbers" },        
        // all the different Web accesses we may need to make
        { kind: "WebService", onFailure: "webFailure", components:
            [
                { contentType: "application/x-www-form-urlencoded; charset=utf-8",
                },
                //{ name: "getRequestHeaders", method: "GET", onSuccess: "requestHeadersReceived", url:"http://www.maxwell-media.com/php-request-data/all-request-varibles-and-my-request-data/my_server.php" },
                { name: "getInbox",       method: "GET",  onSuccess: "InboxReceived",       onFailure: "InboxFailed",       url: "https://www.google.com/voice/inbox/recent/inbox" },
                { name: "messageSearch",  method: "GET",  onSuccess: "InboxReceived",       onFailure: "InboxFailed",       url: "https://www.google.com/voice/inbox/search" },
                { name: "CallNumber",     method: "POST", onSuccess: "CallSent",            onFailure: "CallFailed",        url: "https://www.google.com/voice/call/connect/" },
                { name: "saveNote",     method: "POST", onSuccess: "noteSaved",            onFailure: "noteSaveFailed",        url: "https://www.google.com/voice/inbox/savenote/" },
                { name: "callCancel",     method: "POST", onSuccess: "CallCancelled",       onFailure: "CallCancelFailed",  url: "https://www.google.com/voice/call/cancel/" },
                { name: "markRead", method: "POST", onSuccess: "MarkReadSuccess", onFailure: "MarkReadFailed", url:"https://www.google.com/voice/inbox/mark/" /*"https://www.google.com/voice/m/mark",*/ },
                { name: "archiveMessages",       method: "POST", onSuccess: "archiveSuccess",     onFailure: "archiveFailed",    url: "https://www.google.com/voice/inbox/archiveMessages/", },
                { name: "deleteMessage",      method: "POST", onSuccess: "deleteSuccess",       onFailure: "deleteFailed",      url: "https://www.google.com/voice/inbox/deleteMessages/" },
                { name: "deleteForeverMessage", method: "POST", onSuccess: "deleteForeverSuccess", onFailure: "deleteForeverFailed", url: "https://www.google.com/voice/inbox/deleteForeverMessage/" },
                { name: "starMessage",    method: "POST", onSuccess: "StarSuccess",         onFailure: "StarFailed",        url: "https://www.google.com/voice/inbox/star/", },
                { name: "vmDownload",     method: "GET", onSuccess: "DownloadSuccess",     onFailure: "DownloadFailure",   url: "https://www.google.com/voice/media/send_voicemail/" },
                { name: "queryBillingCredit", method: "POST", onSuccess: "billingCreditReceived", onFailure: "billingCreditFailed", url: "https://www.google.com/voice/settings/billingcredit/", components: [ { contentType: "application/x-www-form-urlencoded; charset=utf-8" }, ]},
                // TODO: can you /getGeneralSettings/ ?
                { name: "genSettings", method: "POST", onSuccess: "settingsChanged", onFailure: "settingsFailed", url: "https://www.google.com/voice/settings/editGeneralSettings/" },
                { name: "gvAddToContacts", method: "POST", onSuccess: "addContactSuccess", onFailure: "addContactFailure", url: "https://www.google.com/voice/phonebook/quickAdd/", },
                { name: "editDefaultForwarding", method: "POST", onSuccess: "forwardingChanged", url: "https://www.google.com/voice/settings/editDefaultForwarding/" },
                { name: "blockCaller", method: "POST", onSuccess: "callerBlocked", url: "https://www.google.com/voice/inbox/block/", },
            ]
        },
        { name: "CreateVoicemailDir", kind: "PalmService", service: "palm://com.ericblade.googlevoiceapp.service/", method: "createVoicemailDir" }, /* Assume Success! */
        { name: "DeleteVoicemailDir", kind: "PalmService", service: "palm://com.ericblade.googlevoiceapp.service/", method: "deleteVoicemailDir" }, /* Assume Success! */
        { name: "newMarkRead", kind: "PalmService", service: "palm://com.ericblade.googlevoiceapp.service/", method: "httpsRequest", onFailure: "newMarkReadFailed", onSuccess: "newMarkReadSucceed", },
        { name: "newPlayVoicemail", kind: "PalmService", service: "palm://com.ericblade.googlevoiceapp.service/", method: "httpsRequest", onFailure: "newPlayVoicemailFailed", onSuccess: "newPlayVoicemailSucceed" },
        { name: "mainSpinner", kind: "SpinnerLarge", style: "position: absolute; top: 45%; left: 45%; z-index: 10;", showing: false },
        //{ name: "fileDownload", kind: "PalmService", service: "palm://com.palm.downloadmanager/", method: "download", onSuccess: "downloadFinished", subscribe: true },
        { name: "outbox", kind: "outboxHandler", onAllMessagesSent: "messagesSent" },
        { name: "ReviewPopup", kind: "ReviewPopup" },
        { name: "NotePopup", kind: "NotePopup", className: "notePopup", onNoteSaved: "saveNote" },
        { name: "LoginPopup", kind: "LoginPopup", onClose: "popupClosed" },
        { kind: "composePopup", onClose: "popupClosed" },
        { kind: "placeCallPopup", onClose: "popupClosed", onCreditPurchased: "RefreshBillingCredit", onCancelCall: "cancelOutgoingCall", onPlaceCall: "actionPlaceCall" },
        { kind: "deletePopup", onClose: "popupClosed" },
        { kind: "phonePopupMenu" },
        { name: "PurchaseSynergyPopup", kind: "purchasePopup", onPurchase: "purchaseSynergy" },
        { name: "PurchasedPopup", kind: "purchasedPopup", },
        { name: "PurchaseThankYou", kind: "purchaseThankYou" },
        { name: "purchaseError", kind: "purchaseError", },
        { kind: "emailPopupMenu", onSendSelected:"emailFromPopup" },
        { kind: "preferencesPopup", onClose: "popupClosed", onPrefsChanged: "prefsChanged" },
        { kind: "aboutPopup", onClose: "popupClosed" },
        { kind: "actionsMenu", onReply: "actionReply", onCall: "actionCall", onDelete: "actionDelete", onArchive: "actionArchive", onVoicemail: "actionVoicemail", onAddContact: "openAddContactPopup", onBlockUnblock: "confirmBlockUnblock", },
        { kind: "contactAddPopup", onAddContact: "addContact", onClose: "popupClosed" },
        { name: "blockConfirmDialog", kind: "ConfirmDialog", onClose: "popupClosed", onConfirm: "performBlockUnblock", okcaption: "Block Sender", 
            msg: "<b>WARNING</b>: This will move this conversation to the Spam box, and <B>BLOCK</b> that person from sending you messages or calling you." },
        // Titlebar!
        Platform.isLargeScreen() ?
            { kind: "PageHeader", className: "gvoice-header", onclick: "scrollRightToTop", components:
                [
                    !window.PalmSystem && typeof blackberry == 'undefined' ? { name: "MenuButton", kind: "Button", caption: "Menu", onclick: "openAppMenuHandler" } : {},
                    { kind: "Image", src: !window.PalmSystem ? "mainApp/images/google-voice-icon48.png" : "images/google-voice-icon48.png", style: "padding-right: 10px", onclick: "headerIconClick" }, 
                    { name: "TitleBar", content: "GVoice", flex: 1 },
                    //{ kind: "Spacer" },
                    //{ name: "TestButton", kind: "Button", caption: "Test Button", onclick: "TestButtonClicked", },
                    { name: "DNDButton", kind: "Button", caption: "DnD: ", onclick: "toggleDND", showing: false },
                    inboxButton,
                ]
            }
            :
            { name: "PhoneTabs", kind: "TabGroup", onChange: "tabSelect", components:
                [
                    { name: "IndexTab", caption: "Index", },
                    { name: "OverviewTab", caption: "Overview" },
                    { name: "ConversationTab", caption: "Conv", disabled: true, },
                    //{ name: "ContactsTab", icon: "images/contacts2.png", }, // 4 tabs looks like crap on a pre
                ]
            },
        { name: "AppMenu", kind: "AppMenu", lazy: false, style: "-webkit-transition: all 0.5s ease-in-out; width: auto;", className: "enyo-grid", components:
            [
                { caption: "About", className: "enyo-grid-div menu-grid", onclick: "openAbout", lazy: false },
                { name: "DNDMenu", className: "enyo-grid-div menu-grid", caption: "DnD: ", onclick: "toggleDND", disabled: true, lazy: false, },
                { name: "reloadInboxMenu", className: "enyo-grid-div menu-grid", caption: "Reload Inbox", onclick: "InboxClick", disabled: true, lazy: false, },
                { caption: "Preferences", className: "enyo-grid-div menu-grid", onclick: "openPreferences", lazy: false },
                { caption: "Debug Log", className: "enyo-grid-div menu-grid", onclick: "debugLogView", lazy: false },
                //useInternalWebView() ? { caption: "Voice Web View", onclick: "showWebView", lazy: false } : {},
                { caption: "Logout", className: "enyo-grid-div menu-grid", onclick: "doLogoutMenu", lazy: false, },
                window.PalmSystem ? { name: "PurchaseMenu", caption: "Purchase SynerGV 2", className: "enyo-grid-div menu-grid", onclick: "openPurchasePopup", lazy: false, } : {},
                window.PalmSystem ? { name: "ReceiptMenu", caption: "Receipt", className: "enyo-grid-div menu-grid", onclick: "getReceiptInfo", lazy: false, } : {},
            ]
        },
        
        { name: "slidingPane", kind: "SlidingPane", onSelectView: "viewChange", flex: 1, components:
            [
                { name: "left", style: "width: 200px;", edgeDragging: true, kind:"SlidingView", components:
                    [
                        { name: "LeftHeader", kind: "Header", className: "pane-header", components:
                            [
                                { kind: "PickerGroup", label: "", components:
                                    [
                                        { name: "boxPicker", value: prefs.get("defaultBox") || "Unread", onChange: "selectBox", className: "box-picker", items: ["Inbox", "Unread", "All", "Voicemail", "SMS", "Recorded", "Placed", "Received", "Missed", "Starred", "Spam", "Trash", "Search"] },
                                        { name: "pagePicker", label: "Page", className: "page-picker", kind: "IntegerPicker", onChange: "selectPage", min: 1, max: 10 },
                                    ]
                                },
                                !Platform.isLargeScreen() ? inboxButton : {},
                            ]
                        },
                        { name: "leftPane", kind: "Pane", flex: 1, transitionKind:enyo.transitions.LeftRightFlyin, components:
                            [
                                { name: "indexView", kind: "TransformScroller", horizontal: false, autoHorizontal: false, autoVertical: true, accelerated: Platform.isLargeScreen(), components:
                                    [
                                        { kind: "HFlexBox", components:
                                            [
                                                !Platform.hasMenu() && !Platform.isLargeScreen() ? { name: "MenuButton", kind: "Button", caption: "Menu", onclick: "openAppMenuHandler" } : {},        
                                                { name: "messageSearchInput", flex: 1, hint: "Search", className: "searchbar", kind: "RoundedSearchInput", style: "height: 38px; max-height: 38px", onkeypress: Platform.isLargeScreen() ? "messageSearchKeypress" : "", onkeyup: Platform.isLargeScreen() ? "" : "messageSearchKeypress", onclick: "messageSearchClick", components:
                                                    [
                                                        { kind: "Image", src: (!window.PalmSystem) ? "mainApp/images/searchicon24.png" : "images/searchicon24.png" },
                                                    ]
                                                },
                                            ]
                                        },
                                        { name: "IndexList", kind: "VirtualRepeater", onSetupRow: "getIndexListItem", onclick: "IndexListClick", onmousehold: "indexHold", accelerated: Platform.isLargeScreen(), components:
                                            [
                                                { name: "IndexListItem", className: "indexitem", kind: "SwipeableItem", confirmCaption: "Delete", onConfirm: "swipeDelete", components:
                                                    [
                                                        //{ kind: "HFlexBox", components:
                                                            //[
                                                                { name: "IndexImage", kind: "enyo.Image", style: "display: inline; float: left;", className: "avatar" },
                                                                { kind: "VFlexBox", style: "display: inline;", pack: "center", flex: 1, components:
                                                                    [
                                                                        { name: "IndexName", /*style: "display: inline;"*/ },
                                                                        { name: "IndexLocation", className: "enyo-item-ternary" },                                                            
                                                                        { name: "IndexTime", className: "enyo-item-ternary" }
                                                                    ]
                                                                },
                                                                //{ kind: "HFlexBox", align: "start", components:
                                                                    //[
                                                                        { name: "NoteIndicator", className: "indicator", kind: "enyo.Image", src: window.PalmSystem ? "images/note.png" : "mainApp/images/note.png", showing: false },
                                                                        { name: "VoiceMailIndicator", className: "indicator", kind: "enyo.Image", src: window.PalmSystem ? "images/Blade_voice2.png" : "mainApp/images/Blade_voice2.png", showing: false },
                                                                        { name: "StarIndicator", className: "indicator", kind: "enyo.Image", src: window.PalmSystem ? "images/star.png" : "mainApp/images/star.png", showing: false },
                                                                    //]
                                                                //},
                                                            //]
                                                        //},
                                                    ]
                                                },
                                            ]
                                        }
                                    ]
                                },
                                { kind: "contactsIndex", flex: 1, onContactSelected: "showContactView" },
                            ]
                        },
                        { kind: "Toolbar", components:
                            [
                                //{ kind: "GrabButton", allowDrag:true },
                                { name: "contactsButton", kind: "ToolButton", icon: (!window.PalmSystem) ? "mainApp/images/contacts2.png" : "images/contacts2.png",/*caption: "Contacts",*/ onclick: "openContactsView", disabled: true },
                                { name: "addContactButton", kind: "ToolButton", icon: (!window.PalmSystem) ? "mainApp/images/contactsaddnew.png" : "images/contactsaddnew.png",/*caption: "+",*/ onclick: "openAddContact", disabled: true },
                                //{ kind: "Button", caption: "OS Contacts", onclick: "openPeoplePicker" },
                                { name: "PhoneToolButtons", kind: "HFlexBox", showing: false, components:
                                    [
                                        { name: "composeButtonPhone", kind: "ToolButton", icon: (!window.PalmSystem) ? "mainApp/images/Blade_msg1.png" : "images/Blade_msg1.png", className: "enyo-light-menu-button", onclick: "composeButtonClick" },
                                        { name: "newCallButtonPhone", kind: "ToolButton", icon: (!window.PalmSystem) ? "mainApp/images/Blade_phone1.png" : "images/Blade_phone1.png", className: "enyo-light-menu-button", onclick: "newCallButtonClick", disabled: true },
                                        { name: "voicemailButtonPhone", kind: "ToolButton", icon: (!window.PalmSystem) ? "mainApp/images/Blade_voice1.png" : "images/Blade_voice1.png", className: "enyo-light-menu-button", onclick: "callVoicemail", disabled: true },
                                    ]
                                },
                                Platform.isLargeScreen() ? { } : { kind: "GrabButton", allowDrag:true, onclick: "selectRightView", style: "left: 90%",  },                                
                            ]
                        }
                    ]   
                },
                { name: "right", kind:"ThreeWaySlidingView", flex: 1, peekWidth: 50, edgeDragging: false, dragAnywhere: false, components:
                    [
                        useInternalWebView() ? { name: "HackWebViewX", kind: "WebView", height: "1px", width: "1px", showing: false } : { kind: "Component" },
                        { name: "rightPane", flex: 1, onSelectView: "viewChange", kind: "Pane", transitionKind:enyo.transitions.Simple, components:
                            [
                                { name: "conversationView", className: "overview", kind: "VFlexBox", components:
                                    [
                                        { name: "conversationHeader", kind: "Header", className: "pane-header", onclick: "scrollRightToTop", layoutKind: Platform.isLargeScreen() ? "HFlexLayout" : "VFlexLayout", components:
                                            [
                                                { name: "conversationType", content: "Conversation" }, // BUG: Enyo - setContent on Header sets it to null?
                                                { kind: "HFlexBox", components:
                                                    [
                                                        { name: "conversationName", flex: 1, content: "No One" },
                                                        { name: "conversationNote", className: "noteicon", kind: "noteImage", onclick: "openNote" },
                                                        { name: "conversationStar", kind: "starImage", onclick: "doStar", },
                                                    ]
                                                }
                                            ]
                                        },
                                        { name: "conversationScroller", flex: 1, kind: "TransformScroller", autoHorizontal: true, autoVertical: true, vertical: true, accelerated: Platform.isLargeScreen(), components:
                                            [
                                                { name: "conversationList", kind: "VirtualRepeater", onSetupRow: "getConversationListItem", onclick: "listItemClick", accelerated: Platform.isLargeScreen(), components:
                                                    [
                                                        { kind: "Item", layoutKind: "VFlexLayout", className: "noborders", components:
                                                            [
                                                                { name: "messagefield", kind: "HFlexBox", className: "gvoice-inbox-message", components: [
                                                                        { name: "sentTimeLeft", kind: "HtmlContent", allowHtml: false, style: "padding-right: 5px;", className: "enyo-item-ternary", showing: false },
                                                                        { name: "description", flex: 1, kind: "HtmlContent", allowHtml: true, onLinkClick: "linkClicked"},
                                                                        { name: "sentTime", kind: "HtmlContent", allowHtml: false, style: "padding-right: 10px; padding-left: 5px; max-width: 12%; ", className: "enyo-item-ternary" },
                                                                    ]
                                                                },
                                                            ]
                                                        }
                                                    ]
                                                },
                                            ]
                                        },
                                    ]
                                },
                                { name: "overviewView", className: "overview", kind: "VFlexBox", components:
                                    [
                                        { kind: "Header", className: "pane-header", onclick: "scrollRightToTop", components:
                                            [
                                                { name: "overviewHeader", content: "Overview: " + prefs.get("defaultBox"), },
                                            ]
                                        },
                                        { name: "overviewScroller", kind: "TransformScroller", flex: 1, autoHorizontal: false, horizontal: false, autoVertical: true, accelerated: Platform.isLargeScreen(),
                                        components:
                                            [
                                                { kind: "VFlexBox", flex: 1, components:
                                                    [
                                                        { name: "overviewList", kind: "VirtualRepeater", onSetupRow: "overviewListRender", accelerated: Platform.isLargeScreen(), components:
                                                            [
                                                                { name: "overviewTitle", kind: "Divider", className: "gvoice-divider", allowHtml: true, components:
                                                                    [
                                                                        { name: "overviewNote", className: "noteicon", kind: "noteImage", onclick: "openNote" },
                                                                        { name: "overviewStar", kind: "starImage", onclick: "doStar" },
                                                                    ]
                                                                },
                                                                { kind: "messageListRepeater", onMessageClick: "listItemClick", onLinkClick: "linkClicked" },
                                                                //{ kind: "Item", content: " " },
                                                            ],
                                                        },
                                                    ]
                                                },
                                            ]
                                        },
                                    ]
                                },
                                { name: "contactsView", kind: "VFlexBox", components:
                                    [
                                        { kind: "Header", className: "pane-header", onclick: "scrollRightToTop", components:
                                            [
                                                { name: "contactHeader", content: "Contact" },
                                            ]
                                        },
                                        { name: "contactView", flex: 1, kind: "contactDetail", onPhoneSelected: "doPhoneMenu", onEmailSelected: "doEmailMenu" },                                                
                                    ]
                                },
                                { name: "placeCallView", kind: "placeCallView", onCancelCall: "cancelOutgoingCall", onPlaceCall: "actionPlaceCall" },
                                { name: "errorView", kind: "errorDetail", allowHtml: false },
                                (useInternalWebView() ? { name: "webView", kind: "HFlexBox", components:
                                    [
                                        { name: "HackWebView", kind: "WebView", height: "480px", width: "320px", /*height: "240px",*/ showing: true, onPageTitleChanged: "webviewTitleChange" },
                                        //{ name: "HideWebViewButton", caption: "Hide WebView (login first!)", kind: "Button", onclick: "headerIconClick" },
                                        { kind: "HtmlContent", flex: 1, components:
                                            [
                                                { content: "GVoice uses this built in web-browser to playback voicemails, as webOS security features do not allow apps to download media from secure sites." },
                                                { content: "<P>Please also login here, so that you may retrieve voicemails properly." },
                                                { content: "<P>This message should only appear for a brief time at startup, unless you use the Logout option from the app menu, reinstall SynerGV, or your Google login information otherwise changes."},
                                            ]
                                        }
                                    ]
                                } : {}),
                            ]
                        },

                        { name: "RightToolbar", kind: "Toolbar", className: "bottom-toolbar", onclick: "scrollRightToBottom", layoutKind: "HFlexLayout", components:
                            [
                                {kind: "GrabButton", allowDrag:true, slidingHandler: true}, // TODO: stop propagation of clicks on the Grab Button to the Toolbar!
                                { name: "quickComposeInput", flex: 1, onclick: "cancelEvent", onfocus: "qcFocus", onblur: "qcBlur",  kind: "quickInput", /*style: "background: white;",*/ onkeypress: /*Platform.isLargeScreen() ?*/ "quickComposeKeypress" /*: ""*/ , onkeyup: Platform.isLargeScreen() ? "": "quickComposeKeypress", disabled: true, hint: "", },
                                //Platform.isLargeScreen() ? { name: "qcSpacer", kind: "Spacer" } : {} ,
                                { name: "composeButton", icon: (!window.PalmSystem) ? "mainApp/images/Blade_msg1.png" : "images/Blade_msg1.png", className: "enyo-light-menu-button", onclick: "composeButtonClick" },
                                { name: "newCallButton", icon: (!window.PalmSystem) ? "mainApp/images/Blade_phone1.png" : "images/Blade_phone1.png", className: "enyo-light-menu-button", onclick: "newCallButtonClick", disabled: true },
                                { name: "voicemailButton", icon: (!window.PalmSystem) ? "mainApp/images/Blade_voice1.png" : "images/Blade_voice1.png", className: "enyo-light-menu-button", onclick: "callVoicemail", disabled: true },
                                //{ name: "voicemailStop", icon: "images/Blade_stop1.png", className: "enyo-light-menu-button", onclick: "stopPlayback", disabled: true },
                            ]
                        }
                    ]
                }
            ]
        },
    ],
    jumpToSearch: function(inSender, inEvent)
    {
        this.$.messageSearchInput.forceFocus();
    },
    clearVoicemail: function(inSender, inEvent)
    {
        this.$.DeleteVoicemailDir.call();
        this.$.CreateVoicemailDir.call();
        //enyo.nextTick(this, enyo.bind(this, this.$.CreateVoicemailDir.call));
    },
    cancelEvent: function(inSender, inEvent)
    {
        inEvent.stopPropagation();
        inEvent.preventDefault();
        return -1;
    },
    popupClosed: function(inSender, inEvent, inReason)
    {
        if(inReason == "popup:escape")
        {
            inEvent.stopPropagation();
            inEvent.preventDefault();
            this.backClosedPopup = true;
            return -1;
        }
    },
    speak: function(str)
    {
        enyo.log("********* SPEAK: ", prefs.get("ttsdisable"), this.ttsPluginReady, this.ringerStatus);
        if( (prefs.get("ttsdisable") !== true) && this.ttsPluginReady && this.ringerStatus)
        {
            try {
                this.$.ttsPlugin.callPluginMethodDeferred(null, "playAudio", str);    
            } catch(err) {
                
            }            
        }
    },
    handlePluginReady: function(inSender) {
        this.ttsPluginReady = true;
    },
    debugLog: function(str)
    {
        str = stripHtml(str);
        if(enyo.application.mainApp.$.errorView.$.ErrorBox.content.length > 4096)
            enyo.application.mainApp.$.errorView.$.ErrorBox.content = "";
        enyo.application.mainApp.$.errorView.$.ErrorBox.content += "*** " + str + "\r\n<br>";
        enyo.application.mainApp.$.errorView.render();
    },
    delayedStartup: function() {
        this.log();
        if(useInternalWebView() && this.$.HackWebView.$.view)
        {
            this.originalDocLoadFinished = this.$.HackWebView.$.view.documentLoadFinished;
            this.$.HackWebView.$.view.documentLoadFinished = (function() { This.gvDocLoad(); });
            this.$.HackWebView.setUrl("www.google.com/voice/m");
        }
        if(Platform.isWebOS())
        {
            this.$.ConnectionService.call();
            //setTimeout(enyo.bind(this, this.openLoginPopup), 1);
        } else { // TODO: will this work everywhere if we just nextTick it?
            //this.openLoginPopup();
        }
        setTimeout(enyo.bind(this, this.openLoginPopup), 1);

    },
    goBack: function(inSender, inEvent, x)
    {
        if(this.backClosedPopup)
        {
            inEvent.stopPropagation();
            inEvent.preventDefault();
            this.backClosedPopup = false;
            return -1;
        }
        if(!Platform.isLargeScreen())
        {
            /*enyo.log("leftPane history=", this.$.leftPane.history.length);
            enyo.log("rightPane history=", this.$.rightPane.history.length);
            enyo.log("slider history=", this.$.slidingPane.history.length);
            enyo.log("slidingpane view=", this.$.slidingPane.getViewName());
            enyo.log("rightpane view=", this.$.rightPane.getViewName());*/
            //var backpane = this.$.slidingPane.getView() == this.$.left ? this.$.leftPane : this.$.rightPane;
            var backpane;
            if(this.$.slidingPane.getView() == this.$.right && this.$.rightPane.getView() == this.$.contactsView)
                backpane = this.$.slidingPane;
            else
                backpane = this.$.leftPane;
            if(backpane.history.length == 0)
                backpane = this.$.slidingPane;
            if(backpane.history.length > 0)
            {
                backpane.back();
                inEvent.stopPropagation();
                inEvent.preventDefault();
                return -1;
            }
        }
        if(Platform.isAndroid())
        {
            inEvent.preventDefault();
            navigator.app.exitApp();
        }
        return;
    },
    rendered: function() {
        this.inherited(arguments);
        this.ringerStatus = true;        
        this.AuthCode = "";
        this.Messages = [];
        this.MessageIndex = [];
        this.selectedID = "";
        if(this.$.InboxButton)
            this.$.InboxButton.hide();
        this.LeftPaneView = 0;
        this.selectedPhone = enyo.getCookie("selectedPhone");
        
        window.addEventListener("message", this.receiveMessage, false);
        window.addEventListener("onmessage", this.receiveMessage, false);
        enyo.application.mainApp = this;
        enyo.application.mainApp.isForeground = true;
        enyo.application.debuglog = this.debugLog;
        this.$.leftPane.selectViewByName("indexView");
        if(useInternalWebView())
        {
            if(Platform.isLargeScreen())
            {
                this.$.rightPane.selectViewByName("webView");
            } else {
                this.$.rightPane.selectViewByName("overviewView");
                this.$.PhoneToolButtons.show();
            }
        } else {
            this.$.rightPane.selectViewByName("overviewView");
            if(!Platform.isLargeScreen())
                this.$.PhoneToolButtons.show();
        }
        this.$.rightPane.history.length = 0;
        this.$.conversationHeader.setLayoutKind("VFlexLayout"); // TODO: I want this only on Phone, but I think it's going to require layout changes to conversationStar area
        //if(Platform.isLargeScreen())
        //{
            this.$.slidingPane.selectViewByName("left");
        //}       
        this.Online = true; // assume online
        this.$.quickComposeInput.hide();
        
        enyo.asyncMethod(this, "delayedStartup");
        
        this.addRemoveClass("androidphone", Platform.isAndroid() && !Platform.isLargeScreen());
        
    },
    ready: function()
    {
        this.inherited(arguments);
        if(Platform.isWebOS())
        {
            if(isNaN(Platform.platformVersion)) {
                enyo.log("*** ready: not doing anything on desktop Open webOS, as the services are not available");
                return;
            }
            if(Platform.platformVersion >= 2)
                this.clearVoicemail();
            this.$.RingerSwitchService.call({ get: "ringer" }, { subscribe: false });
            this.$.RingerSwitchService.call({ subscribe: true }, { subscribe: true });
        }
        console.log("checking firstrun");
        enyo.asyncMethod(this, "checkFirstRun");*/
    },
    checkPendingPurchase: function() {
        this.$.HPPaymentService.call({ orderNo: this.pendingOrderNumber }, { method: "getPendingPurchaseInfo" });
    },    
    getReceiptInfo: function(inSender, inEvent) {
        this.$.HPPaymentService.call({ itemId: "1", includeReceipts: true, maxReceipts: 1 }, { method: "getItemInfo" });
    },
    purchaseSynergy: function(inSender, inEvent)
    {
        this.$.PurchaseSynergyPopup.close();
        this.$.HPPaymentService.call({ itemId: "1", quantity: 1, vendorData: "SynerGV Purchase: 1" }, { method: "purchaseItem" });
    },
    openPurchasePopup: function(inSender, inEvent) {
        this.$.PurchaseSynergyPopup.open();
    },
    checkFirstRun: function() {
        var appInfo;
        if(!Platform.isWebOS() || Platform.platformVersion < 3) {
            if(this.$.ReceiptMenu)
                this.$.ReceiptMenu.hide();
            if(this.$.PurchaseMenu)
                this.$.PurchaseMenu.hide();
        }
        /*if(Platform.isAndroid())
        {
            this.$.indexView.setAccelerated(false);
            this.$.conversationScroller.setAccelerated(false);
            this.$.overviewScroller.setAccelerated(false);
        }*/
        console.log("checkFirstRun");
        try {
            appInfo = JSON.parse(enyo.fetchAppInfo());
        } catch(err) {
            appInfo = enyo.fetchAppInfo();
        }
        var appver = appInfo ? appInfo.version : "0.0.0";
        console.log("appInfo version " + appInfo.version);
        
        if(prefs.get("firstrun") != appver)
        {
            var url = "http://www.ericbla.de/synergv/new-in-v1/";
            prefs.set("firstrun", appver);
            enyo.windows.addBannerMessage("SynerGV: What's New", '{}', "images/google-voice-icon24.png", "/media/internal/ringtones/Triangle (short).mp3")
            console.log("Loading browser to " + url);
            Platform.browser(url, this)();            
            console.log("Browser loaded.");
            if(Platform.isWebOS() && Platform.platformVersion >= 3)
            {
                setTimeout(enyo.bind(this, function() {
                    this.$.HPPaymentService.call({ includePurchased: false }, { method: "getAvailableItems" });
                }), 2000);
            }
            
        }
    
        var runcount = parseInt(prefs.get("runcount"));
        if(runcount >= 10 && !prefs.get("reviewed") && !Platform.isWebWorks())
        {
            this.$.ReviewPopup.openAtCenter();
        }
        prefs.set("runcount", runcount + 1);
    },
    debugLogView: function()
    {
        this.$.rightPane.selectViewByName("errorView");
        this.$.slidingPane.selectViewByName("right");
    },
    selectRightView: function()
    {
        this.$.slidingPane.selectViewByName("right");
        //this.log(this.$.rightPane.getViewName());
    },
    showWebView: function()
    {
        if(Platform.isLargeScreen())
        {
            //this.log("selecting webView, right");
            this.$.rightPane.selectViewByName("webView");
            this.$.slidingPane.selectViewByName("right");
        }
    },
    showContactView: function(inSender, inContact)
    {
        //this.log("selecting contactsView");
        this.$.rightPane.selectViewByName("contactsView");
        this.$.contactHeader.setContent("Contact: " + inContact.name);
        this.$.contactView.setContact(inContact);
        if(!Platform.isLargeScreen()) // PRE - switch to right hand view automatically
        {
            //this.log("selecting right");
            this.$.slidingPane.selectViewByName("right");
        }
    },
    openAbout: function()
    {
        //this.$.aboutPopup.openAtCenter();
        this.$.aboutPopup.open();
    },
    openPreferences: function()
    {
        //this.$.preferencesPopup.openAtCenter();
        this.$.preferencesPopup.open();
    },
    resetSelectedID: function()
    {
        enyo.application.mainApp.selectedID = "";
        enyo.application.mainApp.$.overviewHeader.setContent("Overview: " + this.$.boxPicker.getValue());
        //this.log("selecting 0");
        this.$.leftPane.selectViewByIndex(0);
        ////this.log(this.webViewTitle);
        if(!Platform.isLargeScreen() || this.webViewTitle != "Google Voice - One phone number, online voicemail, and enhanced call features")
        {
            //this.log("selecting overview");
            this.$.rightPane.selectViewByName("overviewView");
            this.$.rightPane.history.length = 0;
        }
        this.$.contactsButton.setCaption("");
        this.$.contactsButton.setIcon((!window.PalmSystem) ? "mainApp/images/contacts2.png" : "images/contacts2.png");

        this.$.quickComposeInput.setHint("");
        this.$.quickComposeInput.setDisabled(true);
        this.$.quickComposeInput.hide();
        this.$.messageSearchInput.setValue("");
        this.scrollToNew();
    },
    selectBox: function()
    {
        //this.debugLog("Open box: " + this.$.boxPicker.getValue());
        this.$.pagePicker.setValue("1");
        this.resetSelectedID();
        this.RetrieveInbox();
        //this.log("selecting 0");
        this.$.leftPane.selectViewByIndex(0);
        this.$.contactsButton.setCaption("");
        this.$.contactsButton.setIcon((!window.PalmSystem) ? "mainApp/images/contacts2.png" : "images/contacts2.png");
        this.$.leftPane.render();
        this.scrollLeftToTop();
    },
    selectPage: function()
    {
        //this.debugLog("Open page: " + this.$.pagePicker.getValue());
        var bSearch = false;
        if(this.$.boxPicker.getValue() == "Search")
            bSearch = true;
        this.resetSelectedID();
        if(bSearch)
        {
            this.$.boxPicker.setValue("Search");
            this.$.messageSearchInput.setValue(enyo.application.mainApp.messageSearch);
        }
        this.RetrieveInbox();
        this.scrollLeftToTop();
    },
    windowParamsChanged: function() {
        this.log("************* NEW WINDOW PARAMS= ", enyo.windowParams);
        if(enyo.windowParams.sendDataToShare) {
            var dataToSend = { "type": "rawdata", "mimetype": "text/html" };
            var x = this.$.rightPane.getView();
            switch(x.name) {
                case "conversationView":
                    this.log("Sharing conversation View");
                    var index = this.getMessageIndexById(this.selectedID);
                    this.log("id=" + this.selectedID + " index=" + index);
                    //this.log("message=", JSON.stringify(this.Messages[index]));
                    //this.log("index=", JSON.stringify(this.MessageIndex[index]));
                    if(this.MessageIndex[index].labels.indexOf("voicemail") > -1) {
                        this.log("-- Voicemail!");
                        dataToSend.target = "http://synergv/playVoicemail/unknown/" + this.selectedID;
                    } else {
                        dataToSend.target = "http://synergv/openMessage/unknown/" + this.selectedID;
                    }
                    break;
                case "overviewView":
                    dataToSend.target = "http://synergv/openWindow/unknown/unknown";
                    break;
                case "contactsView":
                    dataToSend.target = "http://synergv/doSomethingWithAContact/unknown/unknown";
                    break;
                case "errorView":
                    dataToSend.target = "http://www.ericbla.de/synergv/";
                    break;
                default:
                    break;
            }
            if(dataToSend.target) {
                this.log("Sharing!");
                this.$.sendDataToShare.call({ "data": dataToSend });
            }
            this.log("Share should be complete.");
        }
    },
    receiveMessage: function(message) {
        // received message: data, origin, source
        if(message.data == "retrieveInbox") {
            enyo.application.mainApp.RetrieveInbox();
            return true;
        } else if(message.data == 'enyoWindowParams={"palm-command":"open-app-menu"}') {
            ////this.log("received app menu open!!!");
            //enyo.application.mainApp.openAppMenuHandler();
        } else {
            ////enyo.log("receiveMessage message.data=", message.data);
        }
        return false;
    },
    gvDocLoad: function()
    {
        if(this.$.HackWebView && this.$.HackWebView.$.view) {
            this.$.HackWebView.$.view.documentLoadFinished = this.originalDocLoadFinished;
            // Attempting to get auto-logging in to work, don't seem to have enough control over the browser though
            //this.$.HackWebView.$.view.onSingleTap = (function() { //this.log("*** ONSINGLETAP "); });
             //this.$.HackWebView.$.view.node["clickAt"](20, 10, 5 );
            //this.$.HackWebView.insertStringAtCursor("\t\tTEST");
            // no
            //this.$.HackWebView.setUrl("https://www.google.com/accounts/ClientLogin?accountType=GOOGLE&Email=bladeeric&Passwd=Armageddon01&service=grandcentral&source=ericBlade-GoogleLogin-0.1.0&PersistentCookie=yes");
        }
    },
    headerIconClick: function(inSender, inEvent)
    {
        //this.log("headerIconClick viewname == ", this.$.rightPane.getViewName());
        if(this.$.rightPane.getViewName() == "webView" || !Platform.isLargeScreen())
        {
            //this.log("selecting overview, left");
            this.$.rightPane.selectViewByName("overviewView");
            this.$.slidingPane.selectViewByName("left");
            //this.$.HackWebView.showing = false;
        }
        else {
            //this.$.HackWebView.showing = true;
            //this.log("selecting webView, right");
            this.$.rightPane.selectViewByName("webView");
            this.$.slidingPane.selectViewByName("right");
        }
    },
    getMessageIndexById: function(msgid)
    {
        for(x = 0; x < this.MessageIndex.length; x++)
        {
            if(msgid == this.MessageIndex[x].id)
                return x;
        }
        return -1;
    },
    setHackWebURL: function(url)
    {
        if(!useInternalWebView())
        {
            //this.$.HackWebView.hide();
            //this.$.HackWebViewX.hide();
            return;
        }
        if(this.$.rightPane.getViewName() == "webView")
        {
            this.debugLog("WebView: loading " + url);
            this.$.HackWebViewX.hide();
            this.$.HackWebView.setUrl(url);
        }
        else {
            this.debugLog("WebViewX: loading " + url);
            this.$.HackWebViewX.show();
            this.$.HackWebViewX.setUrl(url);
        }
    },
    setHackWebHTML: function(html)
    {
        if(!useInternalWebView()) // PRE - does not work
        {
            this.$.HackWebView.hide();
            this.$.HackWebViewX.hide();
            return;
        }
        if(this.$.rightPane.getViewName() == "webView" /*this.$.HackWebView.showing*/)
        {
            this.debugLog("WebView: setting html to "+html);
            this.$.HackWebViewX.hide();
            this.$.HackWebView.setHTML("https://www.google.com/", html);
        }
        else {
            this.debugLog("WebViewX: setting html to "+html);
            this.$.HackWebViewX.show();
            this.$.HackWebViewX.setHTML("https://www.google.com/", html);
        }
    },

    markMessageRead: function(msgid) {
        index = this.getMessageIndexById(msgid);
               
        /*this.$.newMarkRead.call({
            //  POST /voice/inbox/mark/ messages=[message id]&read=1&_rnr_se=[pull from page] 
            // host, port, path, method, headers, postdata 
            host: "www.google.com",
            path: "/voice/inbox/mark/?messages=" + encodeURI(msgid) + "&read=1&_rnr_se=" + encodeURI(this.PrimaryData._rnr_se),
            method: "POST",
            headers: {
                "Authorization":"GoogleLogin auth=" + this.AuthCode
            }
        }); 
        return; */
        this.$.markRead.headers= { "Authorization":"GoogleLogin auth="+this.AuthCode };
        if(!this.MessageIndex[index].isRead){
            this.MessageIndex[index].isRead = true;
            params = {
                "messages":msgid,
                "read":1,
                "_rnr_se":this.PrimaryData._rnr_se
            }
            this.$.markRead.call( params );
            this.$.IndexList.render();
            this.clearNotificationsFor(this.MessageIndex[index].id);
        }
    },
    clearNotificationsFor: function(msgid)
    {
        enyo.application.launcher.clearNotificationsFor(msgid);
    },
    openLoginPopup: function() {
        ////enyo.log("***OpenLoginPopup");
        this.log("openLoginPopup");
        if(enyo.application.api.AuthCode) // the other window is already logged in, just run with it
        {
            this.LoginReceived();
            this.PrimaryDataReceived();
            return;
        } else {
            var u = prefs.get("gvUsername");
            var p = prefs.get("gvPassword");
            if(!u || u == "undefined" || !p || p == "undefined")
            {
                this.openLogin();
            } else {
                enyo.application.api.beginLogin(prefs.get("gvUsername"), prefs.get("gvPassword"));
                this.cookieLoginAttempt = true;                
            }
        }
    },
    composeButtonClick: function(inSender, inEvent)
    {
        if(this.selectedID != "" && (!this.$.PhoneTabs || (this.$.slidingPane.getViewName() == "right" && this.$.rightPane.getViewName() == "conversationView")))
        {
            var index = this.getMessageIndexById(this.selectedID);
            this.openComposePopup(this.MessageIndex[index].displayNumber);
        } else {
            this.openComposePopup("");
        }
        if(inEvent)
            inEvent.stopPropagation();
    },
    deleteButtonClick: function(inSender, inEvent)
    {
        var index = inEvent.rowIndex;
        if(this.selectedID != "")
            index = this.getMessageIndexById(this.selectedID);
        this.openDeletePopup(index);
    },
    newCallButtonClick: function(inSender, inEvent)
    {
        this.log("newCallButtonClick");
        if(this.selectedID != "" && (!this.$.PhoneTabs || (this.$.slidingPane.getViewName() == "right" && this.$.rightPane.getViewName() == "conversationView")))
        {
            var index = this.getMessageIndexById(this.selectedID);
            this.openPlaceCallPopup(this.MessageIndex[index].displayNumber);
        } else {
            this.openPlaceCallPopup("");
        }
        inEvent.stopPropagation();
    },
    callVoicemail: function(inSender, inEvent)
    {
        this.openPlaceCallPopup(this.PrimaryData.number.raw);
        inEvent.stopPropagation();
    },
    openComposePopup: function(recp, msg)
    {
        //this.$.composePopup.openAtCenter(recp, msg);
        this.$.composePopup.open(recp, msg);  
    },
    openDeletePopup: function(index)
    {
        this.displayConversation(index);
        this.$.deletePopup.setMessageIndex(this.MessageIndex[index]);
        this.$.deletePopup.openAtCenter();
        this.$.deletePopup.msgindex = index;
    },
    closeComposePopup: function()
    {
        this.$.composePopup.close();
    },
    openPlaceCallPopup: function(recp)
    {
        //this.$.placeCallPopup.openAtCenter(recp);
        this.log("openPlaceCallPopup height=" + window.innerHeight);
        if(window.PalmSystem && window.innerHeight < 477) {
            this.$.placeCallPopup.open(recp);
        } else {
            this.$.rightPane.selectViewByName("placeCallView");
            if(window.innerHeight < 800)
                this.$.slidingPane.selectViewByName("right");
            if(recp) {
                this.$.placeCallView.setPhoneNumber(recp);
            }
        }
    },
    closePlaceCallPopup: function()
    {
        this.$.placeCallPopup.close();  
    },
    scrollLeftToTop: function()
    {
        this.$.indexView.scrollTo(0,0);
    },
    scrollRightToTop: function() {
        //this.$.rightScroller.scrollTo(0,0);
        if(this.$.rightPane.getViewName() == "conversationScroller")
            this.$.conversationScroller.scrollTo(0,0);
        else
            this.$.overviewScroller.scrollTo(0,0);
    },
    scrollLeftToBottom: function()
    {
        this.$.indexView.scrollToBottom();
        //this.$.indexView.scrollTo(this.$.indexView.getBoundaries().bottom, 0);
    },
    scrollToNew: function() {
        //this.$.rightScroller.scrollToBottom();
        //this.log();
        if(this.$.rightPane.getViewName() == "conversationScroller")
        {
            this.$.conversationScroller.scrollToBottom();
        }
        else
            this.$.overviewScroller.scrollTo(0,0);
    },
    scrollRightToBottom: function()
    {
         // TODO: make sure this function only affects the view that we are actually in.. derp derp.
        //this.$.rightScroller.scrollToBottom();
        //this.$.conversationScroller.scrollToBottom();
        //this.$.conversationScroller.scrollTo(this.$.conversationScroller.getBoundaries().bottom, 0);
        if(this.$.rightPane.getViewName() == "conversationScroller")
        {
            this.$.conversationScroller.scrollToBottom();
        }
        else
            this.$.overviewScroller.scrollToBottom();
    },
    InboxClick: function(inSender, inEvent)
    {
        var box = prefs.get("defaultBox");
        this.$.boxPicker.setValue(box);
        this.$.pagePicker.setValue("1");
        this.resetSelectedID();
        this.RetrieveInbox(box);
    },
    MarkReadSuccess: function(inSender, inResponse, inRequest) {
        //console.log("MarkReadSuccess "+inResponse);
        //this.log("MarkReadRequest ",inRequest);
    },
    MarkReadFailed: function(inSender, inResponse) {
        console.log("MarkReadFailed "+inResponse);
    },
    LoginReceived: function(inSender, inResponse) {
        this.$.LoginPopup.loginReceived();
        this.AuthCode = enyo.application.api.AuthCode;
        
        if(Platform.isWebOS())
        {
            setTimeout(function(thisObj) { thisObj.$.LoginPopup.close(); if(useInternalWebView()) thisObj.gvDocLoad(); }, 100, this);
        } else {
            this.$.LoginPopup.close();            
        }
        enyo.application.mainAppWindow = window;
    },
    restartTimedRetrieval: function()
    {
        this.StopTimedRetrieval();
        if(prefs.get("autoCheckNewMessages"))
            this.StartTimedRetrieval();
    },
    StartTimedRetrieval: function() {
        if(enyo.application.launcher) {
            var interval = enyo.application.mainApp.isForeground ? prefs.get("fgRefresh") : prefs.get("bgRefresh");
            if(interval < 1) interval = 1;
            enyo.log("Start Timed Retrieval", interval);
            //this.log("retrieval interval", interval, "minutes");
            enyo.application.launcher.startTimer(this);
            window.addEventListener("message", this.receiveMessage, false);
        }
        else
        {
            var interval = enyo.application.mainApp.isForeground ? prefs.get("fgRefresh") : prefs.get("bgRefresh");
            if(interval < 1) interval = 1;
            enyo.log("Start Timed Retrieval", interval);
            this.InboxInterval = setInterval(function(thisObj) { thisObj.RetrieveInbox(); }, 60 * interval * 1000, this);
        }
    },
    StopTimedRetrieval: function() {
        if(enyo.application.launcher)
        {
            enyo.application.launcher.stopTimer(this);
        } else {
            clearInterval(this.InboxInterval);
        }
    },
    RetrieveInbox: function(type)
    {
        if(this.$.InboxButton)
            this.$.InboxButton.setActive(true);
        if(!type || type === "")
            type = this.$.boxPicker.getValue();
        if(!type) type = "Unread";
        type = type.toLowerCase();
        //this.debugLog("Retrieving "+type+" https://www.google.com/voice/inbox/recent/" + type);
        if(type == "search" && this.messageSearch) {
            this.doSearch(this.messageSearch, this.$.pagePicker.getValue());
        } else {
            this.$.getInbox.setUrl("https://www.google.com/voice/inbox/recent/" + type + "/");
            this.$.getInbox.headers= { "Authorization":"GoogleLogin auth="+this.AuthCode };
            this.$.getInbox.call( { page:"p"+this.$.pagePicker.getValue() } );
        }
    },
    webViewLogout: function()
    {
        This = this;
        if(useInternalWebView())
        {
            this.originalDocLoadFinished = this.$.HackWebView.$.view.documentLoadFinished;
            this.$.HackWebView.$.view.documentLoadFinished = (function() { This.gvDocLoad(); });
            this.$.HackWebView.setUrl("www.google.com/voice/account/msignout");
        }
    },
    doLogoutMenu: function()
    {
        enyo.application.api.doLogout();
    },
    doLogout: function()
    {
        this.log();
        this.setCallButtonsDisabled(true);
        this.openLogin();
        delete this.PrimaryData;
        this.MessageIndex.length = 0;
        this.Messages.length = 0;
        this.$.conversationList.render();
        this.$.overviewList.render();
        this.$.IndexList.render();
    },
    LoginFailed: function(inSender, inResponse) {
        this.openLogin();
        this.$.LoginPopup.loginFailed(inResponse);
        this.debugLog("LoginFailed: " + inResponse);
    },
    openLogin: function()
    {
        this.endScrim();
        if(useInternalWebView() && Platform.isLargeScreen())
        {
            //this.log("selecting webView");
            this.$.rightPane.selectViewByName("webView");
        }
        this.$.LoginPopup.openAtCenter();
        this.cookieLoginAttempt = false;
    },
    RetrieveBillingCredit: function()
    {
        this.$.queryBillingCredit.headers= { "Authorization":"GoogleLogin auth="+this.AuthCode };
        this.$.queryBillingCredit.call( { _rnr_se:this.PrimaryData._rnr_se } );
        this.reopenCall = false;
    },
    RefreshBillingCredit: function(inSender, num)
    {
        this.RetrieveBillingCredit();
        this.reopenCall = num;
    },
    PrimaryDataReceived: function(inSender, inResponse)
    {
        enyo.log("********** PrimaryDataReceived");
        if(!this.PrimaryData) // if it's our first time receiving it, then fire an Inbox load too
            enyo.nextTick(this, enyo.bind(this, this.RetrieveInbox, prefs.get("defaultBox")));
        //this.PrimaryData = ParsePrimaryData(inResponse);
        this.PrimaryData = enyo.application.api.PrimaryData;
        
        this.AutoCompleteNumbers = [ ];
        this.AutoCompleteNames = [ ];
        
        if(!this.PrimaryData || !this.PrimaryData.userName || !this.PrimaryData._rnr_se)
        {
            if(!this.PrimaryData)
                console.log("NO PRIMARY DATA");
            else 
            {
                if(!this.PrimaryData.userName)
                    console.log("NO USERNAME");
                if(!this.PrimaryData._rnr_se)
                    console.log("NO RNR!");
            }
            console.log("inResponse:", inResponse);
            //this.doLogin(prefs.get("gvUsername"), prefs.get("gvPassword"));
            this.openLogin();
            this.cookieLoginAttempt = true;
            return;
        }
        if(Platform.isLargeScreen()) // PRE - smaller title
            this.$.TitleBar.setContent("SynerGV - " + this.PrimaryData.userName + " - " + this.PrimaryData.number.formatted);
        else {
            //this.$.TitleBar.setContent("GVoice-" + this.PrimaryData.number.formatted);
        }
        
        this.$.conversationList.render();
        this.$.overviewList.render();
        this.$.IndexList.render();
        
        this.$.contactsButton.setDisabled(false);
        this.$.addContactButton.setDisabled(false);
        
        if(!Platform.isLargeScreen() && this.$.voicemailStop) // PRE - does not work
        {
            this.$.voicemailStop.hide();
        }
        
        if(Platform.isLargeScreen()) // PRE - interface change
            this.$.DNDButton.show();
        this.$.DNDMenu.setDisabled(false);
            
        if(!this.wasDND && this.PrimaryData.number.dnd == true)
        {
            enyo.windows.addBannerMessage("SynerGV: DnD Enabled", '{}', "images/google-voice-icon24.png", "/media/internal/ringtones/Triangle (short).mp3")
            this.wasDND = true;
        }
        else if(this.wasDND && this.PrimaryData.number.dnd == false) {
            enyo.windows.addBannerMessage("SynerGV: DnD Disabled", '{}', "images/google-voice-icon24.png", "/media/internal/ringtones/Triangle (short).mp3")
            this.wasDND = false;
        }
        if(this.$.DNDButton) {
            this.$.DNDButton.setCaption("DnD:"+ (this.PrimaryData.number.dnd ? "ON":"Off"));
        }
        this.$.DNDMenu.setCaption("DnD:" + (this.PrimaryData.number.dnd ? "ON":"Off"));
        
        for(x in this.PrimaryData.contacts)
        {
            for(p in this.PrimaryData.contacts[x].numbers)
            {
                this.AutoCompleteNumbers.push(this.PrimaryData.contacts[x].numbers[p].displayNumber);
            }
            this.AutoCompleteNames.push(this.PrimaryData.contacts[x].name);
        }
        
		var phones = [];
		//enyo.application.settings = inResponse.settings;
		for(var x in this.PrimaryData.phones) {
			phones.push(this.PrimaryData.phones[x]);
		}
		//enyo.log("** Settings received: phones=", phones);
		enyo.application.phones = phones;
		this.$.placeCallView.setPhones(phones);
        
        this.RetrieveBillingCredit();          
        this.endScrim();
    },
    PrimaryDataFailed: function(inSender, inResponse)
    {
        alert("Unable to retrieve outgoing sender information, please relogin");
    },
    InboxReceived: function(inSender, inResponse)
    {
        //this.debugLog("Inbox Received");
        //console.log("InboxReceived", inResponse);
        //return;
        var i = inResponse.indexOf("<json><!")+14;
        var j = inResponse.lastIndexOf("></json>")-1;
        
        try {
            inboxJSON = JSON.parse(inResponse.substring(i, j))[0];
        } catch(err) {
            //this.log("********** UNABLE TO READ INBOX, ARE WE OFFLINE? i="+i+" j="+j);
            //this.log("inResponse was", inResponse);
            return;
        }

        this.$.reloadInboxMenu.setDisabled(false);
        this.$.InboxButton.show();
        
        i = inResponse.indexOf("<div id=");
        j = inResponse.indexOf("<div class=\"gc-footer\">");
        var inboxHTML = inResponse.substring(i, j) + '<div id="';
               
        var index = 0;
        // reset the display completely, so if we have fewer messages than last time, we don't get duplicates showing!
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
                this.MessageIndex[index].note = decodeURI(this.MessageIndex[index].note);
                
                this.MessageIndex[index].isMissedCall = this.Messages[index].isMissedCall;
                this.MessageIndex[index].isBlockedCaller = this.Messages[index].isBlockedCaller;
                this.MessageIndex[index].Portrait = this.Messages[index].Portrait;
                //enyo.WebosConnect.putFile(this.MessageIndex[index].Portrait, "/media/interal/gvoice-icons/"+id+".jpg");
                this.MessageIndex[index].Location = this.Messages[index].Location;
                
                this.MessageIndex[index].isVoicemail = ("voicemail" in this.MessageIndex[index].labels);
                               
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
                    var type = "text";
                    if(this.MessageIndex[index].isVoicemail)
                        type = "voicemail";
                    if(this.MessageIndex[index].isMissedCall)
                        type = "missed call";
                    var disable = prefs.get("newMessageNotifyDisable");
                    if(disable !== true)
                        this.PostNotification(this.MessageIndex[index].id, "New "+type+" from " + this.displayNameOrNumber(index), "New " + type + " received", this.Messages[index][i-1] ? this.Messages[index][i-1].SentMessage : "");
                } else if(enyo.application.launcher && enyo.application.launcher.NotificationDashboards && enyo.application.launcher.NotificationDashboards[this.MessageIndex[index].id]) // TODO: get rid of this, send it to a getter or something
                {
                    this.clearNotificationsFor(this.MessageIndex[index].id);
                }
                index++;
            }
        }
        //Array.prototype.sort.call(response[0].messages, function(a, b) {
        //    return a.phoneNumber.localeCompare(b.phoneNumber);
        //}
        this.$.pagePicker.setMax(Math.ceil(inboxJSON.totalSize / inboxJSON.resultsPerPage));

        this.$.overviewList.render();
        this.$.overviewScroller.render();
        this.$.conversationList.render();
        this.$.IndexList.render();
        this.$.outbox.timedMessageSend();
        if(this.$.InboxButton)
            this.$.InboxButton.setActive(false);
        if(this.selectedID)
            this.scrollToNew();
    },
    RetrievedMessages: function(x) {
        console.log("RetrievedMessages", x);
    },
    FailedRetrieve: function(x) {
        console.log("FailedRetrieve", x);
    },
    InboxFailed: function(inSender, inResponse) {
        alert("Inbox Failed:"+inResponse);
    },
    IndexListClick: function(inSender, inEvent) {
        this.displayConversation(inEvent.rowIndex);
        this.$.IndexList.render();
        inEvent.preventDefault();
        inEvent.stopPropagation();
    },
    displayConversation: function(index)
    {
        if(this.$.PhoneTabs)
        {
            this.$.PhoneTabs.setValue(2);
            this.$.ConversationTab.setDisabled(false);
        }
        var type = "";
        var name = "";
        this.selectedID = this.MessageIndex[index].id;
        //this.log("selecting conversation");
        this.$.rightPane.selectViewByName("conversationView");
        //if(Platform.isLargeScreen()) // PRE - interface change
        //{
            if(this.MessageIndex[index].isMissedCall)
                type += " Missed call";
            if(this.MessageIndex[index].isVoicemail)
                type += " Voicemail";
            if(this.MessageIndex[index].isMissedCall || this.MessageIndex[index].isVoicemail)
                type += " from ";
            else
                type += " Conversation with ";
            type += this.displayNameOrNumber(index);
            if(this.MessageIndex[index].isBlockedCaller)
                type += " (BLOCKED)";
            name = this.MessageIndex[index].displayStartDateTime;
            //this.$.rightHeaderTitle.setContent(type);
        //}
        /*else
        {
            type = this.displayNameOrNumber(index);
            name = this.MessageIndex[index].displayStartDateTime; // name is a misnomer, we're mostly using it for time.. ugh
            //type = this.displayNameOrNumber(index) + "@" + this.MessageIndex[index].displayStartDateTime;
        }*/
        //this.log("conversationHeader", type);
        
        this.$.conversationType.setContent(Platform.isLargeScreen() ? type : (this.displayNameOrNumber(index) + " @ ") );
        /*if(Platform.isLargeScreen())
            name = " @ " + name;*/
        this.$.conversationName.setContent(name);
        if(this.MessageIndex[index].star)
            this.$.conversationStar.setState("starred");
        else
            this.$.conversationStar.setState("unstarred");
            
        this.$.conversationNote.setState(this.MessageIndex[index].note ? "noted" : "unnoted");
        
        this.markMessageRead(this.selectedID);
        if(!Platform.isLargeScreen()) // PRE - switch view to right hand side
        {
            //this.log("selecting right");
            this.$.slidingPane.selectViewByName("right");
        }
        this.$.conversationList.render();
        this.$.quickComposeInput.show();
        this.$.quickComposeInput.setDisabled(false);
        this.$.quickComposeInput.setHint("Enter Message");
        
        //this.scrollToNew();
    },
    displayNameOrNumber: function(index)
    {
        if(!this.MessageIndex[index])
            return "";
        if(!this.MessageIndex[index].displayName && !this.MessageIndex[index].displayNumber)
            this.MessageIndex[index].displayName = "Unknown Caller";
        ////this.log(this.MessageIndex[index].displayName + "," + this.MessageIndex[index].displayNumber + "," + this.MessageIndex[index].displayNumber.length);
        if(this.MessageIndex[index].displayName)
            return this.MessageIndex[index].displayName;
        if(!this.PrimaryData || !this.PrimaryData.contacts) // eek, indices are setup and lists are running before contacts and PD are received.
        {
            ////this.log("no contacts loaded to fix");
            return this.MessageIndex[index].displayNumber;
        }
        for(id in this.PrimaryData.contacts)
        {
            var numbers = this.PrimaryData.contacts[id].numbers;
            for(var x = 0; x < numbers.length; x++)
            {
                ////this.log("comparing", numbers[x].displayNumber, this.MessageIndex[index].displayNumber);
                if(numbers[x].displayNumber == this.MessageIndex[index].displayNumber)
                {
                    this.MessageIndex[index].displayName = this.PrimaryData.contacts[id].name;
                    break;
                }
            }
            if(this.MessageIndex[index].displayName)
                break;
            /*//this.log("comparing",this.PrimaryData.contacts[id].displayNumber, this.MessageIndex[index].displayNumber);
            if(this.PrimaryData.contacts[id].displayNumber == this.MessageIndex[index].displayNumber)
            {
                this.MessageIndex[index].displayName = this.PrimaryData.contacts[id].name;
                break;
            }*/
        }
        return this.MessageIndex[index].displayName ? this.MessageIndex[index].displayName : this.MessageIndex[index].displayNumber;
    },
    getContactIndexByNumber: function(num)
    {
        for(var id in this.PrimaryData.contacts)
        {
            var numbers = this.PrimaryData.contacts[id].numbers;
            for(var x = 0; x < numbers.length; x++)
            {
                ////this.log("comparing", numbers[x].displayNumber, num);
                if(numbers[x].displayNumber == num)
                {
                    return id;
                }
            }
        }
        ////this.log("** Failed to find contact for", num);
        return -1;
    },
    listItemClick: function(inSender, inEvent, inMessageId)
    {
        if(this.$.overviewScroller.isScrolling && this.$.overviewScroller.isScrolling())
            return false;
        if(this.$.conversationScroller.isScrolling && this.$.conversationScroller.isScrolling())
            return false;
        if(typeof blackberry !== "undefined" && inEvent.cancelable)
            return false;
        
        var id = inMessageId ? inMessageId : inSender.messageId;
        var index = this.getMessageIndexById(id);
        ////this.log(inSender, ".", inEvent, ".", inMessageId);
        ////this.log(inSender.messageId + "." + inEvent.rowIndex + "." + inSender.name + "." + id + "." + index);
        
        if(this.Messages[index].html)
        {
            ////enyo.log(this.Messages[index].html);
            //console.log(this.MessageIndex[index]);
            //console.log(this.Messages[index]);
        }
        else
        {
            console.log("* Clicked on nothing");
        }

        this.actionId = id;
        this.actionIndex = index;
        
        //this.log(1);
        this.$.actionsMenu.setMessageIndex(this.MessageIndex[index]);
        //this.log(2);
        this.$.actionsMenu.setContact(this.getContacts(this.getContactIndexByNumber(this.MessageIndex[index].displayNumber)));
        //this.log(3);
        this.$.actionsMenu.setNumber(this.MessageIndex[index].displayNumber);
        //this.log(4);
        this.$.actionsMenu.openAtEvent(inEvent);
        //this.log(5);
        inEvent.stopPropagation();
    }, // TODO: clean up this function
    indexHold: function(inSender, inEvent)
    {
        var index = inEvent.rowIndex;
        var id = this.MessageIndex[index].id;
        
        
        this.actionId = id;
        this.actionIndex = index;
        
        this.$.actionsMenu.setMessageIndex(this.MessageIndex[index]);
        this.$.actionsMenu.setContact(this.getContacts(this.getContactIndexByNumber(this.MessageIndex[index].displayNumber)));
        this.$.actionsMenu.setNumber(this.MessageIndex[index].displayNumber);
        this.$.actionsMenu.openAtEvent(inEvent);
    },
    getIndexListItem: function(inSender, inIndex)
    {
        var msgindex = this.MessageIndex ? this.MessageIndex[inIndex] : undefined;
        if(msgindex) {
            var listitem = this.$.IndexListItem;
            var indexname = this.$.IndexName;
            var str = "";
            
            if(msgindex.Portrait.src.indexOf("blue_ghost.jpg") != -1)
            {
                this.$.IndexImage.hide();
            }
            else {
                //this.$.IndexImage.setContent('<img src="' + msgindex.Portrait.src + '" class="avatar">');
                this.$.IndexImage.setSrc(msgindex.Portrait.src);
            }
            
            if(prefs.get("smallFonts") === true)
            {
                indexname.addClass("enyo-item-secondary");
            }
            
            listitem.addRemoveClass("indexselected", this.MessageIndex[inIndex].id == this.selectedID);

            this.$.IndexName.setContent(this.displayNameOrNumber(inIndex));
            this.$.IndexLocation.setContent(msgindex.Location);
            this.$.IndexTime.setContent(msgindex.displayStartDateTime);
            
            if(this.MessageIndex[inIndex].isVoicemail)
                this.$.VoiceMailIndicator.setShowing(true);
            if(this.MessageIndex[inIndex].note.length > 0)
                this.$.NoteIndicator.setShowing(true);
            if(this.MessageIndex[inIndex].star)
                this.$.StarIndicator.setShowing(true);
            
            this.$.IndexTime.setContent(this.MessageIndex[inIndex].displayStartTime);
            if(!msgindex.isRead)
            {
                listitem.addClass("gvoice-inbox-index-alt");
            } 
            return true;
        }
        return false;
    },
    getConversationListItem: function(inSender, inIndex) {
        var str = "";
        var len = this.Messages ? this.Messages.length : undefined;
        for(var x = 0; x < len; x++)
        {
            if(this.MessageIndex[x].id != this.selectedID)
                continue;
            else
            {
                var messages = this.Messages[x];
                var messageIndex = this.MessageIndex[x];
                var messagefield = this.$.messagefield;
                
                if(inIndex == 0 && (!messages || messages.length == 0))
                { // here is where we come if we don't have any messages to display ..
                    this.$.description.setContent("No further information available.");
                    inSender.messageId = this.Messages[x].id;
                    return true;
                }
                else if(inIndex < messages.length)
                {    
                    inSender.messageId = messages.id;
                    
                    if(!messagefield.hasClass("enyo-item-secondary") && prefs.get("smallFonts") === true)
                    {
                        messagefield.addClass("enyo-item-secondary");
                    }

                    if(messages[inIndex].SentBy == "Me:")    
                    {
                        if(!messagefield.hasClass("gvoice-inbox-message-self"))
                        {
                            messagefield.addClass("gvoice-inbox-message-self"); // it's the "primary" color not the alt, at least that's the intent
                        }
                        this.$.sentTime.setShowing(false);
                        this.$.sentTimeLeft.setShowing(true);
                    }
                    else
                    {
                        if(!messagefield.hasClass("gvoice-inbox-message-alt"))
                        {
                            messagefield.addClass("gvoice-inbox-message-alt");
                        }
                    }
                    
                    if(messageIndex.isVoicemail) {
                        str = messages[inIndex].VoicemailTranscript; 
                    }
                    else if(messages[inIndex].SentMessage) {
                        str = messages[inIndex].SentMessage;
                    }
                    else {
                        str = "Transcript not available.";
                    }
                    this.$.sentTime.setContent(messages[inIndex].SentTime);
                    this.$.sentTimeLeft.setContent(messages[inIndex].SentTime);
                    this.$.description.setContent(/*"("+messages[inIndex].SentTime + ") " +*/ str);
    
                    return true;
                } 
            } 
        }
        return false;  
    }, // TODO: seriously optimize this function
    overviewListRender: function(inSender, inRow)
    {
        if(!this.MessageIndex)
            return false;
        if(inRow == 0 && !this.MessageIndex[inRow])
        {
            this.overviewMsg = -1;
            this.$.overviewTitle.hide();
            if(inSender.messageId)
                delete inSender.messageId;
            return true; // pass this to overviewListRenderItem to draw a message stating that we are lonely
        }
        var title = "";
        var messageIndex = this.MessageIndex[inRow];
        if(this.MessageIndex[inRow]) {
            this.overviewMsg = inRow;
            if(this.MessageIndex[inRow].isMissedCall)
                title += "MISSED CALL from ";
            if(this.MessageIndex[inRow].isVoicemail)
            {
                if(messageIndex.isVoicemail)
                    title += "VOICEMAIL from ";                    
            }
            title += this.displayNameOrNumber(this.overviewMsg);
            if(this.MessageIndex[inRow].isBlockedCaller)
                title += " (BLOCKED)";

            
            this.$.messageListRepeater.setMessageId(this.MessageIndex[inRow].id);
            inSender.messageId = this.MessageIndex[inRow].id;
            
            if(messageIndex.Location != "")
                title += " " + messageIndex.Location; 
            title += " @ " + messageIndex.displayStartDateTime;
            if(messageIndex.star)
                this.$.overviewStar.setState("starred");
            else
                this.$.overviewStar.setState("unstarred");
            this.$.overviewStar.setMessageId(messageIndex.id);
            this.$.overviewStar.setMessageIndex(inRow);
            
            this.$.overviewNote.setState(messageIndex.note ? "noted" : "unnoted");
            this.$.overviewNote.setMessageId(messageIndex.id);
            this.$.overviewNote.setMessageIndex(inRow);
            
            this.$.overviewTitle.setCaption(title);
            
            return true;
        } else {
            this.overviewMsg = "";
        }
        return false;
    },
    ReplyButtonClick: function(inSender, inEvent)
    {
        var indexToSendTo = inEvent.rowIndex;
        if(this.selectedID != "")
            indexToSendTo = this.getMessageIndexById(this.selectedID);
        
        this.openComposePopup(this.MessageIndex[indexToSendTo].phoneNumber);
    },
    CallButtonClick: function(inSender, inEvent)
    {
        var index = inEvent.rowIndex;
        if(this.selectedID != "")
            index = this.getMessageIndexById(this.selectedID);
        this.openPlaceCallPopup(this.MessageIndex[index].phoneNumber);
    },
    messagesSent: function(inSender, counter)
    {
        var mstr = (counter != 1) ? " messages" : " message";
        if(counter == 0) counter = 1;
        //var sound = (counter == 1) ? "" : "/media/internal/ringtones/Triangle (short).mp3";
        var sound = "";
        enyo.windows.addBannerMessage(counter + mstr + " sent", '{}', "images/google-voice-icon24.png", "", sound);
        this.RetrieveInbox();
    },
    sendSMSMessage: function(to, msg)
    {
        //this.$.outbox.sendSMSMessage(to, msg);
        if(!msg || msg == "")
            return;
        this.$.outbox.queueMessage(to, msg);
    },
    placeOutgoingCall: function(recp, phone)
    {
        this.log(recp, phone);
        if(!recp || recp == "") {
            enyo.windows.addBannerMessage("No Recipient Given", '{}', "images/google-voice-icon24.png", "")
            return;
        }
        if(!this.selectedPhone && !phone && !this.PrimaryData.phones[phone])
        {
            console.log("***************** NO OUTGOING PHONE SELECTED??????????????? ******************");
            enyo.windows.addBannerMessage("No Outgoing Phone Selected", '{}', "images/google-voice-icon24.png", "")
            return;
        }
        //this.log("phones=" + JSON.stringify(this.PrimaryData.phones));
        //return;
        this.log("using phone=" + JSON.stringify(this.PrimaryData.phones[phone]));
        var params = {
            outgoingNumber:recp,
            forwardingNumber:this.PrimaryData.phones[phone].phoneNumber,
            subscriberNumber:"undefined",
            phoneType:this.PrimaryData.phones[phone].type,
            _rnr_se:this.PrimaryData._rnr_se
        };
        enyo.log("Placing phone call with parameters: " + JSON.stringify(params));
        this.$.CallNumber.headers = { "Authorization":"GoogleLogin auth="+this.AuthCode };
        //enyo.log("calling " +params.outgoingNumber + " from " + params.forwardingNumber);
        this.$.CallNumber.call(params);
        //this.closePlaceCallPopup(); // no longer auto close place call popup, let it do it itself
        //this.$.callSendButton.setDisabled(true);
        //this.$.callCancelButton.setCaption("End Call");
        //this.RetrieveInbox();
    },
    cancelOutgoingCall: function(inSender, inEvent)
    {
        var params = {
            outgoingNumber: "",
            forwardingNumber: "",
            cancelType: "C2C",
            _rnr_se: this.PrimaryData._rnr_se
        };
        ////this.log("params=", params);
        this.$.callCancel.call( { outgoingNumber:"undefined", forwardingNumber:"undefined",cancelType:"C2C",_rnr_se:this.PrimaryData._rnr_se });
        //this.setHackWebURL("https://www.google.com/voice/m/callsms");
        this.closePlaceCallPopup();
    },
    deleteConfirmed: function(inSender, permanent)
    {
        var index = this.$.deletePopup.msgindex;
        this.deleteMessage(this.MessageIndex[index].id, permanent);
        this.clearNotificationsFor(this.MessageIndex[index].id);        
        if(this.MessageIndex[index].id == this.selectedID)
            this.resetSelectedID();
        this.$.deletePopup.close();
    },
    deleteMessage: function(msgid, permanent)
    {
        var params = {
            messages:msgid,
            _rnr_se:this.PrimaryData._rnr_se
        };
        if(!permanent) params.trash = 1;
        this.$.deleteMessage.headers = { "Authorization":"GoogleLogin auth="+this.AuthCode };
        this.$.deleteForeverMessage.headers = { "Authorization":"GoogleLogin auth="+this.AuthCode };
        this.$.deleteForeverMessage.setUrl(this.PrimaryData.baseUrl + "/inbox/deleteForeverMessages");
        if(permanent) this.$.deleteForeverMessage.call(params);
        else this.$.deleteMessage.call(params);
    },
    archiveMessage: function(inSender, inEvent)
    {
        var index = inEvent.rowIndex;
        if(this.selectedID != "")
            index = this.getMessageIndexById(this.selectedID);
        var params = {
            messages:this.MessageIndex[index].id,
            archive:1,
            _rnr_se:this.PrimaryData._rnr_se,
        };
        if(params.messages == this.selectedID)
            this.resetSelectedID();
        this.$.archiveMessages.headers = { "Authorization":"GoogleLogin auth="+this.AuthCode };
        this.$.archiveMessages.call(params);
        this.clearNotificationsFor(this.MessageIndex[index].id);        
        setTimeout(enyo.bind(this, this.RetrieveInbox), 100);
    },
    ListenButtonClick: function(inSender, inEvent)
    {
        var index = inEvent.rowIndex;
        if(this.selectedID != "")
            index = this.getMessageIndexById(this.selectedID);
        this.$.vmDownload.headers = { "Authorization":"GoogleLogin auth="+this.AuthCode };
        var params = {
            messages:this.MessageIndex[index].id,
            _rnr_se:this.PrimaryData._rnr_se
        };
        this.playVoicemail(this.MessageIndex[index].id);
        if(this.$.voicemailStop)
            this.$.voicemailStop.setDisabled(false);
        //this.log();
        inEvent.stopPropagation();
        this.startScrim();
        setTimeout(function(thisObj) { thisObj.endScrim(); }, 2000, this);
    },
    dashboardTap: function(inSender, dashProps, inEvent)
    {
        var title = "";
        var index = this.getMessageIndexById(dashProps.id);
        inSender.pop();
        //enyo.log("dashboardTap ", "inSender", inSender, "inEvent", inEvent, "dashProps", dashProps);
        enyo.windows.activateWindow(window);

        this.displayConversation(index);        
    },
    PostNotification: function(msgid, msg, nonamemsg, msgtext)
    {
        //this.log("********************* POSTING NOTIFICATION **************** ");
        enyo.application.launcher.PostNotification(msgid, msg, nonamemsg, msgtext);
    },
    /*dashboardActivated: function(dash) {
        //dash.applyStyle("background-color", "black");
        //this.log("**************** DASHBOARD ACTIVATED ***************** ");
        for(l in dash)
        {
            var c = dash[l].dashboardContent;
            if(c)
            {
                console.log(c);
                c.$.topSwipeable.applyStyle("background-color", "black");
                //dash[l].dashboardContent.$.layer0.applyStyle("background-color", "black");
                //dash[l].dashboardContent.$.layer1.applyStyle("background-color", "black");
                //dash[l].dashboardContent.$.layer2.applyStyle("background-color", "black");
            }
        }
    },*/
    openContactsView: function(inSender, inEvent)
    {
        /*this.log(inEvent, inEvent.cancelable);
        if(typeof blackberry !== "undefined" && inEvent.cancelable)
            return;*/
        this.LeftPaneView = 1 - this.$.leftPane.getViewIndex();
        this.log("selecting " + this.LeftPaneView);
        this.$.leftPane.selectViewByIndex(this.LeftPaneView);
        if(!Platform.hasBack() && this.LeftPaneView == 1)
        {
            this.$.contactsButton.setCaption("Back");
            this.$.contactsButton.setIcon("");
        }
        else {
            this.$.contactsButton.setIcon((!window.PalmSystem) ? "mainApp/images/contacts2.png" : "images/contacts2.png");
            this.$.contactsButton.setCaption("");
        }
        this.$.leftPane.render();
        inEvent.preventDefault();
        inEvent.stopPropagation();
    },
    getContacts: function(idx)
    {
        if(idx || idx === 0)
            return this.PrimaryData.contacts[idx];
        return this.PrimaryData.contacts;
    },
    getPhones: function()
    {
        return this.PrimaryData.phones;
    },
    selectPhone: function(phone)
    {
        this.selectedPhone = phone;
        enyo.setCookie("selectedPhone", this.selectedPhone);
    },
    linkClicked: function(inSender, inUrl, inEvent)
    {
        //this.log(inSender, inUrl, inEvent);
        url = inUrl.replace(/^tel:/, "");
        if(url == inUrl)
        {
            this.$.AppManService.call( { target: inUrl } );
        }
        else
        {
            this.clickedPhoneNum = url.replace("%20", "");
            this.$.phonePopupMenu.openAtEvent(inEvent);
            this.$.phonePopupMenu.setTitle(formatPhoneNumber(url));
        }
    },
    doPhoneMenu: function(inSender, inEvent, phone)
    {
        this.$.phonePopupMenu.openAtEvent(inEvent);
        this.clickedPhoneNum = phone.phoneNumber;
        this.$.phonePopupMenu.setTitle(formatPhoneNumber(phone.phoneNumber));
    },
    doEmailMenu: function(inSender, inEvent, email)
    {
        this.clickedEmail = email;
        this.$.emailPopupMenu.openAtEvent(inEvent);
    },
    emailFromPopup: function(inSender)
    {
        if(window.PalmSystem)
            this.$.AppManService.call( { target: "mailto:" + this.clickedEmail } );
        else
            Platform.browser("mailto:" + this.clickedEmail, this)();
        return true;
    },
    popupCallClicked: function(inSender, inEvent)
    {
        this.openPlaceCallPopup(this.clickedPhoneNum);
    },
    popupTextClicked: function(inSender, inEvent)
    {
        this.openComposePopup(this.clickedPhoneNum);
    },
    saveNote: function(inSender, msgindex, note)
    {
        this.MessageIndex[msgindex].note = note;
        note = encodeURI(note);
        var params = {
            //id=521c44efc111f5e94dc6204e210ebc1dc25e0fd3&note=TESTNOTETESTNOTE%0Asdfsdfdf&_rnr_se=NmWrGYW5yjuJV6GReaLDrlu8vfI%3D
            id: this.MessageIndex[msgindex].id,
            "note": note,
            _rnr_se: this.PrimaryData._rnr_se,
        }
        this.$.saveNote.headers = { "Authorization":"GoogleLogin auth="+this.AuthCode };
        this.$.saveNote.call( params );
        /* just hope for no race condition here .. :) */
        enyo.nextTick(this, this.RetrieveInbox);
    },
    playVoicemail: function(msgid)
    {        
        if(Platform.isWebOS())
        {
            if(Platform.platformVersion >= 2)
            {
                this.$.CreateVoicemailDir.call();
                this.$.newPlayVoicemail.call({
                    host: "www.google.com",
                    path: "/voice/b/0/media/send_voicemail/" + encodeURI(msgid),
                    method: "GET",
                    cookies: "GALX=" + enyo.application.api.GALX,
                    headers: {
                        "Authorization":"GoogleLogin auth=" + this.AuthCode
                    },
                    savefile: "/media/internal/.voicemail/vm"+msgid+".mp3",
                    binary: true
                });
                return;                
            }
            // TODO: We currently have no plan for webOS < 2.0
        }
        // doesn't look like HTML5 Audio will work here, due to needing the cookie and/or the header
        /*if(!Platform.isWebOS() || !Platform.hasFlash()) 
        {
            this.sound = this.createComponent({ name: "VMPlayer", kind: "PlatformSound", preload: true, audioClass: "media" }, { owner: this });
            this.sound.setSrc("/voice/b/0/media/send_voicemail/" + encodeURI(msgid));
            this.sound.play();
            return;
        }*/
        if(Platform.hasFlash())
        {
            var launchtarget = "http://ericbla.de/test.php?swfPath=" + encodeURIComponent(this.PrimaryData.swfPath) +
                        "&baseUrl=" + encodeURIComponent(this.PrimaryData.baseUrl) + "&conv=" + encodeURIComponent(msgid);
            enyo.windows.addBannerMessage("Launching Voicemail Browser", '{}', "images/google-voice-icon24.png", "")
            Platform.browser(launchtarget, this)();
            return;
        }
        return;
        /* keeping this code in here just for the memories, as we don't need it anymore, thank fucking god */
        var flashStr = '<object id="gc-audioPlayer" name="gc-audioPlayer" height="20" width="100%"' +
                ' type="application/x-shockwave-flash"' +
                ' movie="' +
                "https://www.google.com" +
                this.PrimaryData.swfPath +
                '"' +
                ' data="' +
                "https://www.google.com" +
                this.PrimaryData.swfPath + 
                '">' +
                ' <param name="wmode" value="transparent"/>' +
                ' <param name="' +
                "https://www.google.com" +
                this.PrimaryData.swfPath +
                '"/>' +
                '<param name="flashvars" value="messagePath=' +
                encodeURIComponent(this.PrimaryData.baseUrl + '/media/send_voicemail/' + msgid + '?read=0') +
                '&baseurl=' +
                encodeURIComponent(this.PrimaryData.baseUrl) +
                '&conv=' +
                msgid +
                '"/>' +
                '</object>';
        // SHOULD work, i think, but doesn't .. fixed in next webOS? maybe?
        //this.$.vmAudio.setSrc("http://www.google.com/voice/m/playvoicemail?id="+msgid+"&auth="+this.AuthCode);
        //this.$.vmAudio.play();
        
        // doesn't work, maybe fixed in future updates... ?
        //this.$.AppManService.call( { target: "http://www.google.com/voice/m/playvoicemail?id="+msgid+"&auth="+this.AuthCode });
        
        // unfortunately, works
        this.setHackWebHTML(flashStr);

        ////this.log("trying to download", "http://www.google.com/voice/m/playvoicemail?id="+msgid+"&auth="+this.AuthCode)
        
        // neither of these work either
        //this.$.vmDownload.setUrl("http://www.google.com/voice/m/playvoicemail");
        //this.$.vmDownload.call( { id:msgid, auth: this.AuthCode} );
        /*this.$.fileDownload.call( {
            target: "https://www.google.com/voice/m/playvoicemail?ui=desktop&id="+msgid+"&auth="+this.AuthCode,
            mime: "audio/mpeg3",
            targetDir: "/media/internal",
            cookieHeader: "GALX=" + this.GALX + ";SID="+this.SID+";LSID=grandcentral:"+this.LSID+"gv="+this.LSID,
            targetFilename: "voicemail.mp3",
            keepFilenameOnRedirect: true,
            canHandlePause: true,
            subscribe: true
        })*/
    },
    downloadFinished: function(inSender, x, y)
    {
        //this.log();
    },
    stopPlayback: function(inSender, inEvent)
    {
        this.setHackWebHTML("");
        if(this.$.voicemailStop)
            this.$.voicemailStop.setDisabled(true);
        inEvent.stopPropagation();
    },
    startScrim: function() {
        //this.log();
        enyo.scrim.show();
        this.$.mainSpinner.show();
        this.$.mainSpinner.setShowing(true);
    },
    endScrim: function() {
        //this.log();
        enyo.scrim.hide();
        this.$.mainSpinner.hide();
        this.$.mainSpinner.setShowing(false);
    },
    actionReply: function(inSender, inEvent, x)
    {
        //this.log(this.actionIndex+"."+this.actionId+"."+inSender+"."+inEvent+"."+x);
        this.openComposePopup(this.MessageIndex[this.actionIndex].phoneNumber);
    },
    actionCall: function()
    {
        this.openPlaceCallPopup(this.MessageIndex[this.actionIndex].phoneNumber);
    },
    actionDelete: function()
    {
        this.openDeletePopup(this.actionIndex);
    },
    actionVoicemail: function()
    {
        if(this.$.voicemailStop)
            this.$.voicemailStop.setDisabled(false);
        this.startScrim();
        setTimeout(function(thisObj) { thisObj.endScrim(); }, 2000, this);
        //this.log(this.actionId);
        this.playVoicemail(this.actionId);
    }, // TODO: Actually bring up a pop-up to verify this!!!
    confirmBlockUnblock: function(inSender)
    {
        this.displayConversation(this.actionIndex);
        this.$.blockConfirmDialog.open();        
    },
    performBlockUnblock: function(inSender)
    {
        var params = {
            messages:this.actionId,
            blocked:this.MessageIndex[this.actionIndex].isBlockedCaller ? "0" : "1",
            _rnr_se:this.PrimaryData._rnr_se,
        };
        this.$.blockCaller.setUrl(this.PrimaryData.baseUrl + "/inbox/block/");
        this.$.blockCaller.call( params );        
    },
    callerBlocked: function(inSender, inResponse)
    {
        //this.log(inResponse);
        this.resetSelectedID();
        setTimeout(enyo.bind(this, this.RetrieveInbox), 100);        
    },
    actionArchive: function()
    {
        ////this.log(this, this.actionId);
        var params = {
            messages:this.actionId,
            archive:1,
            _rnr_se:this.PrimaryData._rnr_se,
        };
        if(params.messages == this.selectedID)
            this.resetSelectedID();
        this.$.archiveMessages.headers = { "Authorization":"GoogleLogin auth="+this.AuthCode };
        this.$.archiveMessages.call(params);
        setTimeout(enyo.bind(this, this.RetrieveInbox), 100);
    },
    doStar: function(inSender, inEvent)
    {
        if(typeof blackberry !== "undefined" && inEvent.cancelable)
            return true;
        if(!inSender.messageIndex && !inSender.messageId) {
            inSender.messageIndex = this.getMessageIndexById(this.selectedID);
            inSender.messageId = this.selectedID;
        }
        this.MessageIndex[inSender.messageIndex]["star"] = !this.MessageIndex[inSender.messageIndex]["star"];
        var params = {
            messages:inSender.messageId,
            star:this.MessageIndex[inSender.messageIndex].star ? "1" : "0",
            _rnr_se:this.PrimaryData._rnr_se,
        };
        this.$.archiveMessages.headers = { "Authorization":"GoogleLogin auth="+this.AuthCode };
        this.$.starMessage.setUrl(this.PrimaryData.baseUrl + "/inbox/star/");
        this.$.starMessage.call( params );
        //this.log(params.star);
        if (params.star == "1") {
            //this.log("setting star");
            inSender.setState("starred");
        }
        else {
            //this.log("unsetting star");
            inSender.setState("unstarred");
        }
    },
    openNote: function(inSender, inEvent)
    {
        if(typeof blackberry !== "undefined" && inEvent.cancelable)
            return true;
        if(!inSender.messageIndex && !inSender.messageId) {
            inSender.messageIndex = this.getMessageIndexById(this.selectedID);
            inSender.messageId = this.selectedID;
        }
        this.$.NotePopup.openAtEvent(inEvent);
        this.$.NotePopup.setMessageIndex(inSender.messageIndex);
        this.$.NotePopup.setMessageId(inSender.messageId);
        this.$.NotePopup.setNote(this.MessageIndex[inSender.messageIndex].note);
        inEvent.preventDefault();
        inEvent.stopPropagation();
        return true;
    },
    doAddToContacts: function(name, number, type)
    {
        var params = {
            phoneNumber: number,
            phoneType: type,
            name: name,
            _rnr_se: this.PrimaryData._rnr_se,
        };
        this.$.gvAddToContacts.call( params );
    },
    swipeArchive: function(inSender, index)
    {        
        this.actionIndex = index;
        this.actionId = this.MessageIndex[index].id
        //this.log(this, this.actionIndex, this.actionId);        
        this.actionArchive();
    },
    swipeDelete: function(inSender, index)
    {
        this.actionIndex = index;
        this.actionId = this.MessageIndex[index].id
        enyo.application.mainApp.$.deletePopup.msgindex = index;
        //this.log(this, this.actionIndex, this.actionId);
        this.deleteConfirmed();
    },
    doQuickCompose: function(str)
    {
        if(str == "" || str.length == 0)
            return;
        var index = this.getMessageIndexById(this.selectedID);
        this.sendSMSMessage(this.MessageIndex[index].phoneNumber, str);
        this.$.quickComposeInput.setValue("");
    },
    quickComposeKeypress: function(inSender, inEvent)
    {
        var x = this.$.quickComposeInput.getValue();
        if(inEvent && inEvent.keyCode == 13)
        {
            this.doQuickCompose(x);
            this.$.quickComposeInput.forceBlur();
            return true;
        }
        this.$.quickComposeInput.forceFocus(null, true);
        //this.$.quickComposeInput.setSelection( {start: x.length, end: x.length});
        return false;
    },
    messageSearchKeypress: function(inSender, inEvent)
    {
        if(inEvent && inEvent.keyCode == 13)
        {
            this.doSearch(this.$.messageSearchInput.getValue());
            return true;
        }
        return false;
    },
    doSearch: function(str, page)
    {
        if(!page) page = "1";
        this.messageSearch = str;
        //this.log("?q="+str+"&page=p"+page);
        enyo.application.mainApp.$.messageSearch.call({ "q":str, page:"p"+page });
        enyo.application.mainApp.$.boxPicker.setValue("Search");
    },
    messageSearchClick: function()
    {
        enyo.application.mainApp.$.boxPicker.setValue("Search");
    },
    openAddContactPopup: function(inSender)
    {
        this.$.contactAddPopup.setNumber(inSender.number);
        //this.$.contactAddPopup.openAtCenter();
        this.$.contactAddPopup.open();
    },
    addContact: function(inSender, inName, inNumber, inType)
    {
        if(!inName || inName == "")
        {
            enyo.windows.addBannerMessage("No Name Specified", '{}', "images/google-voice-icon24.png", "");
            return;
        }
        if(!inNumber || inNumber == "")
        {
            enyo.windows.addBannerMessage("No Number Specified", '{}', "images/google-voice-icon24.png", "");
            return;
        }
        if(!inType || inType == "")
        {
            enyo.windows.addBannerMessage("No Telephone Type Specified", '{}', "images/google-voice-icon24.png", "");
            return;
        }
        ////this.log("a",a,"b",b,"c",c,"x",x,"y",y,"z",z);
        this.$.contactAddPopup.close();
        
        var params = {
            phoneNumber: inNumber.replace(/[^0-9]/g, ''),
            phoneType: inType.toUpperCase(),
            name: inName,
            needsCheck: "1",
            _rnr_se: this.PrimaryData._rnr_se
        };
        //this.log(params);
        this.$.gvAddToContacts.setUrl(this.PrimaryData.baseUrl + "/phonebook/quickAdd/");
        //this.log(this.$.gvAddToContacts.url);
        this.$.gvAddToContacts.call( params );
    },
    addContactSuccess: function(inSender, inResponse)
    {
        enyo.windows.addBannerMessage("Contact Added", '{}', "images/google-voice-icon24.png", "");
        enyo.application.api.RetrievePrimaryData();
    },
    addContactFailure: function(inSender, inResponse)
    {
        //this.log(inResponse);
        enyo.windows.addBannerMessage("Contact Add Failed:"+inResponse, '{}', "images/google-voice-icon24.png", "");
    },
    deleteForeverSuccess: function(inSender, inResponse)
    {
        if(inResponse.ok == true)
        {
            enyo.windows.addBannerMessage("Conversation Permanently Deleted", '{}', "images/google-voice-icon24.png", "");
            enyo.application.mainApp.RetrieveInbox();
        } else {
            enyo.windows.addBannerMessage("Delete Failed", '{}', "images/google-voice-icon24.png", "");
            //this.log(inSender, inResponse);
        }
    },
    deleteForeverFailed: function(inSender, inResponse)
    {
        //this.log(inSender, inResponse);
    },
    actionPlaceCall: function(inSender, num, phone) // called from the onPlaceCall event in the placeCallPopup
    {
        this.log(num, phone);
        this.placeOutgoingCall(num, phone);
    },
    webviewTitleChange: function(x, y, z)
    {
        this.webViewTitle = y;
        this.debugLog("webviewTitleChange: " + y);
        //this.log(Platform.isLargeScreen(), y);
        if(this.webViewTitle == "")
        {
            this.lastTitleWasBlank = true;
        } else 
        if(this.webViewTitle == "Google Voice - One phone number, online voicemail, and enhanced call features")
        {
            if(Platform.isLargeScreen() && this.$.rightPane.getViewName() != "webView")
            {
                this.$.rightPane.selectViewByName("webView");
                //this.log("selecting webView");
            }
            this.forcedWebView = true;
        } else if(this.webViewTitle == "Google Voice" && (this.forcedWebView || this.lastTitleWasBlank)) {
            if(this.$.rightPane.getViewName() != "overviewView")
            {
                //this.log("selecting overview");
                this.$.rightPane.selectViewByName("overviewView");
                this.forcedWebView = false;
            }
        }
    },
    // TODO: Why do we have "openAddContact" and "openAddContactPopup"?
    openAddContact: function() {
        //this.$.contactAddPopup.openAtCenter();
        this.$.contactAddPopup.open();
    },
    activatePhone: function(phoneid, active)
    {
        if(!IsNumeric(phoneid)) // someone passed us a phone name
        {
            var compare = phoneid.toLower();
            for(var x in this.PrimaryData.phones)
            {
                if(this.PrimaryData.phones[x].name.toLower() == compare)
                    phoneid = this.PrimaryData.phones[x].id;
            }
        }
        var params = {
            phoneId:phoneid,
            enabled:active ? "1":"0",
            _rnr_se:this.PrimaryData._rnr_se
        };
        this.$.editDefaultForwarding.call( params );
    },
	openAppMenuHandler: function(inSender, inEvent) {
            this.log(enyo.application.mainApp);
            this.log(enyo.application.mainApp.$.AppMenu);
	    enyo.application.mainApp.$.AppMenu.open();
            if(inEvent)
                this.cancelEvent(inSender, inEvent);
	},
	closeAppMenuHandler: function() {
	    this.$.AppMenu.close();
	},
    qcFocus: function(inSender, inEvent)
    {
        ////this.log();
        if(!Platform.isLargeScreen()) // pre - toolinput scrolls app off screen, wth?
        {
            this.composeButtonClick();
        } else {
            this.$.composeButton.hide();
            this.$.newCallButton.hide();
            this.$.voicemailButton.hide();
            if(this.$.voicemailStop)
                this.$.voicemailStop.hide();
        }
        inEvent.stopPropagation();
        inEvent.preventDefault();
        return -1;
    },
    qcBlur: function()
    {
        ////this.log();
        this.$.composeButton.show();
        this.$.newCallButton.show();
        if(Platform.isLargeScreen())
        {
            this.$.voicemailButton.show();
            if(this.$.voicemailStop)
                this.$.voicemailStop.show();
        }
    },
    tabSelect: function(inSender, x)
    {
        ////enyo.log(inSender, x);
        if(x == 0)
        {
            this.$.slidingPane.selectViewByName("left");
            this.$.rightPane.selectViewByName("index");
        } else if(x == 1)
        {
            this.$.slidingPane.selectViewByName("right");
            this.$.rightPane.selectViewByName("overviewView");
        } else if(x == 2)
        {
            this.$.slidingPane.selectViewByName("right");
            this.$.rightPane.selectViewByName("conversationView");
        }
    },
    viewChange: function(inSender, inNewView, inPrevView)
    {
        if(this.$.PhoneTabs && this.PrimaryData) {
            if(inNewView.name == "left")
            {
                this.$.PhoneTabs.setValue(0);
            } else if(inNewView.name == "right") {
                var n = this.$.rightPane.getViewName();
                if(n != "placeCallView")
                    this.$.RightToolbar.show();
                switch(n)
                {
                    case "overviewView":
                        this.$.PhoneTabs.setValue(1);
                        break;
                    case "conversationView":
                        this.$.PhoneTabs.setValue(2);
                        //this.$.conversationScroller.scrollTo(this.$.conversationScroller.getBoundaries().bottom, 0);
                        this.$.conversationScroller.scrollToBottom();
                        break;
                    case "placeCallView":
                        this.$.RightToolbar.hide();
                        break;
                    default:
                        this.$.PhoneTabs.setValue(10);
                        break;
                }
            } else if(this.$.slidingPane.getViewName() == "right" && inNewView.name == "overviewView") {
                this.$.PhoneTabs.setValue(1);
                this.$.quickComposeInput.hide();
            } else if(inNewView.name == "conversationView") {
                this.$.PhoneTabs.setValue(2);
            }
        }
        if(inNewView == this.$.conversationView && !this.$.PhoneTabs)
        {
            this.$.conversationScroller.scrollToBottom();
        }
    }
    
});

enyo.kind({
    name: "maklesoft.cross.ApplicationEvents",
    kind: enyo.ApplicationEvents,
    events: {
        onSearch: ""
    },
    create: function() {
        this.inherited(arguments);
        
        this.chromeWindowFocusChangedHandler = enyo.bind(this, this.chromeWindowFocusChangedHandler);
        this.windowActivatedHandler = enyo.bind(this, this.doWindowActivated);
        this.windowDeactivatedHandler = enyo.bind(this, this.doWindowDeactivated);
        this.backHandler = enyo.bind(this, this.doBack);
        this.openAppMenuHandler = enyo.bind(this, this.doOpenAppMenu);
        this.searchHandler = enyo.bind(this, this.doSearch);
        
        if(typeof blackberry != 'undefined' && blackberry.app.event)
        {
            blackberry.app.event.onBackground(this.windowDeactivatedHandler);
            blackberry.app.event.onForeground(this.windowActivatedHandler);
            blackberry.app.event.onSwipeDown(this.openAppMenuHandler);
        }
        
        if (typeof chrome != 'undefined' && chrome.windows) {
            if (this.onWindowActivated || this.onWindowDeactivated) {
	            chrome.windows.getCurrent(enyo.bind(this, function(window) {
                        this.chromeWindowId = window.id;
                        chrome.windows.onFocusChanged.addListener(this.chromeWindowFocusChangedHandler);  
	            }))
	        }
	    } else if (typeof PhoneGap != 'undefined') {
	        if (this.onWindowActivated) {
	            document.addEventListener("pause", this.windowActivatedHandler, false);
            }
            if (this.onWindowDeactivated) {
	            document.addEventListener("resume", this.windowDeactivatedHandler, false);
            }
            
            if (this.onBack) {
                document.addEventListener("backbutton", this.backHandler, false);
            }
            
            if (this.onOpenAppMenu) {
                document.addEventListener("menubutton", this.openAppMenuHandler, false);
            }
            
            if (this.onSearch) {
                document.addEventListener("searchbutton", this.searchHandler, false);
            }
	}
    },
    chromeWindowFocusChangedHandler: function(windowId) {
        if (this.chromeWindowId == windowId) {
            this.doWindowActivated();
        } else {
            this.doWindowDeactivated();
        }
    },
    destroy: function() {
        this.inherited(arguments);
        if (typeof chrome != 'undefined' && chrome.windows) {
            chrome.windows.onFocusChanged.removeListener(this.chromeWindowFocusChangedHandler);
	    } else if (typeof PhoneGap != 'undefined') {
            document.removeEventListener("pause", this.windowActivatedHandler);
            document.removeEventListener("resume", this.windowDeactivatedHandler);
            document.removeEventListener("backbutton", this.backHandler);
            document.removeEventListener("menubutton", this.openAppMenuHandler);
            document.removeEventListener("searchbutton", this.searchHandler);
        }
    }
});

// POST /accounts/ClientLogin accountType=GOOGLE&Email=[google account]&Passwd=[google password]&service=grandcentral&source=[your app name]
// Placing Calls:
// POST /voice/call/connect/ outgoingNumber=[number to call]&forwardingNumber=[forwarding number]&subscriberNumber=undefined&phoneType=[phone type]&remember=0&_rnr_se=[pull from page]
/*Phone Types:
 1) Home
 2) Mobile
 3) Work
 7) Gizmo*/
/*Canceling Calls:
 POST /voice/call/cancel/ outgoingNumber=undefined&forwardingNumber=undefined&cancelType=C2C&_rnr_se=[pull from page]

Sending an SMS:
 POST /voice/sms/send/ id=&phoneNumber=[number to text]&text=[URL Encoded message]&_rnr_se=[pull from page]

Inbox XML:
https://www.google.com/voice/inbox/recent/inbox/

Starred Calls XML:
https://www.google.com/voice/inbox/recent/starred/

All Calls XML:
https://www.google.com/voice/inbox/recent/all/

Spam XML:
https://www.google.com/voice/inbox/recent/spam/

Trash XML:
https://www.google.com/voice/inbox/recent/trash/

Voicemail XML:
https://www.google.com/voice/inbox/recent/voicemail/

SMS XML:
https://www.google.com/voice/inbox/recent/sms/

Recorded Calls XML:
https://www.google.com/voice/inbox/recent/recorded/

Placed Calls XML:
https://www.google.com/voice/inbox/recent/placed/

Received Calls XML:
https://www.google.com/voice/inbox/recent/received/

Missed Calls XML:
https://www.google.com/voice/inbox/recent/missed/

XML Pagination:
 ?page=p2
 ?page=p3
 etc..

Downloading a Voice Message:
https://www.google.com/voice/media/send_voicemail/[message id]

Deleting a Voice Message:
 POST /voice/inbox/deleteMessages/ messages=[message id]&trash=1&_rnr_se=[pull from page]

Mark a message as read:
 POST /voice/inbox/mark/ messages=[message id]&read=1&_rnr_se=[pull from page]

Mark a message as unread:
 POST /voice/inbox/mark/ messages=[message id]&read=0&_rnr_se=[pull from page]

Voicemail Transcript Timing:
https://www.google.com/voice/media/transcriptWords?id=[message id]*/

/*
 [{"messages":
    {"b61af8a73da92c3fdd0b8fb90866d4cc1140b3cd":
        {"id":"b61af8a73da92c3fdd0b8fb90866d4cc1140b3cd",
        "phoneNumber":"+17341111111",
        "displayNumber":"(734) 111-1111",
        "startTime":"1314472446198",
        "displayStartDateTime":"8/27/11 3:14 PM",
        "displayStartTime":"3:14 PM",
        "relativeStartTime":"23 minutes ago",
        "note":"",
        "isRead":true,
        "isSpam":false,
        "isTrash":false,
        "star":false,
        "messageText":
        "Im bring duck tonite.. Sorry..lol he asked for a ride and since im only a mile away i had a hard time saying no",
        "labels":["inbox","sms","all"],
        "type":10,
        "children":""
        },
    "f75c8481ad2e660953c7be494224234f996bbbdc":
        {"id":"f75c8481ad2e660953c7be494224234f996bbbdc",
        "phoneNumber":"+17342222222",
        "displayNumber":"(734) 222-2222",
        "startTime":"1314333511107",
        "displayStartDateTime":"8/26/11 12:38 AM",
        "displayStartTime":"12:38 AM",
        "relativeStartTime":"38 hours ago",
        "note":"",
        "isRead":true,
        "isSpam":false,
        "isTrash":false,
        "star":false,
        "messageText":"Ok what just happened?",
        "labels":["inbox","sms","all"],
        "type":11,"children":""
        }
    },
    "totalSize":2,
    "unreadCounts":
    {"all":0,"inbox":0,"missed":0,"placed":0,"received":0,"recorded":0,"sms":0,"trash":1,"unread":0,"voicemail":0},
    "resultsPerPage":10
}]
*/

// <div id="gaia_loginbox" class="body"><form id="gaia_loginform" action="https://www.google.com/accounts/ServiceLoginAuth" method="post">
// <input type="hidden" name="ltmpl" value="mobile" /><div align="left"><font color="red">  </font></div><div><span class="gaia le lbl">Email:</span></div>
// <div><input type="hidden" name="continue" id="continue" value="https://www.google.com/voice/m" /><input type="hidden" name="service" id="service" value="grandcentral" />
//<input type="hidden" name="dsh" id="dsh" value="1038218064575200280" /><input type="hidden" name="ltmpl" id="ltmpl" value="mobile" />
// <input type="hidden" name="btmpl" id="btmpl" value="mobile" /><input type="hidden" name="ltmpl" id="ltmpl" value="mobile" /></div>
// <input type="hidden" name="timeStmp" id="timeStmp" value=""/><input type="hidden" name="secTok" id="secTok" value=""/>
// <input type="hidden" name="GALX" value="b42PwUUPU7E" /><input type="text" name="Email"  id="Email" size="18" value="" class="gaia le val"  />
// <div align="left"><font color="red"></font></div><div><span class="gaia le lbl">Password:</span></div>
// <input type="password" name="Passwd" id="Passwd" size="18" class="gaia le val" autocomplete="off"  /><div align="left"><font color="red"></font></div><div align="left">
// <input type="checkbox" name="PersistentCookie" id="PersistentCookie" value="yes" checked="checked"/>
// <label for="PersistentCookie" class="gaia le rem">Remember me</label><input type="hidden" name="rmShown" value="1" /></div><div align="left">
// <input type="submit" class="gaia le button" name="signIn" value="Sign in" /></div></form>

/*  ** From the Google Voice javascript itself
+    z1a = zm + "/invite/add",
+    z2a = zm + "/inbox/archiveMessages/",
+    z3a = zm + "/settings/billingcredit/",
+    z4a = zm + "/settings/billingtrans/",
+    z5a = zm + "/inbox/block/",
+    z6a = zm + "/call/connect/",
+    z7a = zm + "/call/cancel/",
+    z8a = zm + "/billing/cancelOrder/",
+    z9a = zm + "/settings/cancelUpgradeClient",
+    z$a = zm + "/settings/chargeUser/",
+    zab = zm + "/settings/checkCarrier/",
+    zbb = zm + "/settings/checkCreditOrder/",
+    zcb = zm + "/settings/checkIllegalSharing",
+    zdb = zm + "/settings/checkForwardingVerified",
+    zeb = zm + "/settings/checkVerifiedNoAccount",
+    zfb = zm + "/setup/checkMobileSetupOptions",
+    zgb = zm + "/settings/checkSpamFilterEnabled",
+    zhb = zm + "/inbox/deleteForeverMessages/",
+    zib = zm + "/settings/deleteForwarding/",
+    zjb = zm + "/inbox/deleteMessages/",
+    zkb = zm + "/inbox/deletenote/",
+    zlb = zm + "/settings/deleteWebCallButton/",
+    zmb = zm + "/settings/getDiversionCode",
+    znb = zm + "/settings/diversionCodeComplete",
+    zob = zm + "/inbox/donate/",
+    zpb = zm + "/billing/editSettings/",
+    zqb = zm + "/settings/editOrg/",
+    zrb = zm + "/contacts/editContact/",
+    zsb = zm + "/settings/editDefaultForwarding/",
+    ztb = zm + "/settings/editForwarding/",
+    zub = zm + "/settings/editForwardingSms/",
+    zvb = zm + "/settings/editGreetings/",
+    zwb = zm + "/settings/editGroup/",
+    zxb = zm + "/settings/editGeneralSettings/",
+    zyb = zm + "/settings/editTranscriptStatus/",
+    zzb = zm + "/settings/editVoicemailSms/",
+    zAb = zm + "/settings/editWebCallButton/",
+    zBb = zm + "/settings/setInVerification",
+    zCb = zm + "/embed/generateEmbedTag",
+    zDb = zm + "/contacts/getContactData/",
+    zEb = zm + "/settings/getDoNotDisturb/",
+    zFb = zm + "/setup/getNormalizedNumber/",
+    zGb = zm + "/help/helpText/",
+    zHb = zm + "/inbox/mark/",
+    zIb = zm + "/setup/searchnew/",
+    zJb = zm + "/porting",
+    zKb = zm + "/settings/purchasenumberchange",
+    zLb = zm + "/setup/purchasevanitynumber",
+    zMb = zm + "/phonebook/quickAdd/",
+    zNb = zm + "/inbox/ratecall/",
+    zOb = zm + "/inbox/rateTranscript/",
+    zPb = zm + "/call/recordGreeting/",
+    zQb = zm + "/call/recordName/",
+    zRb = zm + "/setup/reserve",
+    zSb = zm + "/inbox/restoreTranscript/",
+    zTb = zm + "/inbox/savenote/",
+    zUb = zm + "/inbox/saveTranscript/",
+    zVb = zm + "/inbox/reply/",
+    zWb = zm + "/sms/send/",
+    zXb = zm + "/settings/setDoNotDisturb/",
+    zYb = zm + "/setup/create/",
+    zZb = zm + "/setup/createclientonly/",
+    z_b = zm + "/setup/createvm/",
+    z0b = zm + "/setup/search/",
+    z1b = zm + "/setup/vanitysearch/",
+    z2b = zm + "/inbox/spam/",
+    z3b = zm + "/inbox/star/",
+    z4b = zm + "/setup/undonumberchange",
+    z5b = zm + "/setup/unreserve",
+    z6b = zm + "/settings/upgrade",
+    z7b = zm + "/call/verifyForwarding";
+*/

// /settings/getDoNotDisturb/ GET

// Some of these comments down here are probably not useful, as the information
// they returned had to be scrubbed due to potentially identifying information
// left from the author while he was developing :-)

/*
 Request URL:https://www.google.com/voice/b/0/settings/?v=23882014
Request Method:GET

** DnD timers are set from this page ** (click Your Number, and go from there)
Request URL:https://www.google.com/voice/b/0/settings/tab/phones?v=23882014
Request Method:GET

Request URL:https://www.google.com/voice/b/0/settings/tab/groups?v=23882014
Request Method:GET
  <html><![CDATA[<div id="gc-settings-groups-pane">
  
Request URL:https://www.google.com/voice/b/0/settings/tab/billing?v=23882014
Request Method:GET
  <html><![CDATA[<div id="gc-settings-billing">
  
 */

// /media/sendPhonebookName/+phoneNumber ?
// /inbox/savenote POST id=msgid, _rnr_se=rnr_se, note=note text
// /inbox/deletenote/ POST id=msgid _rnr_se
// /inbox/block/ POST blocked=1/0, id=msgid, _rnr_se
/*
 <json>
 <![CDATA[
    {"messages":
        {"521c44efc111f5e94dc6204e210ebc1dc25e0fd3":
            {"id":"521c44efc111f5e94dc6204e210ebc1dc25e0fd3",
            "phoneNumber":"+17347326045",
            "displayNumber":"(734) 732-6045",
            "startTime":"1332112874997",
            "displayStartDateTime":"3/18/12 7:21 PM",
            "displayStartTime":"7:21 PM",
            "relativeStartTime":"3 minutes ago",
            "note":"TESTNOTETESTNOTE\n","isRead":true,"isSpam":false,"isTrash":false,"star":false,"messageText":"Started with 36d in the big sigh no winner","labels":["inbox","sms","all"],"type":11,"children":""},"e1cbd97247cea7fbaf6bfc2f6065a3c7fa45ec28":{"id":"e1cbd97247cea7fbaf6bfc2f6065a3c7fa45ec28","phoneNumber":"+1288472","displayNumber":"+1288472","startTime":"1332080185141","displayStartDateTime":"3/18/12 10:16 AM","displayStartTime":"10:16 AM","relativeStartTime":"9 hours ago","note":"","isRead":true,"isSpam":false,"isTrash":false,"star":false,"messageText":"Your ADP TotalPay Card ending in 7227 has a balance of: 426.93. Do not respond, msg&data rates may apply","labels":["inbox","sms","all"],"type":10,"children":""},"9b52fece7c6f1af150ea78e4bab0512444f0e3fe":{"id":"9b52fece7c6f1af150ea78e4bab0512444f0e3fe","phoneNumber":"+19852531804","displayNumber":"(985) 253-1804","startTime":"1332045386896","displayStartDateTime":"3/18/12 12:36 AM","displayStartTime":"12:36 AM","relativeStartTime":"18 hours ago","note":"","isRead":true,"isSpam":false,"isTrash":false,"star":false,"messageText":"So why you keep making fun of me?","labels":["inbox","sms","all"],"type":10,"children":""},"6ff5917e0daeb8e60d1c52071a08726ef3a3b11c":{"id":"6ff5917e0daeb8e60d1c52071a08726ef3a3b11c","phoneNumber":"+17347326045","displayNumber":"(734) 732-6045","startTime":"1332015654377","displayStartDateTime":"3/17/12 4:20 PM","displayStartTime":"4:20 PM","relativeStartTime":"27 hours ago","note":"","isRead":true,"isSpam":false,"isTrash":false,"star":false,"messageText":"Can you look and see if there are any uhaul or ryder or budget rental truck/van places open?","labels":["inbox","sms","all"],"type":10,"children":""},"26a90ec14cfad3fdac4969e075e715e1b096e1f3":{"id":"26a90ec14cfad3fdac4969e075e715e1b096e1f3","phoneNumber":"+17346799257","displayNumber":"(734) 679-9257","startTime":"1332010418313","displayStartDateTime":"3/17/12 2:53 PM","displayStartTime":"2:53 PM","relativeStartTime":"28 hours ago","note":"","isRead":true,"isSpam":false,"isTrash":false,"star":false,"messageText":"Happy st. Pattys day..are u drinking beer today","labels":["inbox","sms","all"],"type":10,"children":""},"0e3abaa91bd77003c9a60501533a12ada46f3549":{"id":"0e3abaa91bd77003c9a60501533a12ada46f3549","phoneNumber":"+17079925233","displayNumber":"(707) 992-5233","startTime":"1332002581984","displayStartDateTime":"3/17/12 12:43 PM","displayStartTime":"12:43 PM","relativeStartTime":"30 hours ago","note":"","isRead":true,"isSpam":false,"isTrash":false,"star":false,"messageText":"Test","labels":["inbox","sms","all"],"type":11,"children":""},"aeb47793f92aa8bb1e6587531022dbc0dff58c70":{"id":"aeb47793f92aa8bb1e6587531022dbc0dff58c70","phoneNumber":"+1288472","displayNumber":"+1288472","startTime":"1331993875942","displayStartDateTime":"3/17/12 10:17 AM","displayStartTime":"10:17 AM","relativeStartTime":"33 hours ago","note":"","isRead":true,"isSpam":false,"isTrash":false,"star":false,"messageText":"Your ADP TotalPay Card ending in 7227 has a balance of: 426.93. Do not respond, msg&data rates may apply","labels":["inbox","sms","all"],"type":10,"children":""},"a2b8dbea288e1238d53789b52a59785960bebafd":{"id":"a2b8dbea288e1238d53789b52a59785960bebafd","phoneNumber":"+17347326045","displayNumber":"(734) 732-6045","startTime":"1331966198406","displayStartDateTime":"3/17/12 2:36 AM","displayStartTime":"2:36 AM","relativeStartTime":"40 hours ago","note":"","isRead":true,"isSpam":false,"isTrash":false,"star":false,"messageText":"Ugh. I really hope things pick up, i've only made 49 bucks.","labels":["inbox","sms","all"],"type":10,"children":""},"004368af75434472669624fbe7197996cc80d742":{"id":"004368af75434472669624fbe7197996cc80d742","phoneNumber":"+17346799257","displayNumber":"(734) 679-9257","startTime":"1331948872556","displayStartDateTime":"3/16/12 9:47 PM","displayStartTime":"9:47 PM","relativeStartTime":"45 hours ago","note":"","isRead":true,"isSpam":false,"isTrash":false,"star":false,"messageText":"Goodmorning eric..are u awake?","labels":["inbox","sms","all"],"type":10,"children":""},"3cae2ff4ea6f51970d9a2ea3c7958af09e65cd9d":{"id":"3cae2ff4ea6f51970d9a2ea3c7958af09e65cd9d","phoneNumber":"+19852531804","displayNumber":"(985) 253-1804","startTime":"1331948182756","displayStartDateTime":"3/16/12 9:36 PM","displayStartTime":"9:36 PM","relativeStartTime":"45 hours ago","note":"","isRead":true,"isSpam":false,"isTrash":false,"star":false,"messageText":"Hi, what ya doing?","labels":["inbox","sms","all"],"type":10,"children":""}},"totalSize":93,"unreadCounts":{"all":0,"inbox":0,"missed":0,"placed":0,"received":0,"recorded":0,"sms":0,"spam":0,"starred":0,"trash":0,"unread":0,"voicemail":0},"resultsPerPage":10}]]></json>
*/