var FormManager = 
{
	ELEM_CLICK : "Clicking caused a Javascript Call",
	FORM_SUBMIT : "Simple Form Submit",
	URL_CLICK  : "Clicked on a URL",
	
	/**
	 * This is a new form, so start mapping this form, so taht this can be filled in the future. 
	 */
	mapForms : function(pageUrl)
	{
		// Now trying to capture the link that triggers the SUBMIT of the form
		Logger.log("Please click on the button / link, that will do the submit of this page",Logger.INFO);

		/**
		 * Trying to indicate the clickable objects that will submit the form
		 */
		
		var mouseOverHandle = function(mouseEvent)
		{
			FormManager.resetObjectStyle();
			var elem = mouseEvent.target;
			elem = elem.wrappedJSObject || elem;
			if (FormManager.isSubmitElement(elem))
			{
				FormManager.oldHiliteObject = elem;
				FormManager.oldHiliteStyle =  elem.style.backgroundColor;
				elem.style.backgroundColor = "#FFAABB";	
			}// end of indicating the mappable elements
		}
		
		/**
		 * Trying to capture the object that has been clicked
		 */
		var mouseDownHandler = function(mouseEvent)
		{
			FormManager.resetObjectStyle();
			var elem = mouseEvent.target;
			elem = elem.wrappedJSObject || elem;
			if (FormManager.isSubmitElement(elem))
			{
				FormManager.oldHiliteObject = elem;
				FormManager.oldHiliteStyle = elem.style.backgroundColor;
				elem.style.backgroundColor = "RED";
			}
		}

		 document.addEventListener("click",FormManager.captureSubmission, true);
		 //document.addEventListener("mousedown", mouseDownHandler,true);
		 document.addEventListener("mouseover",mouseOverHandle,true);
		 FormManager.currentUrl = pageUrl;
	},

	/**
	 * This is the event that captures Submission of the form
	 * This saves all the data that is in the form, and the 
	 * action that is to be take when the form is submitted
	 */
	captureSubmission : function(mouseEvent)
	{
	 	var elem = mouseEvent.target;
		elem = elem.wrappedJSObject || elem;
			 	
		if (!FormManager.isSubmitElement(elem))
		{
			return;
		}
		
		// mapping this element to the actual element in the window
		
		Logger.log("Capturing Form Data for Target Element " + elem);
	 	var action = null;
	 	var actionType = null;
	 	var pageURL = SignOnManager.getPageName();
	 	
	 	if (typeof(elem.onclick) != "undefined")
	 	{
	 		actionType = FormManager.ELEM_CLICK;
	 		action = elem.onclick;
	 	}
	 	else if (elem.nodeName.toUpperCase() == "A")
	 	{
	 		// this is the case of clicking on a hyperlink
	 		action = elem.href;
	 		actionType = FormManager.URL_CLICK;
	 		if (action.indexOf("javascript:") == 0)
	 		{
		 		// if this is a Javascript function, we can directly call this function	
		 		// technically, we can place this as a URL also, but lemme put this in for now
		 		actionType = FormManager.ELEM_CLICK;
		 		action = action.substring(("javascript:").length);
	 		}
	 	}
	 	else if (elem.type && elem.type.toUpperCase() == "SUBMIT")
	 	{
	 		// this is the capture action for the FORM SUBMIT
	 		actionType = FormManager.FORM_SUBMIT;
	 		// trying to get the form that this element is associated with
	 		for (var i = 0; i < document.forms.length; i++)
	 		{
	 			if (document.forms[i] == elem.form)
	 			{
			 		action = "document.forms["+ i + "]";
			 		break;
	 			}
	 		}
	 	}
	 	
		var formFields = FormManager.getFormFields();
		formFields.submitAction = new Object();
		formFields.submitAction.actionType = actionType;
		formFields.submitAction.action = action;
		formFields.submitAction.page = pageURL;
		
		DataObject.saveFormValues(pageURL, formFields);	 	
		DataObject.savePageAsMapped(pageURL,SignOnManager.STATE_ENABLED);
		//Logger.log("You have confirmed that the form submission action is " + confirmation);
	},

	/**
	 * Resets the style of the object that change on MouseOver and Click
	 */
	resetObjectStyle : function()
	{				
		if (typeof(FormManager.oldHiliteObject) != "undefined")
		{
			FormManager.oldHiliteObject.style.backgroundColor = FormManager.oldHiliteStyle;
		}
	},

	/**
	 * returns if an element can act as a form SUBMIT or not
	 */
	isSubmitElement : function(elem)
	{
		var canMap = false;
		if (elem.type && elem.type.toUpperCase() == "SUBMIT")
		{
			// allow SUBMIT buttons
			canMap = true;
		}
		else if (elem.nodeName.toUpperCase() == "A")
		{
			// allow anchors
			canMap = true;
		}
		else if (typeof(elem.onclick) != "undefined")
		{
			// allow any HTMLElement that has an ONCLICK defined
			canMap = true;
		}
		return canMap;
	},

	/**
	 * Gets the form fields in an array.
	 * Return is in the format formFields an associative array
	 */
	getFormFields : function()
	{
		var formFields = new Object();
		formFields.fields = new Object();
		
		for (var i = 0; i < document.forms.length; i++)
		{
			for (var j = 0; j < document.forms[i].elements.length; j++)
			{
				var key = "document.forms[" + i + "].elements[" + j +"]";
				formFields.fields[key] = document.forms[i].elements[j].value;
			}
		}
		return formFields;
	},

	
	/**
	 * Starts the filling of the form
	 */
	fillForm : function(page)
	{
		Logger.log("Starting to fill the form");
		var formFields = DataObject.fetchFormValues(page);

		// now filling the values in the form
		for (inputElement in formFields.fields)
		{
			var elem = FormManager.getDOMElement(inputElement)
			if (typeof(elem) != "undefined")
			{
				elem.value = formFields.fields[inputElement];
			}
		}
		Logger.log("Form Filling Complete");
		
		// after the form is filled, now doing the submit operation
		Logger.log('Form Action ' + formFields.submitAction.actionType + " =>" + formFields.submitAction.action);
		if (formFields.submitAction.actionType == FormManager.ELEM_CLICK)
		{
			// calling the javascript;
			Logger.log("Calling the javascriot function " + formFields.submitAction.action + " in a second", Logger.INFO );
			window.setTimeout(formFields.submitAction.action, 1000);
		}
		else if (formFields.submitAction.actionType == FormManager.FORM_SUBMIT)
		{
			// in case of a simple form submit, just SUBMIT the form that is indicated
			var formElement = FormManager.getDOMElement(formFields.submitAction.action);
			var submitReturn = true;
			formElement = formElement.wrappedJSObject || formElement;
			if (typeof(formElement.onsubmit) == "function")
			{
				submitReturn = formElement.onsubmit.call(formElement);
				Logger.log("Called the submit function : " + submitReturn);
			}
			if (submitReturn != false && typeof(formElement.submit) == "function")
			{
				Logger.log("Submitting the form");
				formElement.submit();
			}
		}
		else if (formFields.submitAction.actionType == FormManager.URL_CLICK)
		{
			// in case of a simple form submit, just SUBMIT the form that is indicated
			window.location = formFields.submitAction.action;
		}
		DialogManager.displayMessage("Automatically submitting...")
	},
	
	/**
	 * Get the exact DOM element from the dotted value String
	 */
	getDOMElement : function(key)
	{
		// For now, i am doing an EVAL, which is potentially pretty dangerous, 
		// if the data is screwed up. Ideally, i should parse the value from the 
		// dataStore and then reconstruct this element. 
		return eval(key);
	},
}