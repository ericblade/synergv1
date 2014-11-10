SynerGV 1

Originally written in 2011 for webOS 3.0.x, and then backported to webOS 2.x and 
1.4.5, and enhanced significantly throughout 2012, and ported to Android, Chrome,
and even an unreleased iOS port, SynerGV is one of the most popular Google
Voice(tm) management apps out there.

SynerGV was originally built as an app to allow SMS text messaging from a tablet,
and has been enhanced to support nearly every function of Google Voice.

There is a re-written SynerGV 2 for webOS 3.0.5, however it is quite webOS 3.0.5
specific, as it uses many features and functions that just plain are not (or were
not at the time) available in other systems.  SynerGV 2 source code will be open
sourced in the near future.

SynerGV 1 was written from the ground up using Javascript and Enyo v1, mostly
via a lot of trial and even more error, and using a ton of other Voice projects
for inspiration and information.

Plans had been made to create a SynerGV 3, which would have been written in
a combination of standard Javascript using Enyo v2, 
as well as platform specific pieces in other languages, such as node.js Javascript, 
Android Java, QML, and others, but lack of time on the author's part has made that
an excruciatingly slow project that may not ever see the light of day.

You are welcome to use this code in any fashion that you see fit, just remember
to give credit where credit is due, and follow the LICENSE agreement.

** PLEASE keep in mind that Open Source projects work best for everyone when you
actively contribute!  Pull Requests and Gerrithub Code Review requests are welcome!

Original SynerGV 2 code through the initial commit to this repository is Copyright 2011 - 2014, Eric Blade. All additional code that is not mentioned below, is copyright the author of that code. All contributions to this code are considered to be released under the terms of the LICENSE file here.
The SynerGV icon is Copyright iconshock.com.
The search icon is Copyright Oxygen Team.
Additional graphics and Icons are copyright Asle Hoeg-Mikkelsen.

This repo is available at gerrithub!  Visit gerrithub.io, and search for the
project "ericblade/synergv1", or simply search "ericblade" for all of my public
source code.

More information about gerrithub is available here:
https://www.youtube.com/watch?v=jeWTvDad6VM

*** THIS REPOSITORY CONTAINS SUBMODULES.
*** MAKE SURE YOU INIT ALL SUBMODULES, OR THAT YOU HAVE DONE A RECURSIVE CHECKOUT.

=== To run in Chrome ===

(Windows) Create a new shortcut on your desktop to Chrome.  Edit that shortcut, and add "--disable-web-security" to the Target.
Example: "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security

(Unix) run google-chrome --disable-web-security or chromium --disable-web-security (depending on wether you are using chrome or chromium)

(Mac/others) I don't use a Mac, but you should be able to adapt the above instructions.

This might work in Opera, if Opera 20+ supports the --disable-web-security command.

Do NOT use the disable-web-security switch for active browsing!!! Only use it when working with known good files.

Use that shortcut, and load the "index-chrome.html" in the repo into your Chrome window, such as:
file:///D:/src/synergv1/app/index-chrome.html

=== Deploying to various platforms ===

The deploy system that I used during building is not currently in this repository.  As I sort out just how it worked (yes, after a year or more, I forget certain specifics), I will likely commit a new repository with the appropriate scripts to install to devices.

You may be able to get away with simply deploying for webOS, using palm-package (HP webOS SDK) or ares-package (LG webOS SDK) on the directory.
Some functions may not work in this case, as it looks like there was some additional service code required for full webOS functionality, which I will be committing as soon as I straighten out how that all worked.

===== Official forums available at http://www.ericbla.de/
