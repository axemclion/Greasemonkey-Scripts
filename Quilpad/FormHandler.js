/**
 * This class is responsible for starting the quilpad on text fields
 * Also starts the transliteration part
 */
var FormHandler = 
{
	
	TEXT_ID : "_text",
	
	quillBox 	: null,
	
	/**
	 * Starts the capturing of the elements and initialises other variables
	 */
	init : function()
	{
		Logger.log("Starting Quiller", Logger.INFO);
		document.addEventListener("dblclick", FormHandler.startQuill, true);
	},
	
	/**
	 * Starts the quillpad transliteration on the specified filed
	 */
	startQuill : function(mouseEvent)
	{
		var elem = mouseEvent.target;
		elem = elem.wrappedJSObject || elem;
		unsafeWindow.axe = elem;
		if (FormHandler.isTextElement(elem) && Transformer.isActive() == false)
		{		
			Logger.log("Activating Quill on "  + elem, Logger.INFO);
			FormHandler.showQuilBox();
			Transformer.init(elem, FormHandler.quillBox);
		}
	},
	
	/**
	 * Returns whether an element can act for input text or not
	 */
	isTextElement : function(elem)
	{
		if (typeof(elem.nodeName) != "undefined" && (elem.nodeName.toUpperCase() == "INPUT" || elem.nodeName.toUpperCase() == "TEXTAREA"))
		{
			return true;
		}
		else 
		{
			return false;
		}
	},
	
	/**
	 * pops up the quil box where the text is to be typed
	 */
	showQuilBox : function()
	{
		if (FormHandler.quillBox == null)
		{
			// creating a new quill box
			Logger.log("Creating a new quil box");
			var newDiv = document.createElement("DIV");
			newDiv.id = "_gmscript_quill_box";
			newDiv.naem = newDiv.id;
			newDiv.style.position = 'absolute';
			newDiv.style.backgroundColor = "#EFE8DD";
			newDiv.style.border = "SOLID #CFB997 3px";
			newDiv.style.width = "265px";
			newDiv.style.padding = "5px";
			newDiv.style.height = "75px";
			newDiv.style.zIndex = 999999;

			newDiv.style.top = (window.innerHeight - parseInt(newDiv.style.height,10) - 20) + "px";
			newDiv.style.left = (window.innerWidth - parseInt(newDiv.style.width,10) -20) + "px";
			
			newDiv.innerHTML = '' +
					"			<form>" +
					"				<textarea id = '" + newDiv.id+ FormHandler.TEXT_ID + "' cols = '30' rows = '3'></textarea>" +
					"			</form>";
					
			
			document.body.appendChild(newDiv);
			
			FormHandler.quillBox = document.getElementById(newDiv.id);
			DragUtil.setAsDraggable(newDiv.id);
		}
		
		// showing the DIv
		FormHandler.quillBox.style.display = "";
	}
	
}

FormHandler.init();