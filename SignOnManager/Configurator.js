/**
 * The cConfiguration Dialog Class that 
 * allows various setup for this script
 */

var Configurator = 
{
	ID_COMBO	: "_som_config_config_",
	ID_TEXT		: "_som_config_text",
	ID_BUTTON	: "_som_config_button",
	
	configDiv : null,
	
	/**
	 * Adds the configuration menu to the GM Script
	 * 
	 */
	init : function()
	{
		GM_registerMenuCommand("Configure Sign On Manager",function(){Configurator.showConfigDialog()});
	},
	
	/**
	 * Closes the Dialog div
	 */
	closeDialogDiv : function()
	{
		Configurator.configDiv.style.display = "none";
	},

	/**
	 * Displays the Configuration cialog for 
	 * SIgn On Manager
	 */
	showConfigDialog : function()
	{
		Logger.log("Showing the Configuration Manager");
		if (Configurator.configDiv == null)
		{
			Configurator.createConfigDiv();
		}
		
		Configurator.configDiv.innerHTML = "<DIV style = '	font-size : 12px; padding : 6px; background-Color : #92B4DE; align : CENTER'> " +
				"<DIV style = 'display: table-cell; width : 100%'> Sign On Manager - Configuration </DIV>" +
				"<DIV style = 'display: table-cell;'> <BUTTON id = 'som_config_closeButton'>X</BUTTON> </DIV> "
				"</DIV>";
		Configurator.populateConfigDiv();
		Configurator.configDiv.style.display = "";		
		document.getElementById("som_config_closeButton").addEventListener("click", Configurator.closeDialogDiv, true);
	},
	
	/**
	 * Creates the configuration DIV
	 */
	createConfigDiv : function()
	{
		Logger.log("Creating a new config div");
		var newDiv = document.createElement("div");
		newDiv.id = "_som_configDIV";
		newDiv.style.position = "absolute";
		newDiv.style.backgroundColor = "#D4D0C8";
		newDiv.style.fontFamily = "verdana";
		newDiv.style.width = "460px"
		newDiv.style.left = screen.availWidth/2 - parseInt(newDiv.style.width)/2;
		newDiv.style.top = 20;

		newDiv.style.borderBottom = "SOLID 2px BLACK";
		newDiv.style.borderRight = "SOLID 2px BLACK";
		newDiv.style.borderTop = "SOLID 2px GREY";
		newDiv.style.borderLeft = "SOLID 2px GREY";

		document.body.appendChild(newDiv);
		Configurator.configDiv = document.getElementById(newDiv.id);
	},
	
	/**
	 * Populates the configuration div with the data, allowing changes to the data
	 */
	populateConfigDiv : function()
	{
		var configData = "<DIV style = 'padding : 6px; font-size : 12;'>";
		for (pageName in DataObject.getMappedPages())
		{
			Logger.log(pageName);
			configData += "<DIV style='vertical-align: middle;' >"
			configData += "<input size = '40' type = 'text' id = '"+ Configurator.ID_TEXT + escape(pageName) + "'  value = '" + pageName + "'> ";
			configData += "<SELECT id = '" + Configurator.ID_COMBO + escape(pageName)+ "'>" +
				"<OPTION>" + SignOnManager.STATE_ENABLED   + "</OPTION>" +
				"<OPTION>" + SignOnManager.STATE_DISABLED  +"</OPTION>" +
				"<OPTION>" + SignOnManager.STATE_NONE + "</OPTION>" +				
				"</SELECT>";
			configData += "&nbsp;&nbsp;<BUTTON id = '" + Configurator.ID_BUTTON + escape(pageName)+"'>Details</button>";
			configData += "</DIV>";
		}
		Configurator.configDiv.innerHTML += configData + "</DIV>";
		
		configDiv = "<DIV style = 'padding : 6px; font-size : 12; direction : rtl'>" +
				"		<BUTTON id = '_som_config_cancel'> Cancel </BUTTON>" +
				"		<BUTTON id = '_som_config_ok'> OK </BUTTON>" +
				"	</DIV>"
		Configurator.configDiv.innerHTML +=configDiv;
				
		// Now setting the event handlers and selectors for each page
		for (pageName in DataObject.mappedPages)
		{
			var button = document.getElementById(Configurator.ID_BUTTON + escape(pageName));
			if (button)
			{
				button.addEventListener("click", Configurator.showDetails, true);
			}	
			var comboBox = document.getElementById(Configurator.ID_COMBO + escape(pageName));
			if (comboBox)
			{
				comboBox.value = DataObject.mappedPages[pageName];
			}
		}
		document.getElementById("_som_config_cancel").addEventListener("click",Configurator.closeDialogDiv,true);
		document.getElementById("_som_config_ok").addEventListener("click",Configurator.saveConfig,true);
	},
	
	/**
	 * Shows the details of an element that is selected
	 */
	showDetails : function (e)	
	{
		var elem = e.target.wrappedJSObject || e.target;

		var pageName = unescape( elem.id.substr(Configurator.ID_COMBO.length));
		Logger.log("Showing values for Page " + pageName, Logger.INFO);

		var pageValues = DataObject.fetchFormValues(pageName);
		for (field in pageValues)
		{
			Logger.log(field);
		}
		alert("This feature is under development.\nFor now, please save the page again with new details");
	},
	
	saveConfig : function()
	{
		Logger.log("Saving the modified configuration", Logger.INFO);
		// parsing all the values
		var newMappedPages = new Object();
		
		for (pageName in DataObject.mappedPages)
		{
			var text = document.getElementById(Configurator.ID_TEXT + escape(pageName));
			var state = document.getElementById(Configurator.ID_COMBO + escape(pageName));
			if (!text || state.value == SignOnManager.STATE_NONE)
			{
				continue;
			}
			newMappedPages[text.value] = state.value;
		}
		DataObject.mappedPages = newMappedPages;
		PersistanceManager.persist("mappedPages", DataObject.mappedPages);
		Configurator.closeDialogDiv();
	}
}

Configurator.init();