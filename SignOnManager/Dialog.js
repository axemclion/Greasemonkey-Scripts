/**
 * This is responsible for showing to the user, various information messages
 */
var DialogManager =
{
	dialogDIV : null,
	/**
	 * Displays a  dialog asking whether mapping is allowed
	 */
	canMapForm : function()
	{
		Logger.log("Looking as to when to map this form");
		DialogManager.createDialogDiv();
		var docPos = "";
		
		docPos +="<DIV style=  'padding : 3px ; font-family: verdana; font-size : 12'>" +
				"<DIV id = '_som_canMap_ID1' style = 'cursor:pointer; border : 1px SOLID #CFB997'>SignOn</DIV>" +
				 "<DIV id = '_som_canMap_ID2' style = 'cursor:pointer; border : 1px SOLID #CFB997'>Disable</DIV>" +
				 "<DIV id = '_som_canMap_ID3' style = 'cursor:pointer; border : 1px SOLID #CFB997'>&nbsp;&nbsp;Close </DIV>" +
				"<DIV>";
		DialogManager.dialogDIV.innerHTML += docPos;
		
		// setting the event handlers for the links
		document.getElementById("_som_canMap_ID1").addEventListener("click",DialogManager.mapFormCallBack,false);
		document.getElementById("_som_canMap_ID2").addEventListener("click",DialogManager.mapFormCallBack,false);
		document.getElementById("_som_canMap_ID3").addEventListener("click",DialogManager.mapFormCallBack,false);

		document.getElementById("_som_canMap_ID1").addEventListener("mouseover",DialogManager.handleMouseOver ,false);
		document.getElementById("_som_canMap_ID2").addEventListener("mouseover",DialogManager.handleMouseOver,false);
		document.getElementById("_som_canMap_ID3").addEventListener("mouseover",DialogManager.handleMouseOver,false);
		document.getElementById("_som_canMap_ID1").addEventListener("mouseout",DialogManager.handleMouseOut,false);
		document.getElementById("_som_canMap_ID2").addEventListener("mouseout",DialogManager.handleMouseOut,false);
		document.getElementById("_som_canMap_ID3").addEventListener("mouseout",DialogManager.handleMouseOut,false);


	},
	
	handleMouseOver : function(e)
	{
		e.target.style.backgroundColor = "#CFB997";
	},

	handleMouseOut : function(e)
	{
		e.target.style.backgroundColor = "#EFE8DD";
	},
	
	/**
	 * Callback when clicked on the links of the Map Form Dialog
	 */
	mapFormCallBack : function(event)
	{
		DialogManager.closeDialog();
		if (event.target.id == '_som_canMap_ID1')
		{
			DialogManager.displayMessage("Enter your username/password, and then press the Login Button / link");
			FormManager.mapForms();
		}
		else if (event.target.id == '_som_canMap_ID2')
		{
			DialogManager.displayMessage("Sign On Manager will be disabled for this page. To re-enable SignOn Manager, " +
					"please use <br>Tools > GreaseMonkey > User Script Commands > Re-enable Sign On Manager for this page");
			DataObject.savePageAsMapped(SignOnManager.getPageName(), SignOnManager.STATE_DISABLED);
		}
	},

	createDialogDiv : function()
	{
		if (DialogManager.dialogDIV == null)
		{
			var newDiv = document.createElement('div');
			newDiv.id = "_som_dialogDIV";
			newDiv.style.position = 'absolute';
			newDiv.style.backgroundColor = "#EFE8DD";
			newDiv.style.border = "SOLID #CFB997 3px";
			newDiv.style.top = "0px";
			newDiv.style.left = "0px";
			newDiv.style.padding = "5px";
			newDiv.style.zIndex = 999999;
			document.body.appendChild(newDiv);
			DialogManager.dialogDIV = document.getElementById("_som_dialogDIV");
			DragUtil.setAsDraggable("_som_dialogDIV");
		}
		DialogManager.dialogDIV.innerHTML = "";
		DialogManager.dialogDIV.style.display = "block";
	},
	
	/**
	 * Displays a simple message on the dialog Box
	 */
	displayMessage : function(msgText)
	{
		DialogManager.createDialogDiv();
		DialogManager.dialogDIV.innerHTML += "<span style=\"font-family: verdana; font-size : 12\">" + msgText + "</span>";
		window.setTimeout(DialogManager.closeDialog,5000);
	},
	
	/**
	 * Closes the dialog Manager
	 */
	closeDialog : function()
	{
		DialogManager.dialogDIV.style.display = "none";
	}
	
}

