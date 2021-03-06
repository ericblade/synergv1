function useAccelerated() {
    return true;
    if(Platform.isAndroid()) {
        return Platform.version > 2;
    }
    if(Platform.isWebOS()) {
        //return Platform.version >= 3;
        return false;
    }
    if(Platform.isWebWorks()) {
        return true;
    }
    return false;
}

prefs = {
    set: function(prop, setting)
    {
        setting = JSON.stringify(setting);
        localStorage.setItem(prop, setting);
        enyo.setCookie(prop, setting, { "Max-Age": 31536000 });
    },
    get: function(prop)
    {
        var x = localStorage && localStorage.getItem(prop);
        if(x) {
            try {
                x = JSON.parse(x);
            } catch(err) {
                // do nothing
            }
        }
        return x || (document && document.cookie && enyo.getCookie(prop));
    },
    del: function(prop)
    {
        localStorage.removeItem(prop);
        enyo.setCookie(prop, undefined, { "Max-Age": 0 } );
    },
    def: function(prop, setting)
    {
        var x = prefs.get(prop);
        enyo.log("def", prop, x, setting);
        if( (!isNaN(x) && isNaN(setting)) || x === undefined)
            prefs.set(prop, setting);
    }
};

function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    if(hours > 0)
        return (hours < 10 ? "0" : "") + hours+":" + (minutes < 10 ? "0" : "") + minutes+":"+(seconds < 10 ? "0" : "") + seconds;
    return (minutes < 10 ? "0" : "") + minutes+":" + (seconds < 10 ? "0" : "") + seconds;
}

function useInternalWebView()
{
    return false;
    //return isLargeScreen() && window.PalmSystem;
}

function stripHtml(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

function formatPhoneNumber(phonenum) {
    var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (regexObj.test(phonenum)) {
        var parts = phonenum.match(regexObj);
        var phone = "";
        if (parts[1]) { phone += "+1 (" + parts[1] + ") "; }
        phone += parts[2] + "-" + parts[3];
        return phone;
    }
    else {
        //invalid phone number
        return phonenum;
    }
}

function ParseMessages(html)
{
    var ret = [ ];
    var tmp = document.createElement("DIV");
    
    html = html.replace(/src=\"/g, 'src="https://www.google.com');
    tmp.innerHTML = html;
    
    SMSMessageBlocks = tmp.getElementsByClassName("gc-message-sms-row");
    for(var x = 0; x < SMSMessageBlocks.length; x++)
    {
        ret[x] = [ ];
        ret[x].SentBy = enyo.string.trim(SMSMessageBlocks[x].getElementsByClassName("gc-message-sms-from")[0].textContent);
        ret[x].SentTime = SMSMessageBlocks[x].getElementsByClassName("gc-message-sms-time")[0].textContent;
        // non-webOS and webOS 1/2 have broken runTextIndexer
        if(typeof Platform !== "undefined" && Platform.isWebOS() && Platform.platformVersion >= 3)
            ret[x].SentMessage = enyo.string.runTextIndexer(SMSMessageBlocks[x].getElementsByClassName("gc-message-sms-text")[0].textContent, { emoticon: false });
        else
            ret[x].SentMessage = SMSMessageBlocks[x].getElementsByClassName("gc-message-sms-text")[0].textContent;
    }
    // TODO: rewrite the voicemail search now that we know wtf field names we need?
    var vmt = tmp.getElementsByClassName("gc-edited-trans-text");
    if(vmt.length > 0) {
        VMTranscripts = tmp.getElementsByClassName("gc-message-tbl");
        if(VMTranscripts.length > 0) {
            for(x = 0; x < VMTranscripts.length; x++)
            {
                ret[x] = [ ];
                ret[x].SentBy = enyo.string.trim(VMTranscripts[x].getElementsByClassName("gc-message-name")[0].textContent);
                ret[x].SentTime = VMTranscripts[x].getElementsByClassName("gc-message-time")[0].textContent;
                vmt = VMTranscripts[x].getElementsByClassName("gc-edited-trans-text");
                ret[x].VoicemailTranscript = enyo.string.runTextIndexer(vmt[0].textContent, { emoticon: false });
            }        
        }
    }
    var gcmessageplay = tmp.getElementsByClassName("gc-message-play");
    var messagelength = "unknown";
    if(gcmessageplay.length > 0) {
        var lengthblock = gcmessageplay[0].getElementsByClassName("goog-inline-block")[0];
        if(lengthblock) {
            //console.log("lengthblock=" + lengthblock);
            messagelength = lengthblock.innerHTML;
        }
    }
    console.log("picked up message length = " + messagelength);
    var missedCallCheck = tmp.getElementsByClassName("gc-message-icon-0");
    ret.isMissedCall = (missedCallCheck.length > 0);
    var blockedCallerCheck = tmp.getElementsByClassName("gc-message-blocked");
    ret.isBlockedCaller = (blockedCallerCheck.length > 0);
    ret.html = html;
    ret.Portrait = tmp.getElementsByTagName("img")[0]; //ret.Portrait.getElementsByTagName("img");
    ret.Location = tmp.getElementsByClassName("gc-message-location");
    ret.messageLength = messagelength;
    if(ret.Location.length > 0)
    {
        ret.Location = ret.Location[0].textContent;
    } else {
        ret.Location = "";
    }
    delete tmp.innerHTML;
    return ret;
}

function ParsePrimaryData(html)
{
    enyo.log("Parsing Primary Data");
    html = enyo.string.trim(html);
    var i = html.indexOf("var _gcData = {") + 14;
    //enyo.log("_gcData begins at " + i);
    var j = html.indexOf("};", i) + 1;
    //enyo.log("_gcData ends at " + j);
    tmp = html.substring(i,j);

    // Strip parts of Google's JSON that are broken
    // These need to be parsed more intelligently, somehow or other, for the future.
    tmp = tmp.replace("<!-- TODO(pmoor): remove this as soon as the 9/12 release is cut -->", "");
    // TODO: we should probably remove everything in the "settings" block of _gcData, because we don't know what any of that might be, and the first thing to ever pop in there is broken.
    tmp = tmp.replace("'voicemailFeature1': false,", "");
    //

    tmp = tmp.replace(/\'/g, '"');
    //enyo.log("parsing json from: " + tmp);
    //enyo.log("tmp = " + tmp);
    try {
        var primarydata = JSON.parse(tmp);
        enyo.log("json parsed!");
    } catch(err) {
        enyo.log("failed to parse json :-(");
        //enyo.application.mainApp.$.ErrorPopup.openAtCenter();
        enyo.application.mainApp.$.rightPane.selectViewByName("errorView");
        enyo.application.debuglog("ERROR: " + err +"<br>tmp=" + tmp + "<br>html="+html);
        enyo.application.debuglog("tmp="+tmp);
        enyo.application.debuglog("html="+html);
        //enyo.application.mainApp.$.errorView.$.ErrorBox.content += "ERROR: " + err + " tmp="+tmp + " html="+html;
        //enyo.application.mainApp.$.errorView.render();
        return;
    }
    
    var index = 0;
    var counter = 0;
    var tempcontacts = new Array();
    enyo.log("parsing contacts");
    for(var id in primarydata.contacts)
    {
        counter++;
        if(primarydata.contacts.hasOwnProperty(id) && primarydata.contacts[id].displayNumber)
        {
            tempcontacts[index] = primarydata.contacts[id];
            //primarydata.contacts[index] = primarydata.contacts[id];
            index++;
        }
    }
    primarydata.contacts = tempcontacts;
    primarydata.contacts.sort( function(i1, i2) { return i1.name.localeCompare(i2.name); });
    enyo.log("ParsePrimaryData: " + index + "/" + counter + " contacts with displayNumber set");
    enyo.log("RankedContacts: " + primarydata.rankedContacts.length);
    index = 0;
    /*for(id in primarydata.phones)
    {
        if(primarydata.phones.hasOwnProperty(id))
        {
            primarydata.phones[index] = primarydata.phones[id];
            index++;
        }
    }*/

    enyo.log(primarydata);
    return primarydata;
}

function pluralize(str, count)
{
    return (count != 1) ? str + "s" : str;
}