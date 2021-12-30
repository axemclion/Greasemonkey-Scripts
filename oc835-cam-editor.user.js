// ==UserScript==
// @name     OC835 - Camera Property Browser
// @description When viewing properties of the camera using /adm/get_group.cgi, converts them to hyperlinks to be able to click through them
// @include /^http://192\.168\.1\.20./adm/get_group.cgi/
// @namespace http://www.nparashuram.com/gmscripts
// @version  1
// @grant    none
// ==/UserScript==

// Change everything to hyperlinks
document.body.innerHTML = document.body.innerText
  .split("\n")
  .map((txt) => {
    if (/\[\S*\]/.test(txt)) {
      // Top Level categories
      return `<a style="color:white" href='?group=${txt.replace(/[\[\]]/g, "")}'>${txt}</a>`;
    } else if (/\S*=\S*/.test(txt)) {
      return `<a href='#' onClick='modify("${txt}")'>${txt}</a>`;
    }
  })
  .join("\n");

// Script handler to modify values
function modify(arg) {
  const [key, val] = arg.split("=");
  const newVal = window.prompt(`Enter a new value for \n${key}`, val);
  if (newVal != null) {
    fetch(`/adm/set_group.cgi${window.location.search}&${key}=${newVal}`)
      .then((res) => res.text())
      .then((res) => {
        alert(`Value Set\n ${key}=${newVal}`);
        window.location.reload();
      })
      .catch((e) => alert(`Error setting\n ${key}=${newVal}`));
  }
}

var script = document.createElement("script");
script.type = "text/javascript";
script.appendChild(document.createTextNode(modify.toString()));
(document.body || document.head || document.documentElement).appendChild(script);

// Add a Go Back button
if (/\?group=/.test(window.location.search)) {
  document.body.innerHTML = `<a href="${window.location.pathname}">[Go Back]</a><br/><br/>` + document.body.innerHTML;
}

// Add styles for links
const css = `
a {
    color: white;
    font-size: 1em;
    font-family: arial;
    padding: 0.2em;
    display: block;
    text-decoration: none;
}
a:hover{
    text-decoration: underline;
}
`;
const style = document.createElement("style");
style.appendChild(document.createTextNode(css));
(document.body || document.head || document.documentElement).appendChild(style);
