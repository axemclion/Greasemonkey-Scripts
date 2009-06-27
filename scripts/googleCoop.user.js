// ==UserScript==
// @name           Google Custom Search Helper
// @namespace      com.blogspot.dy-verse
// @description    Adds a Google Custom Search box on the right of normal search results
// @include        http://www.google.com/search*
// @include        http://www.google.co.in/search*
// ==/UserScript==


var cseId = "015234417013400136983:od9d_pobr4q"
var csResults = document.createElement("div");
resultsDiv = document.getElementById("res");
resultsDiv.parentNode.insertBefore(csResults, resultsDiv.nextSibling);

resultsDiv.style.width = "45%";
csResults.style.width = "45%";
resultsDiv.style.cssFloat = "left";
csResults.style.cssFloat = "right";


var cseUrl = "http://www.google.com/cse?ie=UTF-8&sa=Search&"

var qs = location.search.substring(1);
var nv = qs.split('&');
var url = new Object();
for (i = 0; i < nv.length; i++) 
{
    eq = nv[i].indexOf('=');
    url[nv[i].substring(0, eq).toLowerCase()] = unescape(nv[i].substring(eq + 1));
}

cseUrl = cseUrl + ["start=" + url.start, "q=" + url.q, "cx=" + cseId].join("&");

GM_xmlhttpRequest(
{
    method: "GET",
    "url": cseUrl,
    headers: 
    {
        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(responseDetails)
    {
        csResults.innerHTML = responseDetails.responseText.replace("id=res", "id=cse_res").replace("id=navbar", "id=cse_navbar");
        csResults.innerHTML = document.getElementById("cse_res").innerHTML;
        csResults.className = "med"
        var ads = document.getElementById("mbEnd")
        if (ads != null ) 
        {
            ads.innerHTML = ""
        }
    }
});
