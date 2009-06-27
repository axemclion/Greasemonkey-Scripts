
/**
 * The entire Data Object that holds the Data required for sign On process
 */
var DataObject = 
{
	mappedPages : null,
	savedForms : null,
	
	/**
	 * If this Object created is null, tries to populate this from the 
	 * Persistance Manager. If the persistance Manager returns a null,
	 * initialises it with the defaultObj or new Object by defaule
	 */
	setUp : function(data, defaultObj)
	{
		if (typeof(defaultObj) == "undefined")
		{
			defaultObj = new Object();	
		}
		if (DataObject[data] == null)
		{
			DataObject[data] = PersistanceManager.getMap(data);
		}
		if (DataObject[data] == null)
		{
			DataObject[data] = defaultObj;
			Logger.log("Initialising up DataObject." + data + " for the first time use");
		}
	},
	
	
	/**
	 * Saves the current Page in the MappedPages Object
	 */
	savePageAsMapped : function(page,state)
	{
		DataObject.setUp("mappedPages", new Array());
		// adding to the persistance Manager
		DataObject.mappedPages[page] = state;
		PersistanceManager.persist("mappedPages", DataObject.mappedPages);
	},
	
	/**
	 * Gets the list of Pages that have already been mapped
	 */
	getMappedPages : function()
	{
		DataObject.setUp("mappedPages", new Object());
		return DataObject.mappedPages;
	},
	
	/**
	 * While mapping, saves the values that are in the form
	 */
	saveFormValues : function(page, formFields)
	{
		DataObject.setUp(page);
		DataObject[page] = formFields;
		PersistanceManager.persist(page, DataObject[page]);
	},
	
	/**
	 * On trying to fill the form on the current Page
	 */
	 fetchFormValues : function(page)
	 {
		DataObject.setUp(page);
		var formObject = DataObject[page];
		return formObject;
	 }
}
