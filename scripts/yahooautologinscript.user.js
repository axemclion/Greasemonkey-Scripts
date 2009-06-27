// ==UserScript==
// @name          YAHOO Auto Login Script
// @namespace     https://login.yahoo.com/config/*
// @description	  Automatically logs into YAHOO
// @include       https://login.yahoo.com/config/*
// ==/UserScript==
// Notes:
//   * is a wildcard character
//   .tld is magic that matches all top-level domains (e.g. .com, .co.uk, .us,  etc.)

function autoLogin()
{
	if (!GM_getValue('yahooUserName')) 
	{
		yahooUserName = prompt("What is your Yahoo user name ?? ");
		GM_setValue('yahooUserName', yahooUserName);
	} 
	else 
	{
		yahooUserName = GM_getValue('yahooUserName');
	}
	
	if (!GM_getValue('yahooPassword')) 
	{
		yahooPassword = prompt("What is your Yahoo password ?? ");
		GM_setValue('yahooPassword', yahooPassword);
	} 
	else 
	{
		yahooPassword = GM_getValue('yahooPassword');
	}
	
	var userName = document.getElementById('username');
	if (userName != null)
	{
		userName.value = yahooUserName;
	}
	
	var pwd = document.getElementById('passwd');
	if (pwd != null)
	{
		pwd.value = yahooPassword;
	}
	
	var loginForm = document.getElementsByName('login_form');
	if (loginForm[0] != null)
	{
		loginForm[0].submit()
	}
}

autoLogin();