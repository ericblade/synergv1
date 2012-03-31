enyo.kind(
    { name: "aboutPopup", kind: "Dialog", layoutKind: "VFlexLayout", components:
        [
            { kind: "Scroller", height: Platform.isLargeScreen() ? "570px" : "360px", style: "background-color: #4185D3;", /*width: Platform.isLargeScreen() ? "460px" : "270px", height: "480px", */components:
                [
                    { kind: "VFlexBox", components:
                        [
                            { kind: "HFlexBox", components: 
                                [
                                    { kind: enyo.Image, src: !window.PalmSystem ? "mainApp/images/google-voice-icon48.png" : "images/google-voice-icon48.png" },
                                    { kind: "VFlexBox", pack: "center", components:
                                        [
                                            { name: "NameLabel", content: "GVoice", },
                                            { name: "versionLabel", className: "enyo-item-ternary", style: "color: black;", content: "version 0.9.9" },
                                        ]
                                    }
                                ]
                            },
                            { kind: "Group", caption: "Credits", components:
                                [
                                    { kind: "Item", url: "http://www.ericbla.de/", onclick: "linkClicked", layoutKind: "HFlexLayout", components:
                                        [
                                            { kind: enyo.Image, src: Platform.isLargeScreen() ? (!window.PalmSystem ? "mainApp/images/browser32.png" : "images/browser32.png") : (!window.PalmSystem ? "mainApp/images/browser16.png" : "images/browser16.png") },
                                            { kind: "Spacer" },
                                            { content: "Author: Eric Blade", },
                                            { kind: "Spacer" },
                                        ]
                                    },
                                    { kind: "Item", url: "http://www.iconshock.com/", onclick: "linkClicked", layoutKind: "HFlexLayout", components:
                                        [
                                            { kind: enyo.Image, src: Platform.isLargeScreen() ? (!window.PalmSystem ? "mainApp/images/browser32.png" : "images/browser32.png") : (!window.PalmSystem ? "mainApp/images/browser16.png" : "images/browser16.png") },
                                            { kind: "Spacer" },
                                            { pack: "center", content: "GVoice Logo: iconshock.com" },
                                            { kind: "Spacer" },
                                        ]
                                    },
                                    { kind: "Item", url: "http://www.iconarchive.com/artist/oxygen-icons.org.html", onclick: "linkClicked", layoutKind: "HFlexLayout", components:
                                        [
                                            { kind: enyo.Image, src: Platform.isLargeScreen() ? (!window.PalmSystem ? "mainApp/images/browser32.png" : "images/browser32.png") : (!window.PalmSystem ? "mainApp/images/browser16.png" : "images/browser16.png") },
                                            { kind: "Spacer" },
                                            { content: "Search Icon: Oxygen Team", },
                                            { kind: "Spacer" },
                                        ]
                                    },
                                    { kind: "Item", layoutKind: "HFlexLayout", components:
                                        [
                                            { kind: "Spacer" },
                                            { content: "Other Icons: Asle Høeg-Mikkelsen" },
                                            { kind: "Spacer" },
                                        ]
                                    },
                                ]
                            },
                            { kind: "Group", caption: "Support", components:
                                [
                                    { kind: "Item", url: "http://www.ericbla.de/gvoice-webos", onclick: "linkClicked", layoutKind: "HFlexLayout", components:
                                        [
                                            { kind: enyo.Image, src: Platform.isLargeScreen() ? (!window.PalmSystem ? "mainApp/images/browser32.png" : "images/browser32.png") : (!window.PalmSystem ? "mainApp/images/browser16.png" : "images/browser16.png") },
                                            { kind: "Spacer" },
                                            { content: "GVoice Web Site", },
                                            { kind: "Spacer" },
                                        ]
                                    },
                                    { kind: "Item", url: "mailto:blade.eric@gmail.com", onclick: "linkClicked", layoutKind: "HFlexLayout", components:
                                        [
                                            { kind: enyo.Image, src: Platform.isLargeScreen() ? (!window.PalmSystem ? "mainApp/images/email32.png" : "images/email32.png") : (!window.PalmSystem ? "mainApp/images/email16.png" : "images/email16.png") },
                                            { kind: "Spacer" },
                                            { content: "Support Email", },
                                            { kind: "Spacer" },
                                        ]
                                    },
                                ]
                            },
                            { name: "ReviewLink", kind: "Item", onclick: "linkClicked", url: "review", layoutKind: "HFlexLayout", components:
                                [
                                    { kind: enyo.Image, src: !window.PalmSystem ? "mainApp/images/star.png" : "images/star.png" },                                    
                                    { kind: "Spacer" },
                                    { content: "Review GVoice :) " },
                                    { kind: "Spacer" },
                                ]
                            },
                            { kind: "HFlexBox", components:
                                [
                                    { kind: "Spacer" },
                                    { content: "GVoice and GVoice Pre for webOS (c) 2011-2012 Eric Blade", style: "color: black;", className: "enyo-item-ternary" },
                                    { kind: "Spacer" },
                                ]
                            },
                            { kind: "HFlexBox", components:
                                [
                                    { kind: "Spacer" },
                                    { content: "GVoice for BlackBerry Playbook (c) 2012 Eric Blade", style: "color: black;", className: "enyo-item-ternary" },
                                    { kind: "Spacer" },
                                ]
                            },
                            { kind: "HFlexBox", components:
                                [
                                    { kind: "Spacer" },
                                    { content: "GVoiceA for Android (c) 2012 Eric Blade", style: "color: black;", className: "enyo-item-ternary" },
                                    { kind: "Spacer" },
                                ]
                            },
                            { kind: "Button", caption: "OK", className: "enyo-button-affirmative", onclick: "close", },
                            { kind: "Divider", caption: "" },
                        ]
                    }
                ]
            },
        ],
        linkClicked: function(inSender, inEvent) // TODO: Move this to an event that gets passed down to the main app's link clicker handler thingee
        {
            if(typeof blackberry !== "undefined" && inEvent.cancelable)
                return;
            
            if(inSender.url == "review") {
                inSender.url = Platform.getReviewURL();
            }
            this.log(inSender.url);
            Platform.browser(inSender.url, this)();
            return true;
        },
        open: function()
        {
            var list = [ "top", "bottom", "left", "right" ];
            try {
                var appInfo = JSON.parse(enyo.fetchAppInfo());
            } catch(err) {
                var appInfo = enyo.fetchAppInfo();
            }
            var appver = appInfo ? appInfo["version"] : "0.0.0";
            
            this.flyInFrom = list[Math.floor(Math.random() * (list.length + 1))]
            
            // Set the flyInFrom -before- we call inherited, so it flies in right
            this.inherited(arguments);
            // Set all our properties -after- we call inherited, so that the components that need them are initialized first
            this.$.versionLabel.setContent("version " + appver);
            if(appInfo)
            {
                //this.$.ReviewLink.url = "http://developer.palm.com/appredirect/?packageid=" + appInfo.id;
                this.$.NameLabel.setContent(appInfo.title);
            }
        }
    }
);

enyo.kind(
    { name: "errorDetail", kind: "VFlexBox", allowHtml: false, components:
        [
            { kind: "Scroller", flex: 1, allowHtml: false, components: [
                { name: "ErrorBox", kind: "Control", flex: 1, allowHtml: false, content: " *** Beginning of Debug Log\r\n<BR>", },
            ]},
            { kind: "Button", caption: "Reset Outgoing Queue", onclick: "resetqueue" },
        ],
        resetqueue: function(inSender, inEvent) {
            inEvent.preventDefault();
            inEvent.stopPropagation();
            enyo.application.mainApp.$.outbox.clearqueue();
        }
    }
);

enyo.kind(
    { name: "preferencesPopup", kind: "Dialog", flyInFrom: "left", components:
        [
            { kind: "FadeScroller", height: Platform.isLargeScreen() ? "570px" : "360px",   components:
                [
                    { name: "NotifyOne", kind: "Group", caption: "Notifications", components:
                        [
                            { kind: "Item", layoutKind: "HFlexLayout", components:
                                [
                                    { content: "New Message Notifications", flex: 1, className: "enyo-item-secondary", },
                                    { name: "newMessageNotificationsCheckBox", kind: "CheckBox", },
                                ]
                            },
                            { name: "AlertItem", kind: "Item", layoutKind: "HFlexLayout", components:
                                [
                                    { content: "Alert Tone", flex: 1, },
                                    { name: "AlertPicker", kind: "Picker", value: prefs.get("gvAlertTone"), onChange: "selectAlert",
                                        items: window.PalmSystem ? ["None", "Default", "Anticipation", "Cymbells", "Duclimer", "Flurry", "Rain Dance", "Shimmer", "Subtle", "Triangle", "Vibes"]
                                                                : [ "None", "Default" ] // see ready function for more
                                    },
                                ]
                            },
                        ]
                    },
                    { name: "NotifyTwo", content: "Refresh times less than 5 minutes will only run when GVoice is open (and in foreground on phones). When the app is closed, it will refresh at a 5-minute minimum.",
                        className: "enyo-item-ternary"
                    },
                    { name: "NotifyThree", content: "It is not possible to do push notifications without giving your password to a 3rd party.", className: "enyo-item-ternary" },
                    { kind: "Group", caption: "Foreground Refresh", components:
                        [
                            { name: "fgRefreshSlider", kind: "Slider", style: "padding-left: 5px; padding-right: 5px;", onChanging: "fgSliderChange", onChange: "fgSliderChange", minimum: 1, maximum: 30, position: prefs.get("fgRefresh") },
                            { kind: "HFlexBox", components:
                                [
                                    { kind: "Spacer", },
                                    { name: "fgSliderLabel", kind: "HtmlContent", allowHtml: true, align: "center", content: (prefs.get("fgRefresh") > 0 ? prefs.get("fgRefresh") : 2) + "&nbsp;" + pluralize("minute", prefs.get("fgRefresh")), },
                                    { kind: "Spacer" },
                                ]
                            },
                        ]
                    },
                    { kind: "Group", caption: "Background Refresh", components:
                        [
                            { name: "bgRefreshSlider", kind: "Slider", style: "padding-left: 5px; padding-right: 5px;", onChanging: "bgSliderChange", onChange: "bgSliderChange", minimum: 1, maximum: 30, position: prefs.get("fgRefresh") },
                            { kind: "HFlexBox", components:
                                [
                                    { kind: "Spacer", },
                                    { name: "bgSliderLabel", kind: "HtmlContent", allowHtml: true, align: "center", content: (prefs.get("bgRefresh") > 0 ? prefs.get("bgRefresh") : 2) + "&nbsp;" + pluralize("minute", prefs.get("bfRefresh")), },
                                    { kind: "Spacer" },
                                ]
                            },
                        ]
                    },
                    { name: "TTSGroup", kind: "Group", caption: "Text-to-Speech", components:
                        [
                            { kind: "VFlexBox", components:
                                [
                                    { kind: "Item", layoutKind: "HFlexLayout", align: "center", components:
                                        [
                                            { content: "Globally Disabled ", flex: 1, },
                                            { name: "ttsCheckBox", kind: "CheckBox", }
                                        ]
                                    },
                                    { kind: "Item", layoutKind: "HFlexLayout", align: "center", components:
                                        [
                                            { content: "Notifications Disabled ", flex: 1, },
                                            { name: "ttsNotificationsCheckBox", kind: "CheckBox", }
                                        ]
                                    },
                                    { kind: "Item", layoutKind: "HFlexLayout", align: "center", components:
                                        [
                                            { content: "Announce Names/Numbers ", flex: 1, className: "enyo-item-secondary", },
                                            { name: "ttsNameCheckBox", kind: "CheckBox", },
                                        ]
                                    },
                                    { kind: "Item", layoutKind: "HFlexLayout", align: "center", components:
                                        [
                                            { content: "Announce Message Content ", flex: 1, className: "enyo-item-secondary", },
                                            { name: "ttsMessageCheckBox", kind: "CheckBox", },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    { kind: "Group", flex: 1, caption: "Display", components:
                        [
                            { kind: "Item", layoutKind: "HFlexLayout", components:
                                [
                                    { content: "Use Small Fonts", flex: 1, },
                                    { name: "smallFontsCheckBox", kind: "CheckBox", onclick: "NotifyRestart" },
                                ]
                            }
                        ]
                    },
                    { kind: "Group", flex: 1, caption: "Input", components:
                        [
                            { kind: "Item", layoutKind: "HFlexLayout", components:
                                [
                                    { content: "Enter sends message", flex: 1, },
                                    { name: "enterSendCheckBox", kind: "CheckBox" },
                                ]
                            }
                        ]
                    },
                    { name: "RestartNotifier", kind: "TimedNotification", msg: "Restart GVoice for changes to take effect.", lazy: false },
                    { kind: "Button", caption: "OK", className: "enyo-button-affirmative", onclick: "close" },
                    { kind: "Divider", caption: "" }
                ]
            }
        ],        
        events: { "onPrefsChanged": ""},

        finishOpen: function()
        {
            this.renderOpen();
            this.showHideScrim(this.isOpen);
        },
        ready: function()
        {
            this.inherited(arguments);
        },
        selectAlert: function(inSender)
        {
            prefs.set("gvAlertTone", this.$.AlertPicker.getValue());
            enyo.error("gvAlertTone=", this.$.AlertPicker.getValue());
            if(enyo.application.launcher)
            {
                enyo.application.launcher.playAlertSound();
            }
        },
        fgSliderChange: function()
        {
            prefs.set("fgRefresh", this.$.fgRefreshSlider.getPosition());
            this.$.fgSliderLabel.setContent(prefs.get("fgRefresh") + "&nbsp;" + pluralize("minute", prefs.get("fgRefresh")));
        },
        bgSliderChange: function()
        {
            prefs.set("bgRefresh", this.$.bgRefreshSlider.getPosition());
            this.$.bgSliderLabel.setContent(prefs.get("bgRefresh") + "&nbsp;" + pluralize("minute", prefs.get("bgRefresh")));
        },
        NotifyRestart: function() {
            this.$.RestartNotifier.open();
        },
        afterOpen: function()
        {
            this.inherited(arguments);
            
            var alerts = this.$.AlertPicker.items;
            for(var x in alerts)
            {
                if(alerts[x] == "BeepBeep-De-Beep")
                {
                    break;
                } else {
                    x = undefined;
                }
            }
            if(!x)
            {
                alerts.push("BeepBeep-De-Beep");
                alerts.push("DingDong");
                alerts.push("Modem_Sound");
                alerts.push("Sparrow");
                this.$.AlertPicker.setItems(alerts);
            }
            
            //enyo.application.debuglog("prefs: fgRefresh=" + localStorage["fgRefresh"] + " bgRefresh=" + localStorage["bgRefresh"]);
            //this.log("prefs: fgRefresh=" + localStorage["fgRefresh"] + " bgRefresh=" + localStorage["bgRefresh"]);
            //this.log(localStorage["ttsdisable"], localStorage["ttsNotificationDisable"], localStorage["ttsAnnounceName"]);

            //this.log(prefs.get("ttsdisable"), prefs.get("smallFonts"));
            
            //this.log("sliders", prefs.get("fgRefresh"), prefs.get("bgRefresh"));
            var ai = enyo.fetchAppInfo();
            if(enyo.isString(ai))
                ai = JSON.parse(ai);
            
            if( (ai && !ai["plug-ins"]) || !enyo.application.mainApp.ttsPluginReady)
                this.$.TTSGroup.hide();
                
            if(!Platform.isWebOS())
            {
                if(!window.webkitNotifications && !window.plugins && !window.plugins.localNotification)
                {
                    this.$.NotifyOne.hide();
                }
                if(Platform.isAndroid()) {
                    this.$.AlertItem.hide();
                }
                this.$.NotifyTwo.hide();
                this.$.NotifyThree.hide();
            }
            this.$.fgRefreshSlider.setPosition(prefs.get("fgRefresh"));
            this.$.bgRefreshSlider.setPosition(prefs.get("bgRefresh"));
            this.$.ttsCheckBox.setChecked(prefs.get("ttsdisable") == 1);
            this.log("newMessageNotifyDisable == ", prefs.get("newMessageNotifyDisable"));
            this.$.newMessageNotificationsCheckBox.setChecked(prefs.get("newMessageNotifyDisable") == 0);
            this.$.ttsNotificationsCheckBox.setChecked(prefs.get("ttsNotificationDisable") == 1);
            this.$.ttsNameCheckBox.setChecked(prefs.get("ttsAnnounceName") == 1);
            this.$.ttsMessageCheckBox.setChecked(prefs.get("ttsAnnounceMessages") == 1);
            this.$.smallFontsCheckBox.setChecked(prefs.get("smallFonts") == 1);
            this.$.enterSendCheckBox.setChecked(prefs.get("enterSends") == 1);
        },
        close: function()
        {
            this.inherited(arguments);

            if(this.$.fgRefreshSlider)
            {
                prefs.set("fgRefresh", this.$.fgRefreshSlider.getPosition());
                prefs.set("bgRefresh", this.$.bgRefreshSlider.getPosition());
                prefs.set("ttsdisable", this.$.ttsCheckBox.checked ? 1 : 0);
                prefs.set("ttsNotificationDisable", this.$.ttsNotificationsCheckBox.checked ? 1 : 0);
                prefs.set("ttsAnnounceName", this.$.ttsNameCheckBox.checked ? 1 : 0);
                prefs.set("ttsAnnounceMessages", this.$.ttsMessageCheckBox.checked ? 1 : 0);
                prefs.set("smallFonts", this.$.smallFontsCheckBox.checked ? 1 : 0);
                prefs.set("newMessageNotifyDisable", this.$.newMessageNotificationsCheckBox.checked ? 0 : 1);
                prefs.set("enterSends", this.$.enterSendCheckBox.checked ? 1 : 0);
                    
                this.doPrefsChanged();
                            this.log("newMessageNotifyDisable == ", prefs.get("newMessageNotifyDisable"));

            }
        }
    }
);

// TODO: rewrite this stupid thing
enyo.kind( 
        { name: "LoginPopup", kind: "Popup", modal: true, dismissWithClick: false, components:
            [
                // Where you enter username and password from
                { name: "LoginBox", kind: "RowGroup", className: "input-group", caption: "Google Voice Login", components:
                    [
                        { content: "Username", className: "login-box-caption", },
                        { name: "Username", kind: "Input", className: "login-input", autoCapitalize: "lowercase", autoWordComplete: false, spellcheck: false, autocorrect: false },
                        { content: "Password", className: "login-box-caption", },
                        { name: "Password", kind: "PasswordInput", className: "login-input", selectAllOnFocus: true },
                        { name: "LoginButton", kind: "Button", className: "login-button", caption: "Login", onclick: "loginClick" }
                    ],
                },                      
            ],
            afterOpen: function()
            {
                var u = prefs.get("gvUsername");
                var p = prefs.get("gvPassword");
                this.inherited(arguments);
                enyo.log("u=", u, "p=", p);
                //enyo.log("SCREEN SIZE " + window.screen.availHeight + "x" + window.screen.availWidth);
                if(u && u != "undefined")
                    this.$.Username.setValue(u);
                if(p && p != "undefined")
                    this.$.Password.setValue(p);
                this.$.LoginButton.setDisabled(false);
            },
            loginClick: function() {
                if(this.$.LoginButton)
                    this.$.LoginButton.setDisabled(true);
                enyo.application.api.beginLogin(this.$.Username.getValue(), this.$.Password.getValue());
            },
            loggingIn: function() {
                if(this.$.LoginButton)
                    this.$.LoginButton.setCaption("Logging In...");
            },
            loginReceived: function() {
                if(this.$.LoginButton)
                {
                    this.$.LoginButton.setDisabled(false);
                    this.$.LoginButton.setCaption("Login");
                }
            },
            loginFailed: function(str) {
                var u = prefs.get("gvUsername");
                if(this.$.LoginButton && u && u != "")
                {
                    this.$.LoginButton.setCaption("Login Failed");
                    this.$.LoginButton.setDisabled(false);
                }
            },
            close: function()
            {
                this.inherited(arguments);
                if(this.$.Username) this.$.Username.setValue("");
                if(this.$.Password) this.$.Password.setValue("");
            }
        });

enyo.kind({
    name: "gvoice.dialpad",
    kind: "Group",
    events: {
        "onDialpadClick":"",
    },
    components: [
        { kind: "HFlexBox", components:
            [
                { kind: "Button", flex: 1, caption: "1", onclick: "dialpadClick" },
                { kind: "Button", flex: 1, caption: "2 ABC", onclick: "dialpadClick"  },
                { kind: "Button", flex: 1, caption: "3 DEF", onclick: "dialpadClick"  },
            ]
        },
        { kind: "HFlexBox", components:
            [
                { kind: "Button", flex: 1, caption: "4 GHI", onclick: "dialpadClick"  },
                { kind: "Button", flex: 1, caption: "5 JKL", onclick: "dialpadClick"  },
                { kind: "Button", flex: 1, caption: "6 MNO", onclick: "dialpadClick"  },
            ]
        },
        { kind: "HFlexBox", components:
            [
                { kind: "Button", flex: 1, caption: "7 PQRS", onclick: "dialpadClick"  },
                { kind: "Button", flex: 1, caption: "8 TUV", onclick: "dialpadClick"  },
                { kind: "Button", flex: 1, caption: "9 WXYZ", onclick: "dialpadClick"  },
            ]
        },
        { kind: "HFlexBox", components:
            [
                { kind: "Button", flex: 1, caption: "*", onclick: "dialpadClick"  },
                { kind: "Button", flex: 1, caption: "0", onclick: "dialpadClick"  },
                { kind: "Button", flex: 1, caption: "#", onclick: "dialpadClick"  },
            ]
        }        
    ],
    dialpadClick: function(inSender, inEvent)
    {
        this.log(inSender, inEvent);
        this.doDialpadClick(inSender.content.substring(0, 1));
        inEvent.stopPropagation();
        return true;
    }
});

enyo.kind(
        { name: "composePopup", kind: "Dialog", dismissWithClick: false, components:
            [
                { name: "composeBox", kind: "Group", className: "input-group-sms", caption: "Compose SMS Text Message", components:
                    [
                        { kind: "HFlexBox", components:
                            [
                                { content: "To", className: "login-box-caption", },
                                //{ name: "recipientInput", kind: "Input", className: "login-input" },
                                { name: "recipientInput", flex: 1, className: "login-input", onfocus: "showDialpad", alwaysLooksFocused: true, autoKeyModifier: "num-lock", kind: "autoCompleteInput", hint: "Enter Receipient"/*className: "login-input"*/ },
                                { kind: "Button", caption: "<<", onclick: "deleteLastNumber" },
                            ]
                        },
                        { name: "sendMessageCaption", content: "Message", className: "login-box-caption", },
                        { name: "messageInput", onfocus: "hideDialpad", oninput: "messageInput", alwaysLooksFocused: true, hint: "Enter Message", className: "login-input", kind: "Input", onkeypress: "messageInputKeypress", onkeyup: "messageInputKeypress" },
                        { layoutKind: "HFlexLayout", components:
                            [
                                { kind: "Spacer", },
                                { name: "composeSendButton",className: "enyo-button-affirmative", kind: "Button", caption: "Send", onclick: "sendComposedMessage" },
                                { name: "composeCancelButton",className: "enyo-button-negative", kind: "Button", caption: "Cancel", onclick: "closeComposePopup" },
                                { kind: "Spacer", },
                            ]
                        }
                    ]
                },
                { name: "dialpad", kind: "gvoice.dialpad", flex: 1, onDialpadClick: "addNumber", showing: false },                
            ],
            showDialpad: function() {
                this.log();
                if(!Platform.isLargeScreen() && window.PalmSystem) // no dialpad on touchpad.. // TODO: need to figure out how to properly set this up for landscape on phones too .. sigh
                    this.$.dialpad.show();
            },
            hideDialpad: function() {
                this.log();
                this.$.dialpad.hide();
            },
            addNumber: function(inSender, str)
            {
                this.log(str);
                // TODO: see if we can figure out how to insert where the caret might be
                this.$.recipientInput.setValue(this.$.recipientInput.getValue() + str);
            },
            deleteLastNumber: function(inSender, inEvent)
            {
                var str = this.$.recipientInput.getValue();
                this.$.recipientInput.setValue(str.substring(0, str.length-1));
                inEvent.stopPropagation();
                return true;
            },
            sendComposedMessage: function(inSender, inEvent)
            {
                enyo.application.mainApp.sendSMSMessage(this.$.recipientInput.getValue(), this.$.messageInput.getValue());
                this.closeComposePopup();
            },
            messageInputKeypress: function(inSender, inEvent)
            {
                if(inEvent && inEvent.keyCode == 13 && prefs.get("enterSends") == 1)
                    this.sendComposedMessage();
                return true;
            },
            messageInput: function(inSender, inEvent)
            {
                this.$.sendMessageCaption.setContent("Message (" + this.$.messageInput.getValue().length + "/160)");  
            },            
            open: function(rcpt, msg)
            {
                if(msg === undefined) msg = "";
                if(rcpt === undefined) rcpt = "";
                this.inherited(arguments);
                this.$.recipientInput.setSuggestlist(enyo.application.mainApp.AutoCompleteNumbers);
                this.$.recipientInput.setValue(rcpt);
                this.$.messageInput.setValue(msg);
                this.messageInput();
                if(rcpt)
                    this.$.messageInput.forceFocus();
                else
                    this.$.recipientInput.forceFocus();
            },
            closeComposePopup: function()
            {
                this.close();
            }

        }
    );

enyo.kind( {
    name: "quickInput",
    //kind: "RichText",
    kind: "ToolInput",
    //kind: "Input", 
    events: {
        "onSubmit":"",
    },
});

enyo.kind({
    name: "contactAddPopup", kind: "Dialog", flyInFrom: "bottom", //modal: true, dismissWithClick: false,
    events: {
        "onAddContact":"",
    },
    published: {
        "number":"",
    },
    components:
        [
            { name: "addContactBox", kind: "Group", className: "input-group-sms", caption: "Quick-Add Contact", components:
                [
                    { content: "Name", className: "login-box-caption", },
                    { name: "contactName", kind: "Input", hint: "Enter Name", className: "login-input" },
                    { content: "Number", className: "login-box-caption", },
                    { name: "contactNumber", kind: "Input", hint: "Enter Number", className: "login-input", autoKeyModifier: "num-lock", },
                    { content: "Phone Type", className: "login-box-caption", },
                    { name: "phonePicker", kind: "Picker", value: "Home", onChange: "phoneSelect", items: [ "Home", "Mobile", "Work"] },
                    { layoutKind: "HFlexLayout", components:
                        [
                            { kind: "Spacer", },
                            { name: "contactAddButton", className: "enyo-button-affirmative", kind: "Button", caption: "Add Contact", onclick: "addContact" },
                            { name: "contactCancelButton", className: "enyo-button-negative", kind: "Button", caption: "Cancel", onclick: "cancelContact" },
                            { kind: "Spacer", },
                        ]
                    }
                ]
            }
        ],
        open: function()
        {
            this.inherited(arguments);
            this.$.contactName.setValue("");
            this.$.contactNumber.setValue(this.number);
        },
        cancelContact: function()
        {
            this.close();
        },
        addContact: function()
        {
            this.log();
            this.doAddContact(this.$.contactName.getValue(), this.$.contactNumber.getValue(), this.$.phonePicker.getValue());
        }
});

enyo.kind(
        { name: "placeCallPopup", kind: "Dialog", modal: true, dismissWithClick: false, components:
            [
                { name: "placeCallBox", kind: "Group", className: "input-group-sms", caption: "Place outgoing call", components:
                    [
                        { kind: "HFlexBox", components:
                            [
                                { name: "billingCreditAmt", pack: "center", flex: 1, content: "Billing Credit: ", onclick: "buyCredit", },
                                { kind: "Button", caption: "Buy Credit", onclick: "buyCredit", }
                            ]
                        },
                        { kind: "HFlexBox", components:
                            [
                                { content: "To", className: "login-box-caption", },
                                { name: "callToNumber", flex: 1, kind: "autoCompleteInput", onfocus: "showDialpad", autoKeyModifier: "num-lock", className: "login-input" },
                                { kind: "Button", caption: "<<", onclick: "deleteLastNumber" },
                            ]
                        },
                        { content: "From Phone", className: "login-box-caption", },
                        { name: "phonePicker", kind: "Picker", value: "Telephone", onfocus: "hideDialpad", onChange: "phoneSelect", items: ["Telephone"], showing: false },
                        { layoutKind: "HFlexLayout", components:
                            [
                                { kind: "Spacer", },
                                { name: "callSendButton", className: "enyo-button-affirmative", kind: "Button", caption: "Place Call", onclick: "placeOutgoingCall" },
                                { name: "callCancelButton", className: "enyo-button-negative", kind: "Button", caption: "Cancel", onclick: "cancelOutgoingCall" },
                                { kind: "Spacer", },
                            ]
                        },
                        { name: "BuyCreditPopup", kind: "Popup", modal: true, dismissWithClick: false, components:
                            [
                                { content: "Redirecting to Google Voice website. Press OK after purchasing credit." },
                                { kind: "Button", caption: "OK", onclick: "creditPurchased", },
                            ]
                        }
                    ]
                },
                { name: "dialpad", kind: "gvoice.dialpad", flex: 1, onDialpadClick: "addNumber", showing: false, },
            ],
            events: {
                onCreditPurchased: "",
                onPlaceCall: "",
                onCancelCall: "",
            },
            showDialpad: function() {
                if(!Platform.isLargeScreen())
                    this.$.dialpad.show();
            },
            hideDialpad: function() {
                this.$.dialpad.hide();
            },
            addNumber: function(inSender, str)
            {
                this.$.callToNumber.setValue(this.$.callToNumber.getValue() + str)
            },
            deleteLastNumber: function(inSender, inEvent)
            {
                var str = this.$.callToNumber.getValue();
                this.$.callToNumber.setValue(str.substring(0, str.length-1));
                inEvent.stopPropagation();
                return true;
            },
            buyCredit: function()
            {
                this.$.BuyCreditPopup.openAtCenter();
                Platform.browser("https://www.google.com/voice/b/0#billing?ui=desktop", this)();
            },
            creditPurchased: function() {
                this.doCreditPurchased(this.$.callToNumber.getValue()); // pass it back the number to re-open the call box to
                this.$.BuyCreditPopup.close();
                this.close();
            },
            cancelOutgoingCall: function()
            {
                this.doCancelCall();
                this.close();
            },
            placeOutgoingCall: function()
            {
                this.doPlaceCall(this.$.callToNumber.getValue(), this.selectedPhone);
                this.$.callSendButton.setDisabled(true);
            },
            phoneSelect: function(inSender, inValue)
            {
                var phones = enyo.application.mainApp.getPhones();
                this.log(inSender +" " + inValue);
                for(id in phones)
                {
                    if(phones[id].name == inValue)
                    {
                        this.selectedPhone = id;
                        break;
                    }
                }
                enyo.application.mainApp.selectPhone(this.selectedPhone);
            },

            render: function()
            {
                this.inherited(arguments);
                var cred = enyo.application.mainApp.getBillingCredit().formattedCredit;
                if(cred)
                    this.$.billingCreditAmt.setContent("Billing Credit: " + cred);
                else
                    this.$.billingCreditAmt.setContent("Billing Credit: $0.00");

                var PickerList = [];
                var phones = enyo.application.mainApp.getPhones();
                
                this.selectedPhone = enyo.application.mainApp.selectedPhone;
                
                for(id in phones)
                {
                    if(!this.selectedPhone) {
                        this.selectedPhone = id;
                        enyo.application.mainApp.selectedPhone = id;
                    }
                    PickerList.push(phones[id].name);
                }
                
                this.$.phonePicker.setItems(PickerList);
                this.$.phonePicker.show();
                
                if(!phones || phones.length == 0) {
                    enyo.log("PHONES NOT CONFIGURED?? ", phones);
                    this.$.phonePicker.setItems( [ "Phone Not Configured" ]);
                    this.$.phonePicker.setValue( "Phone Not Configured" );
                } else {
                    if(phones[this.selectedPhone])
                        this.$.phonePicker.setValue(phones[this.selectedPhone].name);
                }
                this.$.callSendButton.setDisabled(false);
                this.$.callCancelButton.setCaption("Cancel");                
            },
            open: function(rcpt)
            {
                this.inherited(arguments);
                this.$.callSendButton.setDisabled(false);
                this.$.callToNumber.setSuggestlist(enyo.application.mainApp.AutoCompleteNumbers);
                this.$.callToNumber.setValue(rcpt);
            }
        }
    );

enyo.kind(
        {
            name: "deletePopup", kind: "Popup", modal: true, dismissWithClick: false,
            published: {
                "messageIndex":"",
            },
            components:
                [
                    { content: "Delete Conversation - Are you sure?" },
                    { layoutKind: "HFlexLayout", style: "padding-bottom: 24px; padding-top: 24px;",components:
                        [
                            { name: "PermanentCheckBox", kind: "CheckBox", },
                            { content: "Delete Permanently", },
                        ]
                    },
                    { layoutKind: "HFlexLayout", components:
                        [
                            { name: "deleteConfirmButton", className: "enyo-button-affirmative", kind: "Button", caption: "Delete", onclick: "deleteConfirmed" },
                            { name: "deleteCancelButton", className: "enyo-button-negative", kind: "Button", caption: "Cancel", onclick: "deleteCancelled" },
                        ]
                    }
                ],
            open: function()
            {
                this.inherited(arguments);
                this.$.PermanentCheckBox.setChecked(this.messageIndex.isTrash);
            },
            deleteConfirmed: function()
            {
                enyo.application.mainApp.deleteConfirmed(arguments, this.$.PermanentCheckBox.checked);
            },
            deleteCancelled: function()
            {
                this.close();    
            }
        }
    );

enyo.kind(
        { name: "contactsPopup", kind: "Popup", modal: false, dismissWithClick: true, components:
            [
                { name: "contactList", kind: "VirtualList", onSetupRow: "getContactsListItem", width: "450px", height: "450px", components:
                    [
                        { name: "contactDivider", kind: "Divider" },
                        //{ kind: "Item", components:
                        //    [
                                { name: "contactInfoBox", kind: "VFlexBox", components:
                                    [
                                        //{ name: "contactInfoItem", allowHtml: true, onclick: "contactClicked", flex: 1 },
                                    ]
                                }
                        //    ]
                        //}
                    ]
                }
            ],
            render: function()
            {
                this.inherited(arguments);
            },
            contactClicked: function(inSender, inEvent)
            {
                var index = inEvent.rowIndex;
                var contact = enyo.application.mainApp.getContacts(index);
                enyo.application.mainApp.linkClicked(inSender, "tel:"+contact.numbers[0].displayNumber, inEvent);
            },
            getContactsListItem: function(inSender, inIndex)
            {
                //var contact = enyo.application.mainApp.getContacts(inIndex);
                var contact = enyo.application.mainApp.PrimaryData.contacts[enyo.application.mainApp.PrimaryData.rankedContacts[inIndex]];
                var numberstr = "";
                
        //        this.log(inSender, inIndex, contact);
                if(!contact) {
        //            this.log("No contact info");
                    if(inIndex == 0) {
                        this.$.contactDivider.setCaption("No Contacts");
                        this.$.contactInfoItem.setContent("No contacts available, or contact information is still being received.");
                        //this.$.contactInfoItem.setContent("No contacts available, or contact information has not yet been received");
                        return true;
                    }
                }
                if(!contact) return false;
                
                this.$.contactDivider.setCaption(contact.name + " " + contact.displayNumber);
                for(num in contact.numbers)
                {
                    var comp = this.$.contactInfoBox.createComponent( { kind: "HtmlContent", allowHtml: true, onclick: "contactClicked", flex: 1 } );
                    var phoneType = contact.numbers[num].phoneType ? contact.numbers[num].phoneType : "Other";
                    comp.setContent( enyo.cap(phoneType) + " : " + contact.numbers[num].displayNumber );
                    //numberstr += enyo.cap(phoneType) + " : " + contact.numbers[num].displayNumber; // TODO: apply join principle here? maybe.                    
                }
                //if(contact.photoUrl)
                //    numberstr = '<img src="https://www.google.com' + contact.photoUrl + '">' + numberstr;
                //this.$.contactInfoItem.setContent(numberstr);
                return true;
            },
        }
    );

enyo.kind(
        { name: "phonePopupMenu", kind: "Menu", components:
            [
                { name: "phonePopupTitle", caption: "Phone", disabled: true },
                { caption: "Voice Call", onclick: "popupCallClicked" },
                { caption: "Send Text", onclick: "popupTextClicked" },
            ],
            setTitle: function(x)
            {
                this.$.phonePopupTitle.setCaption(formatPhoneNumber(x));
            },
            popupCallClicked: function()
            {
                enyo.application.mainApp.popupCallClicked(arguments);
            },
            popupTextClicked: function()
            {
                enyo.application.mainApp.popupTextClicked(arguments);
            }
        }
    );

enyo.kind(
    { name: "emailPopupMenu", kind: "Menu", components:
        [
            { caption: "Send Email", onclick: "sendEmail" },
        ],
        events: {
            "onSendSelected":"",
        },
        sendEmail: function()
        {
            this.doSendSelected();
        }
    }
);

enyo.kind(
    {
        name: "actionsMenu", kind: "Menu", components:
        [
            { caption: "Reply", onclick: "doReply", },
            { caption: "Call", onclick: "doCall", },
            { caption: "Delete", onclick: "doDelete", },
            { name: "ArchiveButton", caption: "Archive", onclick: "doArchive", },
            { name: "ListenButton", caption: "Listen", onclick: "doVoicemail", },
            { name: "AddContact", caption: "Add Contact", onclick: "doAddContact", },
            { name: "BlockUnblock", caption: "Block", onclick: "doBlockUnblock", },
        ],
        published: {
            messageIndex:"",
            contact:"",
            number:"",
        },        
        events: {
            "onReply":"",
            "onCall":"",
            "onDelete":"",
            "onArchive":"",
            "onVoicemail":"",
            "onAddContact":"",
            "onBlockUnblock":"",
        },
        open: function()
        {
            this.inherited(arguments);
            var di = enyo.fetchDeviceInfo();
            //var vmAvail = enyo.application.mainApp.Online && di && di["platformVersionMajor"] > 1;
            var vmAvail = (Platform.isWebOS() && Platform.platformVersion >= 2) ||
                          (Platform.isBlackBerry()) ||
                          (Platform.isAndroid());
            /*if(vmAvail)
            {
                var ai = enyo.fetchAppInfo();
                if(enyo.isString(ai))
                    ai = JSON.parse(ai);
                vmAvail = vmAvail && (ai["id"] != "com.ericblade.gvoicepre");
            }*/
            this.$.ListenButton.setDisabled(!vmAvail || !this.messageIndex.isVoicemail);
            if(!vmAvail)
                this.$.ListenButton.hide();
            this.$.ArchiveButton.setDisabled(enyo.application.mainApp.$.boxPicker.getValue() != "Inbox"); // disable it if we're not looking at the inbox since we can't tell if it's in the inbox otherwise
            if(vmAvail)
            {
                if(!this.$.ListenButton.showing)
                    this.$.ListenButton.show();
            } else {
                //if(this.$.ListenButton.showing)
                //    this.$.ListenButton.hide();
            }
            this.$.AddContact.setDisabled(this.contact != undefined);
            this.$.BlockUnblock.setCaption(this.messageIndex.isBlockedCaller ? "Unblock" : "Block");
            
            this.$.ListenButton.addRemoveClass("itemmenu-disabled", this.$.ListenButton.disabled);
            this.$.AddContact.addRemoveClass("itemmenu-disabled", this.$.AddContact.disabled);
            //this.log(this.messageIndex);
        },
    }
);

enyo.kind({
    name: "ConfirmDialog",
    kind: "Dialog",
    flyInFrom: "bottom",
    published: {
        msg: "",
        okcaption: "OK",
        cancelcaption: "Cancel",
    },
    events: {
        onConfirm: "",
    },
    components:
        [
            { kind: "VFlexBox", components:
                [
                    { name: "client", kind: "HtmlContent", content: "" },
                    { layoutKind: "HFlexLayout", pack: "center", components:
                        [
                            { name: "OKButton", kind: "Button", className: "enyo-button-affirmative", caption: "OK", onclick: "doConfirm" },
                            { name: "CancelButton", kind: "Button", className: "enyo-button-negative", caption: "Cancel", onclick: "close" },
                        ]
                    },
                ]
            }
        ],
    render: function() {
        this.inherited(arguments);
        this.$.client.setContent(this.msg);
        this.$.OKButton.setCaption(this.okcaption);
        this.$.CancelButton.setCaption(this.cancelcaption);
    },
    msgChanged: function()
    {
        this.$.client.setContent(msg);
    },
    okcaptionChanged: function()
    {
        this.$.OKButton.setCaption(this.okcaption);
    },
    cancelcaptionChanged: function()
    {
        this.$.CancelButton.setCaption(this.cancelcaption);
    }
});

// TODO: This doesn't work right.  The timer doesn't seem to work (or maybe calling "close" on it doesn't), and it shows up with no styling at all, transparent background over the bottom left corner of the display.
enyo.kind({
    name: "TimedNotification",
    kind: "Toaster",
    flyInFrom: "bottom",
    published: {
        msg: "",
    },
    components:
        [
            { kind: "VFlexBox", align: "center", components:
                [                
                    { name: "client", kind: "HtmlContent", content: "" },
                ]
            }
        ],
    render: function() {
        this.inherited(arguments);
        this.$.client.setContent(this.msg);
    },
    open: function() {
        this.inherited(arguments);
        setTimeout(this.close, 2000);
    },
    msgChanged: function() {
        this.$.client.setContent(msg);
    }
})

enyo.kind({
    name: "NotePopup",
    kind: "Popup",
    events: {
        onNoteSaved: ""
    },
    published: {
        messageIndex: "",
        messageId: "",
        note: ""
    },
    components: [
        { name: "NoteText", kind: window.PalmSystem ? "RichText" : "Textarea", value: "Note", className: "noteInput", onchange: "contentChanged" },
    ],
    noteChanged: function() {
        this.$.NoteText.setValue(this.note);
    },
    contentChanged: function() {
        //enyo.log("Note edited, new content: ", this.$.NoteText.getValue());
        this.doNoteSaved(this.messageIndex, this.$.NoteText.getValue());
    }
});