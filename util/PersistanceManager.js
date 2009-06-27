
/**
 * Responsible for writing all the data to the persistant layer we have.
 * This is responsible for the GET and SET of associative arrays only
 * For now this is the GreaseMonkey Local Store. This may be an OpenID Attribute Server later
 */
var PersistanceManager = 
{
	MAP_SEPARATOR : ":",
	
	/**
	 * Gets a map from the persistant storrage
	 */
	getMap : function(mapName)
	{
		var result = GM_getValue(mapName);
		result = eval('(' + result + ')');
		return result;
	},
	
	/**
	 * Saves an entire Map to the persistance GM store
	 */
	persist : function (mapName, map)
	{ 
		var mapSerialized = "";
		mapSerialized = PersistanceManager.serializeObject(map);

		Logger.log("Saved "  + mapName + " = "+  mapSerialized);
		GM_setValue(mapName,mapSerialized);
	},

	/**
	 * Serialization of Object
	 */
	serializeObject : function(data)
	{
		var result = "{";
		for (key in data)
		{
			key += "";
			result += "'"+ key.replace("'","\\'","\g") + "'" + PersistanceManager.MAP_SEPARATOR;
			if (typeof(data[key]) == "object")
			{
				result += PersistanceManager.serializeObject(data[key]);
			}
			else 
			{
				data[key] += ""
				result += "'" + data[key].replace("'","\\'","\g") + "'";
			}
			result += ","
		}
		
		result += "}"
		return result;
	},
}
