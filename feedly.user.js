// ==UserScript==
// @name           Feedly - Open entry in background (Modified)
// @description    Adds 'h' as a hotkey to open selected entry in background tab 
// @namespace      gist.github.com/axemclion/11b6968d2418caad7528e1e629af3886/edit
// @author         axemclion
// @include        http://feedly.com/*
// @include        https://feedly.com/*
// @include        http://*.feedly.com/*
// @include        https://*.feedly.com/*
// @grant          GM.openInTab
// @version        1.0.1
// ==/UserScript==


(function() {
  var background_key = 72;

	var open_entry = function() {
		var cur =  document.querySelector('.inlineFrame--selected a');
    if (cur == null) {
    	cur = document.querySelector('.entryTitle');
    }
		if (cur) {
    	console.log("FeedlyOpenEntryInBackgroundTab: GM_openInTab now " + cur.href);
			GM.openInTab(cur.href, true);
			return true;
		} else {
			alert('Could not find selected element');
			return false;
		}
	};

	// bind key-handler
	document.addEventListener('keydown', function(e){
		
	 if ( e.keyCode == background_key && !(e.altKey || e.ctrlKey || e.metaKey) ) {
			var el = document.activeElement;

			// if in textfield, do nothing
			if (el && (el.tagName.toLowerCase() == 'input' && el.type == 'text' ||
					el.tagName.toLowerCase() == 'textarea')) {
				return true;  
			}
			return !open_entry();
		}	
	} ,true);
	
})();
