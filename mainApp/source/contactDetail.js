enyo.kind(
    {
        name: "contactDetail",
        kind: "VFlexBox",
        events: {
            "onPhoneSelected":"",
            "onEmailSelected":"",
        },
        components:
            [
                { kind: "Scroller", flex: 1, autoHorizontal: true, horizontal: false, vertical: true, autoVertical: true, accelerated: useAccelerated(), components:
                    [
                        { name: "list", kind: "VirtualRepeater", flex: 1, onSetupRow: "getListItem", onclick: "selected", accelerated: useAccelerated(), components:
                            [
                                //{ kind: "Divider", caption: "" },
                                //{ kind: "Item", layoutKind: "HFlexLayout", components:
                                //{ kind: "HFlexBox", components:
                                    //[
                                        { kind: "Item", style: "float: left; border: outset;", flex: 1, components:
                                            [
                                                { name: "contactInfo", kind: "HtmlContent", },
                                                { name: "contactType", className: "enyo-item-secondary", },
                                            ]
                                        },
                                    //]
                                //}
                                /*{ kind: "HFlexBox", components:
                                    [
                                        
                                        { kind: "VFlexBox", flex: 1.0, components:
                                            [
                                                { kind: "Divider", caption: ""},
                                                { kind: "Box", components: 
                                                    [
                                                        { name: "contactInfo", kind: "Item", },
                                                        { kind: "HFlexBox", pack: "center", components:
                                                            [
                                                                { kind: "Button", caption: "Call", },
                                                                { kind: "Button", caption: "Text", },
                                                                { kind: "Button", caption: "Email", },                                                
                                                            ]
                                                        }
                                                    ]
                                                },

                                                { name: "contactType", className: "enyo-item-secondary" },
                                            ]
                                        },
                                    ]
                                },*/
                            ]
                        },
                    ]
                },
            ],
        selected: function(inSender, inEvent)
        {
            var index = inEvent.rowIndex;
            if(index >= this.selectedContact.numbers.length) // email
            {
                index -= this.selectedContact.numbers.length;
                this.doEmailSelected(inEvent, this.selectedContact.emails[index]);
            } else {
                this.doPhoneSelected(inEvent, this.selectedContact.numbers[index]);
            }
        },
        setContact: function(contact)
        {
            this.selectedContact = contact;
            this.render();
        },
        getListItem: function(inSender, inIndex)
        {
            if(!this.selectedContact) return false;
            if(inIndex >= this.selectedContact.numbers.length)
            {
                inIndex -= this.selectedContact.numbers.length;
                if(this.selectedContact.emails[inIndex])
                {
                    this.$.contactInfo.setContent(this.selectedContact.emails[inIndex]);
                    this.$.contactType.setContent("E-mail Address");
                    return true;
                } else {
                    return false;
                }
            } else {
                if(this.selectedContact.numbers[inIndex])
                {
                    this.$.contactInfo.setContent(this.selectedContact.numbers[inIndex].displayNumber);
                    var phoneType = this.selectedContact.numbers[inIndex].phoneType ? this.selectedContact.numbers[inIndex].phoneType : "Other";
                    this.$.contactType.setContent("Telephone: " + phoneType);
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
);

/*

'contacts':
    "ef27b788dfd5b36":
        {
            "contactId":"ef27b788dfd5b36",
            "name":"Angel Leksche",
            "photoUrl":"/photos/private/AIbEiAIAAABDCJCxocqw7dafTSILdmNhcmRfcGhvdG8qKDg5MmZlNDJiYTE5NWRhYzA1N2Y5ZjY0NDRiNmZjNTQ1ZTE0OTg3ZTEwAcb8q33qHO0mfO4UqnEaIbAja3aa",
            "phoneNumber":"+17342222222",
            "hasSpokenName":false,
            "displayNumber":"(734) 222-2222",
            "rankp":0,
            "rankc":39,
            "emails":
                ["zzzzzzzz@gmail.com","7342222222@messaging.nextel.com","aaaaaa.aaaaaa@gmail.com","aaaaaaa.a@gmail.com"],
            "cEmails":
                ["ALO6jhA2nBVt0XnQudxwiO9DK6kKHXZhDS_FurUEgT7mYqSzRm6g4ug3tN6lAvdhdFJO7jePjtjP","ALO6jhDcrYxL0CD4lb5bQ13LQU8T6R8XiWzCj6sbcmj8S90ACnoESZZa-6H0Xo4T1BrML58ALvJ2","ALO6jhChR9yX83SAE4HUxUj1UstOVxUra2SPNozaw7ORkE9xwQmB8VC8trPXWWkXDmxryqEjbufn","ALO6jhBX0eEOAy8NcvWSkIYb0Fx7Ww2r2JfRsfJ5kCxaNqdciDPD9LO6-k6XeviH3aPHe6GOUqyI"],
            "phoneTypeName":"mobile",
            "response":0,
            "hasCustomForwarding":false,
            "numbers":
                [
                    {
                        "phoneNumber":"+17342222222",
                        "displayNumber":"(734) 222-2222",
                        "phoneType":"mobile"
                    }
                ]
            },
*/
