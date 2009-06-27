// ==UserScript==
// @name          No Confirmation Dialog on Window unload
// @author        Parashuram
// @namespace     http://unload.meebo.user.js
// @description   Removes the unload confirmation dialog box
// @include       http://www*.meebo.com/*
// @include       https://www*.meebo.com/*
// ==/UserScript==


unsafeWindow.window.onbeforeunload="";