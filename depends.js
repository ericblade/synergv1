if(window.PalmSystem && !isNaN(window.PalmSystem.deviceInfo.platformVersion))
{
    enyo.depends(
        "mainApp/source/globals.js",
        "mainApp/source/EnyoPlatform/",
        "mainApp/source/gvDashboard.js",
        "noWindow/applaunch.js"
    );
}
else // if PhoneGap or BlackBerry
{
    enyo.depends(
        "mainApp/source/EnyoPlatform/",
        "mainApp/source/EnyoTextArea.js",
        "mainApp/source/globals.js",
        "noWindow/applaunch.js",
        "mainApp/source/globals.js",
        "mainApp/utilkinds.js",
        "mainApp/source/contactDetail.js",
        "mainApp/source/outboxHandler.js",
        "mainApp/source/popups.js",
        "mainApp/source/contactsIndex.js",
        "mainApp/source/gvDashboard.js",
        "mainApp/source/gvoice.js",
        "mainApp/css/gvoice.css"
    );
}
