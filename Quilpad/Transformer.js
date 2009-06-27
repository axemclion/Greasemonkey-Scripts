/**
 * Talks to the quilpad backend. 
 */
var Transformer = 
{
		KEY_ESC	: 27,

		TRANSFORMER_URL : "http://quillpad.com/quillpad_backend2/processWordJSON?",
//		TRANSFORMER_URL : "quil.jsp?",

		TRANSLATION_DELAY : 1000,
		WORD_SEPARATOR : " ",

		timerHandle	: null,
		translatedText : "",
		oldSourceText  : "",
		language : 'hindi',

		source : null,
		sourceTextArea : null,
		target : null,

		wordStart : 0,
		wordEnd   : 0,
		
		init : function(target, source)
		{
			Logger.log("Starting Quil with "+ target + " from " + source);
			Transformer.target = target;
			Transformer.source = source;
			Transformer.sourceTextArea = document.getElementById(source.id + FormHandler.TEXT_ID);
			Transformer.sourceTextArea = Transformer.sourceTextArea.wrappedJSObject || Transformer.sourceTextArea;

			Transformer.target.oldBackGround = target.style.backgroundColor;
			Transformer.target.style.backgroundColor = "#EFE8DD";
			Transformer.target.value = "";
			Transformer.target.oldCursor = target.style.cursor;
			Transformer.target.style.cursor = "not-allowed";
			
			Transformer.sourceTextArea.value = "";
			Transformer.sourceTextArea.focus();
			Transformer.sourceTextArea.addEventListener("keypress", Transformer.handleSourceKeyPress, true);
			//Transformer.sourceTextArea.addEventListener("blur", Transformer.quitTransform, true);
			
			Transformer.timerHandle =  window.setInterval(Transformer.transformTimer, Transformer.TRANSLATION_DELAY);
		},
		/**
		 * Stops the transformation of the text
		 * and hides the DIV
		 */
		quitTransform : function()
		{
			window.clearInterval(Transformer.timerHandle);
			Transformer.sourceTextArea.removeEventListener("keypress", Transformer.handleSourceKeyPress, true);
			Transformer.source.style.display = "none";

			Transformer.target.style.backgroundColor = Transformer.target.oldBackGround;
			Transformer.target.style.cursor = Transformer.target.oldCursor;
			Transformer.target.focus();

			Transformer.source  = null;
			Transformer.target = null;
			Transformer.sourceTextArea = null;
		},
		
		/**
		 * Handles the key press for Source Text Box
		 */
		handleSourceKeyPress : function(e)
		{
			if (e.keyCode ==  Transformer.KEY_ESC)
			{
				Transformer.quitTransform();
			}
		},
		
		/**
		 * Checks the data on the source and decides whether or not to make the server call
		 */
		transformTimer : function()
		{
			var newText = Transformer.sourceTextArea.value;
			var oldText = Transformer.translatedText;
	
			if (newText == Transformer.translatedText || Transformer.translatedText == null)
			{
				return;
			}
			Transformer.translatedText = null;
			Transformer.oldSourceText = Transformer.sourceTextArea.value;
			// locating the change since the previous transliteration
			
			var startIndex = -1; // to allow the initial character to be picked up
			Transformer.wordStart = 0;
			for (var i = 0, j = 0;newText.charAt(i) == oldText.charAt(j) && i < newText.length && j < oldText.length;i++, j++)
			{
				// setting this space as the start, as the text may be different after this !!
				if (newText.charAt(i) == Transformer.WORD_SEPARATOR)
				{
					startIndex = i;
					Transformer.wordStart++;
				}
			}

			// reaching to the end of the diff
			var endIndex = newText.length;
			Transformer.wordEnd = 0;
			for (var i = newText.length, j = oldText.length; newText.charAt(i) == oldText.charAt(j) && i >= startIndex && j >= 0;i--, j--)
			{
				if (newText.charAt(i) == Transformer.WORD_SEPARATOR)
				{
					endIndex = i;			
					Transformer.wordEnd++;
				}
			}
			
			newText = newText.substring(startIndex+1,endIndex  + 1);
			Transformer.doRequest(newText);
		},
		
		/**
		 * Makes the quill request
		 */
		doRequest : function(word)
		{
			word = word.replace(/^\s+|\s+$/g,"");
		
			var urlString = Transformer.TRANSFORMER_URL + 
						"&lang=" + Transformer.language + 
						"&rand=" + Math.random() +
						"&inString=" + word;
							
			GM_xmlhttpRequest({
			    method: 'GET',
			    url: urlString,
			    headers: {'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			        'Accept': 'application/atom+xml,application/xml,text/xml'},
			    onload: Transformer.responseHandler
			});
			
			console.log(urlString);
			// indicating Loading
			Transformer.target.style.backgroundImage = "url(http://www.andrewdavidson.com/articles/spinning-wait-icons/wait30trans.gif)";
			Transformer.target.style.backgroundPosition = "50%";
			Transformer.target.style.backgroundRepeat = "no-repeat";
		},
		
		/**
		 * Gets the quill response
		 */
		responseHandler : function(o)
		{
			var transObject = eval("(" + o.responseText  + ")");
			if (Transformer.target != null)
			{
				Transformer.target.style.backgroundImage = "url()";
			}
			Logger.log("Got translation for " + transObject.inString + " = " + transObject.itrans + " :: " + Transformer.wordStart + " - " + Transformer.wordEnd);
			
			var newText = transObject.itrans;
			var oldText = Transformer.target.value;
			
			// Locating the place where we must place this new Text
			var startIndex = 0;
			for (startIndex = 0; Transformer.wordStart > 0 && startIndex < oldText.length ; startIndex++)
			{
				if (oldText.charAt(startIndex) == Transformer.WORD_SEPARATOR)
				{
					Transformer.wordStart--;
				}
			}
			var endIndex = 0;
			for (endIndex = oldText.length ; Transformer.wordEnd > 0 && endIndex >= 0; endIndex--)
			{
				if (oldText.charAt(endIndex) == Transformer.WORD_SEPARATOR)
				{
					Transformer.wordEnd--;
				}
			}			
			
			//Logger.log(oldText.substring(0,startIndex) +","+ newText +","+ oldText.substring(endIndex + 2, oldText.length));
			Transformer.target.value = oldText.substring(0,startIndex) + newText + oldText.substring(endIndex + 2, oldText.length);
			Transformer.translatedText = Transformer.oldSourceText;
		},
		
		
		/**
		 * Returns if a the transformer is already active for a fof a field
		 */
		isActive : function()
		{
			if (Transformer.target == null)
			{
				return false
			}
			else 
			{
				return true;
			}
		}
}