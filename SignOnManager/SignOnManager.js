/**
 * This is the main SignOnManager class. Detects and decides if a page is ok for signing on
 * If it already has the data for sign on etc. 
 */
var SignOnManager = 
{
	STATE_ENABLED  : "enabled",
	STATE_DISABLED : "disabled",
	STATE_NONE     : "delete",

	pageName 	   : null,
	isMenuAdded	   : false,
	
	/**
	 * Gets the WildCarded-URL of the currentPage
	 */
	 getPageName : function()
	 {
	 	if (SignOnManager.pageName == null)
	 	{
			SignOnManager.pageName = prompt("Please enter the URL of the page that SignOnManager will try to do the requested action\n" +
							"Note that you can specify wild card (*) in the same fashion as includes of Grease Monkey"
							, document.URL);
	 	}
	 	return SignOnManager.pageName;
	 },

	/**
	 * Fills the current form, or saves the data for future use.
	 */
	init : function()
	{
		Logger.log("Starting Sign On Manager", Logger.INFO);
		//checking if this is a form that is fillable
		var pageName = SignOnManager.getPage();
		var isFormMappable = SignOnManager.isMappable();
		if (pageName.state == SignOnManager.STATE_ENABLED && isFormMappable)
		{
			FormManager.fillForm(pageName.url);
		}
		else if (pageName.state == SignOnManager.STATE_DISABLED)
		{
			Logger.log("Sign On Manager is disabled for this page",Logger.INFO);
			// adding the enable Menu item
			GM_registerMenuCommand("Enable Sign On Manager", function(){SignOnManager.enableSignOn(SignOnManager.getPageName());});
			SignOnManager.isMenuAdded = true;
			DialogManager.displayMessage("Sign On Manager disabled for this page");
		}
		else
		{
			if (isFormMappable)
			{
				DialogManager.canMapForm();
			}
			else
			{
				Logger.log("Nothing do do with this form", Logger.INFO);
			}
		}
		if (!SignOnManager.isMenuAdded)
		{
			GM_registerMenuCommand("Start Sign On Manager", function(){SignOnManager.init();});
			SignOnManager.isMenuAdded = true;
		}
		
	},
	
	/**
	 * Re - enables the Sign On Manager 
	 */
	enableSignOn : function(url)
	{
		Logger.log("Re-enabling Sign On Manager for page " + url);
		DataObject.mappedPages = null;
		DataObject.savePageAsMapped(url, SignOnManager.STATE_ENABLED);
		SignOnManager.init();
	},
	
	
	/**
	 * Returns is this form is already saved in the forms that can be filled.
	 * We do a regex match on the current URL with the URL saved in the dataStores.
	 */
	getPage : function()
	{
		Logger.log("Checking if this form is saved already......");
		var currentForm = document.URL;
		var savedForms = DataObject.getMappedPages();
		var result = new Object();
		result.state = null;
		for (pageName in savedForms)
		{
			if (SignOnManager.pageCompare(pageName,currentForm))
			{
				result.state = savedForms[pageName];
				result.url   = pageName;
				break;
			}
		}
		Logger.log("Is " + currentForm + " saved : " + result.state);
		SignOnManager.pageName = result.url;
		return result;
	},

	/**
	 * Compares two pages based on the wildcards etc.
	 */
	pageCompare : function(gmVal, pageUrl)
	{
		var result = true;
		var pageUrlIndex = 0; var gmValIndex = 0;
		// in case there is no wild card
		if (gmVal.indexOf('*') == -1)
		{
			return (gmVal == pageUrl);
		}

		while (gmValIndex < gmVal.length && pageUrlIndex < pageUrl.length)
		{
			var param = gmVal.charAt(gmValIndex);
			if (param == "*")
			{
				gmValIndex++;param = gmVal.charAt(gmValIndex);
				while (pageUrl.charAt(pageUrlIndex) != param && pageUrlIndex < pageUrl.length)
				{
					pageUrlIndex++;
				}
			}
			else if (param != pageUrl.charAt(pageUrlIndex))
			{
				result = false;
				break;
			}
		gmValIndex++;
		pageUrlIndex++;
		}
		return result;
	},
	
	/**
	 * Returns if this is a new form and can be mapped
	 * Checks for now if this form has password fields.
	 */
	isMappable : function()
	{
		Logger.log("Starting to check if this form is mappable");
		var result = false;
		for (var i = 0; i < document.forms.length; i++)
		{
			var currentForm = document.forms[i];
			for (var j = 0; j < currentForm.length; j++)
			{
				if (currentForm[j].type && currentForm[j].type.toUpperCase() == "PASSWORD")
				{
					result = true;
					break;
				}
			}
		}
		Logger.log("Is form Mappable : " + result);
		return result;
	},
}

Logger.init("SignOnManager");
SignOnManager.init();