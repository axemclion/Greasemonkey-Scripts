// ==UserScript==
// @name     Show Password
// @version  1
// @grant    none
// ==/UserScript==

function handleDblClick(e){
	var pwd = e.target;
  var type = pwd.getAttribute('type');
  pwd.setAttribute('type', type === 'password' ? 'text': 'password');
}

var passwords = document.querySelectorAll("input[type=password]");
for (var i = 0; i < passwords.length; i++){
  passwords[i].addEventListener('dblclick', handleDblClick, true);
}
