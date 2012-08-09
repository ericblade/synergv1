enyo.kind( {
    name: "contactsIndex",
    kind: "Scroller",
    autoHorizontal: false,
    horizontal: false,
    autoVertical: true,
    accelerated: useAccelerated(),
    events:
        { "onContactSelected":"", },
    components:
        [
            // TODO: Get this working
            /*{ name: "contactSearchInput", hint: "Search", className: "searchbar", kind: "autoCompleteInput", style: "height: 38px; max-height: 38px", components:
                [
                    { kind: "Image", src: "images/searchicon24.png" },
                ]
            },*/
            
            { kind: "VirtualRepeater", flex: 1, onSetupRow: "getContactsIndexItem", onclick: "indexClick", accelerated: useAccelerated(), components:
                [
                    { kind: "Item", layoutKind: "HFlexLayout", onclick: "selected", components:
                        [
                            { name: "indexName", kind: "HtmlContent", },
                        ]
                    }
                ]
            }
        ],
    render: function() {
        this.inherited(arguments);
        this.$.contactSearchInput.setSuggestList(enyo.application.mainApp.AutoCompleteNames);
    },
    getContactsIndexItem: function(inSender, inIndex)
    {
        // TODO: deal with the situation with "No Contacts"
        if(!enyo.application || !enyo.application.mainApp || !enyo.application.mainApp.PrimaryData || !enyo.application.mainApp.PrimaryData.contacts)
            return false;
        //var contact = enyo.application.mainApp.PrimaryData.contacts[enyo.application.mainApp.PrimaryData.rankedContacts[inIndex]];
        var contact = enyo.application.mainApp.PrimaryData.contacts[inIndex];
        if(contact)
        {
            this.$.indexName.setContent(contact.name);
            return true;
        }
        return false;
    },
    selected: function(inSender, inEvent)
    {
        //var contact = enyo.application.mainApp.PrimaryData.contacts[enyo.application.mainApp.PrimaryData.rankedContacts[inEvent.rowIndex]];
        var contact = enyo.application.mainApp.PrimaryData.contacts[inEvent.rowIndex];
        this.doContactSelected(contact);
    }
});
