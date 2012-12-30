// various utility kinds

function useAccelerated() {
    if(Platform.isAndroid()) {
        return Platform.version > 2;
    }
    if(Platform.isWebOS()) {
        return Platform.version >= 3;
    }
    return false;
}

enyo.kind({
    name: "StatefulImage",
    kind: "Image",
    published: {
        state: "", // State to set
        stateImages: { } // list of StateName:ImageFilename pairs
    },
    stateChanged: function()
    {
        var x;
        if(x = this.stateImages[this.state]) // yes = is intentional
        {
            this.setSrc(x);
        } else {
            this.log("* Warning: Unknown state", this.state);
        }
    }
});

enyo.kind({
    name: "starImage",
    kind: "StatefulImage",
    stateImages: { "starred": !window.PalmSystem ? "mainApp/images/star.png" : "images/star.png", "unstarred": !window.PalmSystem ? "mainApp/images/unstar.png" : "images/unstar.png" },
    published: {
        "messageId": "",
        "messageIndex": "",
    }
});

enyo.kind({
    name: "noteImage",
    kind: "StatefulImage",
    stateImages: { "noted": !window.PalmSystem ? "mainApp/images/note.png" : "images/note.png", "unnoted": !window.PalmSystem ? "mainApp/images/unnote.png" : "images/unnote.png" },
    published: {
        "messageId": "",
        "messageIndex": "",
    }
})

enyo.kind({
    name: "autoCompleteInput",
    kind: "VFlexBox",
    published: {
        "suggestlist": [ ],
        "numericOnly": true,
        "hint": "",
        "alwaysLooksFocused": false,
        "autoKeyModifier": "",
    },
    suggestions: [ ],
    components: [
        { name: "InputBox", kind: "Input", onkeyup: "keyInput", },
        { name: "AutocompleteBox", kind: "VFlexBox", style: "height: 100px; max-height: 100px;", components:
            [
                { name: "Scroller", kind: "Scroller", flex:1, /*onScroll: "scrolled",*/ components:
                    [
                        { name: "AutocompleteRepeater", kind: "VirtualRepeater", onSetupRow: "getSuggestion", onclick: "rowClicked", components:
                            [
                                { name: "Suggestion", kind: "Item", },
                            ]
                        },
                    ]
                }
            ]
        },
    ],
    create: function()
    {
        this.inherited(arguments);
        this.$.InputBox.setHint(this.hint);
        this.$.InputBox.setAlwaysLooksFocused(this.alwaysLooksFocused);
        this.$.InputBox.setAutoKeyModifier(this.autoKeyModifier);
        //this.$.Scroller.createComponent( { kind: "ScrollFades", name:"fades", isChrome:true, owner:this });
    },
    forceFocus: function() {
        this.$.InputBox.forceFocus();
    },
    forceBlur: function() {
        this.$.InputBox.forceBlur();
    },
    /*scrolled: function(sender) {
        this.$.fades.showHideFades(this.$.Scroller);
    },*/
    keyInput: function(inSender, inEvent)
    {
        if(!Platform.isAndroid()) {
            var str = this.$.InputBox.getValue().toLowerCase();
            this.suggestions = new Array();
            var testcase = str;
            
            if(this.numericOnly)
                testcase = str.replace(/[^0-9]/g, '');
            for (var s in this.suggestlist)
            {
                var suggestiontest = this.suggestlist[s];
                if(this.numericOnly) {
                    suggestiontest = suggestiontest.replace(/[^0-9]/g, '');
                }
                if(suggestiontest.indexOf(testcase) != -1)
                {
                    this.suggestions.push(this.suggestlist[s]);
                }
            }
            if(this.suggestions.length == 0)
                this.$.AutocompleteBox.hide();
            else
                this.$.AutocompleteBox.show();
            this.$.AutocompleteRepeater.render();
        }
        return true;
    },
    getSuggestion: function(inSender, inRow)
    {
        if(this.suggestions[inRow])
        {
            this.$.Suggestion.setContent(this.suggestions[inRow]);
            return true;
        }
        return false;
    },
    getValue: function()
    {
        return this.$.InputBox.getValue();
    },
    setValue: function(str)
    {
        this.$.AutocompleteBox.hide();
        this.$.InputBox.setValue(str);
    },
    rowClicked: function(inSender, inEvent)
    {
        this.setValue(this.suggestions[inEvent.rowIndex]);
    }
});


enyo.kind({
    name: "messageListRepeater",
    kind: "VFlexBox",
    components:
    [
        { kind: "VirtualRepeater", onSetupRow: "renderItemNew", accelerated: useAccelerated(), onclick: "repeaterClick", components:
            [
                { name: "message", kind: "HFlexBox", flex: 1, components:
                    [
                        { name: "listItem", flex: 1, },
                        { name: "timestamp", className: "enyo-item-ternary", style: "padding-left: 5px; padding-right: 5px;" },
                    ]
                }
            ]
        },
        /*{ kind: "VirtualRepeater", onSetupRow: "renderItem", accelerated: useAccelerated(), onclick: "repeaterClick", components:
            [
                { kind: "Control", layoutKind: "VFlexLayout", className: "noborders", onclick: "listClick", components:
                    [
                        { name: "message", kind: "HFlexBox", components:
                            [
                                { name: "timestampleft", kind: "HtmlContent", style: "padding-right: 5px;", allowHtml: false, className: "enyo-item-ternary", showing: false },
                                { name: "listItem", kind: "HtmlContent", flex: 1, allowHtml: true, onLinkClick: "linkClicked", },
                                { name: "timestamp", kind: "HtmlContent", allowHtml: false, style: "padding-left: 5px;", className: "enyo-item-ternary", },
                            ]
                        },
                    ]
                }
            ]
        }*/
    ],
    published: {
        messageId: "",
    },
    events: {
        "onMessageClick": "",
        "onLinkClick": "",
    },
    linkClicked: function(inSender, inUrl, inEvent)
    {
        // TODO: HAX! linkClicked in main app is expecting (sender, url, event), we by calling doLinkClick give it inSender, inEvent, inUrl .. grrr..
        this.doLinkClick(inUrl, inEvent)
        //enyo.application.mainApp.linkClicked(inSender, inUrl, inEvent);
        inEvent.stopPropagation();
    },
    listClick: function(inSender, inEvent)
    {
        this.log(inSender, ".", inEvent, ".", this.messageId);        
        this.doMessageClick(inEvent, this.messageId);
        //inEvent.preventDefault();
        //inEvent.stopPropagation();
    },
    repeaterClick: function(inSender, inEvent)
    {
        this.log(inSender, ".", inEvent, ".", this.messageId);
        inEvent.preventDefault();
    },
    renderItemNew: function(inSender, inRow) {
        var overviewMsg = enyo.application.mainApp ? enyo.application.mainApp.overviewMsg : -1;

        if(overviewMsg == -1) // no messages at all!
        {
            if(inRow == 0)
            {
                //this.$.overviewTitle.hide();
                this.$.listItem.setContent("No messages found in this view.  Send and ye shall receive!");
                return true;
            }
            return false;
        }

        var index = inRow - 1;
        
        if(index == -1)
        {
            this.$.message.hide();
            return true;
        }
        
        var messageIndex = enyo.application.mainApp.MessageIndex[overviewMsg];        
        var title = "";
        var str = "";
        var message = enyo.application.mainApp.Messages && enyo.application.mainApp.Messages[overviewMsg] ? enyo.application.mainApp.Messages[overviewMsg][index] : undefined;
        
        //this.log(overviewMsg);
        //this.log(index);
        //this.log(messageIndex);
        //this.log(message);
        
        if(message)
        {            
            if(prefs.get("smallFonts") === true && !this.$.listItem.hasClass("enyo-item-secondary"))
            {
                this.$.listItem.addClass("enyo-item-secondary");
            }
            if(message.SentBy == "Me:")
            {
                this.$.timestamp.applyStyle("float","left");
                this.$.listItem.applyStyle("display", "inline");
                if(!this.$.message.hasClass("gvoice-inbox-message-self"))
                {
                    this.$.message.addClass("gvoice-inbox-message-self");
                }
            }
            else
            {
                //this.$.timestamp.applyStyle("float","right");
                if(!this.$.message.hasClass("gvoice-inbox-message-alt"))
                {
                    this.$.message.addClass("gvoice-inbox-message-alt");
                }
            }
            
            if(messageIndex.isVoicemail) // TODO: our dumb asses can search "MessageIndex[index].labels" for this such as "missed", "voicemail", etc, rather than parsing the fucking html
            {
                if(message.VoicemailTranscript) {
                    str = message.VoicemailTranscript;
                }
                else {
                    str = "Transcript not available.";
                }
            } else {
                if(message.SentMessage)
                    str = message.SentMessage;
                else
                    str = "Message not available.";
                //str += " (" + message.SentTime + ")";
            }
            if(this.$.timestamp)
                this.$.timestamp.setContent(message.SentTime);
            this.$.listItem.setContent(str);
            return true;
        } else 
        if(index == 0) {
            this.$.listItem.addClass("gvoice-inbox-message-alt");
            this.$.listItem.setContent("No information available");
            return true;
        }
        return false;
    },
    renderItem: function(inSender, inRow) // TODO: reflow this so we aren't returning half a dozen times from it
    {
        var overviewMsg = enyo.application.mainApp ? enyo.application.mainApp.overviewMsg : -1;

        if(overviewMsg == -1) // no messages at all!
        {
            if(inRow == 0)
            {
                //this.$.overviewTitle.hide();
                this.$.listItem.setContent("No messages found in this view.  Send and ye shall receive!");
                return true;
            }
            return false;
        }

        var index = inRow - 1;
        
        if(index == -1)
        {
            return true;
        }
        
        var messageIndex = enyo.application.mainApp.MessageIndex[overviewMsg];        
        var title = "";
        var str = "";
        var message = enyo.application.mainApp.Messages && enyo.application.mainApp.Messages[overviewMsg] ? enyo.application.mainApp.Messages[overviewMsg][index] : undefined;
        
        //this.log(overviewMsg);
        //this.log(index);
        //this.log(messageIndex);
        //this.log(message);
        
        if(message)
        {
            if(prefs.get("smallFonts") === true && !this.$.listItem.hasClass("enyo-item-secondary"))
            {
                this.$.listItem.addClass("enyo-item-secondary");
            }
            if(message.SentBy == "Me:")
            {
                if(!this.$.message.hasClass("gvoice-inbox-message-self"))
                {
                    this.$.message.addClass("gvoice-inbox-message-self");
                }
                this.$.timestamp.setShowing(false);
                this.$.timestampleft.setShowing(true);
                this.$.timestampleft.setContent(message.SentTime);
            }
            else
            {
                if(!this.$.message.hasClass("gvoice-inbox-message-alt"))
                {
                    this.$.message.addClass("gvoice-inbox-message-alt");
                }
            }
            
            if(messageIndex.isVoicemail) // TODO: our dumb asses can search "MessageIndex[index].labels" for this such as "missed", "voicemail", etc, rather than parsing the fucking html
            {
                if(message.VoicemailTranscript) {
                    str = message.VoicemailTranscript;
                }
                else {
                    str = "Transcript not available.";
                }
            } else {
                if(message.SentMessage)
                    str = message.SentMessage;
                else
                    str = "Message not available.";
                if(this.$.timestamp)
                    this.$.timestamp.setContent(message.SentTime);
                //str += " (" + message.SentTime + ")";
            }
            this.$.listItem.setContent(str);
            return true;
        } else 
        if(index == 0) {
            this.$.listItem.addClass("gvoice-inbox-message-alt");
            this.$.listItem.setContent("No information available");
            return true;
        }
        return false;
    },

});

enyo.kind({
    name: "ThreeWaySlidingView",
    kind: "SlidingView",
});

enyo.kind({
    name: "placeCallView",
    kind: "VFlexBox",
    published: {
        phones: "",
        phoneNumber: "",
    },
    events: {
        onCancelCall: "",
        onPlaceCall: ""        
    },
    components: [
        { kind: "HFlexBox", flex: 1, components:
            [
                { kind: "Spacer", },
                { kind: "VFlexBox", components:
                    [
                        //{ kind: "Group", caption: "Call Info", style: "max-width: 480px;", components:
                        //    [
                                { kind: "HFlexBox", components:
                                    [
                                        { content: "To", pack: "center", align: "center", },
                                        { name: "toInput", hint: "Phone Number", kind: "Input" },
                                        { kind: "Button", caption: "<<", onclick: "deleteLastNumber" },
                                    ]
                                },
                        //    ]
                        //},
                        //{ kind: "Group", caption: "Dialpad", style: "max-width: 480px;", components:
                        //    [
                                { kind: "HFlexBox", components:
                                    [
                                        { kind: "Button", flex: 1, content: "1", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "" },
                                                { content: "1" },
                                            ]
                                        },
                                        { kind: "Button", flex: 1, content: "2", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "ABC" },
                                                { content: "2" },
                                            ]
                                        },
                                        { kind: "Button", flex: 1, content: "3", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "DEF" },
                                                { content: "3" },
                                            ]
                                        },
                                    ]
                                },
                                { kind: "HFlexBox", components:
                                    [
                                        { kind: "Button", flex: 1, content: "4", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "GHI" },
                                                { content: "4" },
                                            ]
                                        },
                                        { kind: "Button", flex: 1, content: "5", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "JKL" },
                                                { content: "5" },
                                            ]
                                        },
                                        { kind: "Button", flex: 1, content: "6", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "MNO" },
                                                { content: "6" },
                                            ]
                                        },
                                    ]
                                },
                                { kind: "HFlexBox", components:
                                    [
                                        { kind: "Button", flex: 1, content: "7", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "PQRS" },
                                                { content: "7" },
                                            ]
                                        },
                                        { kind: "Button", flex: 1, content: "8", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "TUV" },
                                                { content: "8" },
                                            ]
                                        },
                                        { kind: "Button", flex: 1, content: "9", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "WXYZ" },
                                                { content: "9" },
                                            ]
                                        },
                                    ]
                                },
                                { kind: "HFlexBox", components:
                                    [
                                        { kind: "Button", flex: 1, content: "*", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "*" },
                                                { content: "" },
                                            ]
                                        },
                                        { kind: "Button", flex: 1, content: "0", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "0" },
                                                { content: "" },
                                            ]
                                        },
                                        { kind: "Button", flex: 1, content: "#", className: "dialpadbutton", onclick: "dialpadClick", components:
                                            [
                                                { content: "#" },
                                                { content: "" },
                                            ]
                                        },
                                    ]
                                },                                
                        //    ]
                        //},
                        { kind: "Group", caption: "Origination Phone", components:
                            [
                                { kind: "HFlexBox", components:
                                    [
                                        { name: "PhoneSelector", kind: "ListSelector", style: "padding-left: 2px; padding-right: 2px;", flex: 1, value: "My Cell", items: [ "Select Phone", "My Cell", "Home", "Work" ] },
                                    ]
                                }
                            ]
                        },
                        { name: "PlaceCallButton", kind: "Button", caption: "Place Call", className: "enyo-button-affirmative", onclick: "placeOrEndCall" },
                    ]
                },
                { kind: "Spacer" },				
            ]
        },
        /*{ kind: "Toolbar", components:
                [
                        { name: "BackButton", icon: "images/new/back_white.png", onclick: "doBack" },
                        { kind: "Spacer" },
                        { name: "RedialButton", caption: "Redial", onclick: "redial", disabled: true },
                        { kind: "Spacer" },
                        { kind: "Control", content: "Call Credit: ", style: "color: white;", },
                        { name: "BillingCreditLabel", caption: "$0.00", onclick: "openBrowser" },
                ]
        },*/
        { name: "BrowserPopup", kind: "ModalDialog", style: "position: fixed; top: 3%; left: 3%; width: 94%; height: 94%;", components:
                [
                        { kind: "PageHeader", components:
                                [
                                        { content: "Click " },
                                        { kind: "Button", caption: "Close Browser", onclick: "closeBrowser", },
                                        { content: "to return to SynerGV" },
                                ]
                        },
                        { content: "If the Purchase page does not open immediately, close this window and click the credit button again.", className: "enyo-item-ternary" },
                        { name: "Browser", style: "height: 580px; width: 100%;", kind: "WebView", url: "https://www.google.com/voice/#billing" },
                ]
        }, 
    ],
    phoneNumberChanged: function() {
            this.$.toInput.setValue(this.phoneNumber);
    },    
    phonesChanged: function() {
        enyo.log("phonesChanged", this.phones);
            var phoneItems = [];
            if(this.phones.length > 0) {
                    for(var x = 0; x < this.phones.length; x++) {
                            phoneItems.push(this.phones[x].name);
                    }
                    this.$.PhoneSelector.setItems(phoneItems);
                    this.$.PhoneSelector.setValue(this.phones[0].name); // TODO: need to save the last selected phone for this account, and restore it
            } else {
                    this.$.PhoneSelector.setItems([ "NO PHONES CONFIGURED!" ]);
                    this.$.PhoneSelector.setValue("NO PHONES CONFIGURED!");
            }
    },
    getPhoneIndexByName: function(str) {
            var phoneItems = [];
            for(var x = 0; x < this.phones.length; x++) {
                    phoneItems.push(this.phones[x].name);
            }
            return phoneItems.indexOf(str);
    },
    phoneNumberChanged: function() {
            this.$.toInput.setValue(this.phoneNumber);
    },
    dialpadClick: function(inSender, inEvent)
    {
        //this.log("dialpadClick", inSender, inEvent);
        //this.doDialpadClick(inSender.content);
	this.$.toInput.setValue(this.$.toInput.getValue() + inSender.content.substring(0,1));
        inEvent.stopPropagation();
        return true;
    },
    deleteLastNumber: function(inSender, inEvent)
    {
            var str = this.$.toInput.getValue();
            this.$.toInput.setValue(str.substring(0, str.length-1));
            inEvent.stopPropagation();
            return true;
    },
    placeOrEndCall: function(inSender, inEvent)
    {
        if(this.onCall)
        {
            //this.$.EndCall.call({ accountId: enyo.application.accountId });
            this.doCancelCall();
            this.$.PlaceCallButton.setCaption("Place Call");
            this.onCall = false;
        } else {
            this.onCall = true;
            //this.$.RedialButton.setDisabled(true);
            var phone = this.getPhoneIndexByName(this.$.PhoneSelector.getValue());
            
            this.lastNumberCalled = this.$.toInput.getValue();
            
            /*this.$.PlaceCall.call({
                accountId: enyo.application.accountId,
                outgoingNumber: this.$.toInput.getValue(),
                forwardingNumber: this.phones[phone].phoneNumber,
                phoneType: this.phones[phone].type
            });*/
            this.doPlaceCall(this.$.toInput.getValue(), this.phones[phone].id);
            this.$.PlaceCallButton.setCaption("End Call"); // yes, keep the multiple settings of it, just so we're sure
        }
        this.$.PlaceCallButton.addRemoveClass("enyo-button-negative", this.onCall);
    },    
});