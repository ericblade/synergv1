// various utility kinds

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
        { kind: "VirtualRepeater", onSetupRow: "renderItem", accelerated: true, onclick: "repeaterClick", components:
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
        }
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
        //this.log(inSender, ".", inEvent, ".", this.messageId);
        this.doMessageClick(inEvent, this.messageId);
        //inEvent.preventDefault();
        //inEvent.stopPropagation();
    },
    repeaterClick: function(inSender, inEvent)
    {
        //this.log(inSender, ".", inEvent, ".", this.messageId);
        inEvent.preventDefault();
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
