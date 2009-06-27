
/**
 * A generic Logger utility. Writes to a DIV that is created, 
 * or to GM_log / FireBug Console
 */
var Logger = 
{
	DEBUG : 3,
	INFO  : 2,
	ERROR : 1,
	NONE  : 0,

	logLevel : 3,
	logOnFirebug : true,
	loggerDiv : null,
	className : null,
	
	/**
	 * Used to initialise the Logger Dialog
	 */
	init : function(className)
	{
		if (typeof(unsafeWindow.console) != "undefined" && typeof(unsafeWindow.console.clear) != "undefined")
		{
			unsafeWindow.console.clear();
		}
		Logger.console = unsafeWindow.console;
		Logger.className = className;
	},
	
	/**
	 * Shows a message to the user.
	 */
	log : function(message,level)
	{
		if (typeof(level) == "undefined")
		{
			level = Logger.DEBUG;
		}

		message = "[" + Logger.className + "] " + level  + " : " + message;
		// write the debug message to the unsafeWindow.console
		if (Logger.logLevel >= level)
		{
			if (typeof(unsafeWindow.console) != "undefined" && Logger.logOnFirebug == true)
			{
				Logger.console.log(message)	
			}
			if (typeof(GM_log) != "undefined")
			{
				GM_log(message);
			}
		}
	}
}
Logger.init();