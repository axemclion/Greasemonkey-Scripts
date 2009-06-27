// ==UserScript==
// @name          Thats My Mouse 
// @description   Allows people to co browse when they are on a website
// @include       *
// ==/UserScript==

var tmm_settings = 
{
    align : "center",
    valign : "top"
};

var sc = document.createElement("script");
sc.src = "http://files.thatsmymouse.com/app.latest.js"
document.body.appendChild(sc);
