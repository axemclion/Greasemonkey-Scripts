/**
 * Provides a drag and drop utility
 */

var DragUtil = 
{
	elemTable : new Object(),
	/**
	 * Used by the external functions,
	 */
	setAsDraggable : function(elem, handle)
	{
		Logger.log("Setting " + elem + " as draggable with handle " + handle);		
		if (typeof(handle) == "undefined")
		{
			handle = elem;
		}
		elem = document.getElementById(elem);
		handle = document.getElementById(handle);

		handle = handle.wrappedJSObject || handle;
		elem   = elem.wrappedJSObject || elem;
		handle.addEventListener("mousedown", DragUtil.startDrag ,true);
		DragUtil.elemTable[handle] = elem;
		handle.style.cursor = "move";
	},

	/**
	 * Marks the starting of the dragging
	 */
	startDrag : function(e)
	{
		var elem = e.target;
		elem = elem.wrappedJSObject || elem;
		DragUtil.elementDragged = DragUtil.elemTable[elem];
		Logger.log("Starting drag of " + DragUtil.elementDragged);
		if (typeof(DragUtil.elementDragged) != "undefined")
		{
			window.addEventListener("mousemove",DragUtil.doDrag,false);
			window.addEventListener("mouseup",DragUtil.stopDrag,false);
			DragUtil.offsetLeft = e.clientX - parseInt("0" + DragUtil.elementDragged.style.left,10);
			DragUtil.offsetTop  = e.clientY - parseInt("0" + DragUtil.elementDragged.style.top,10);
		}
	},
	
	/**
	 * Marks the end of dragging
	 */
	stopDrag : function(e)
	{
		//Logger.log("Stopping drag of " + DragUtil.elementDragged);
		window.removeEventListener("mousemove",DragUtil.doDrag,false);
		window.removeEventListener("mouseup",DragUtil.stopDrag,false);
		DragUtil.elementDragged = null;
	},
	
	/**
	 * Actually moving the mouse
	 */
	doDrag : function(e)
	{
		//Logger.log("-----------------" + e.clientX + " - "  +  DragUtil.offsetTop);
		DragUtil.elementDragged.style.left = (e.clientX - DragUtil.offsetLeft)  + "px";
		DragUtil.elementDragged.style.top = (e.clientY - DragUtil.offsetTop) + "px";
	},
}