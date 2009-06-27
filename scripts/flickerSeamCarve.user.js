// ==UserScript==
// @name          Flickr Seam Carver
// @namespace     http://dy-verse.blogspot.com/seamcarving
// @description	  Adds a link to the flickr download page to get a seam carved image
// @include       http://www.flickr.com/photo_zoom.gne*

// ==/UserScript==


/**
 * Main file that adds a link to seam carve the image
 */
var FlickrSeam = 
{
	seamService : "http://121.241.134.241/seam/image?",

	/**
	 * Adds the required HTML to the page
	 */
	init : function()
	{
		// no direct way to get to the links, thats why this is there
		var seamLink = document.createElement("td");
		 
		var docPos = '<center><a href="javascript:FlickrSeam.carveImage()">' 
					+ 'Seam Carved'
					+ '</a></center>' 
					+ '<form >'
					+ '<span class="Dimensions">(<input style="border:SOLID 1px #999999;padding:1px" size="2" class = "Dimensions "id = "seamWidth"> x <input size = "2" style="border:SOLID 1px #999999;padding:1px" class = "Dimensions" id = "seamHeight">)</span>'
					+'</form>';
		seamLink.innerHTML = docPos;
		unsafeWindow.document.body.childNodes[5].childNodes[1].childNodes[1].childNodes[0].appendChild(seamLink);
		
		this.seamLink = seamLink;
		this.imageUrl = document.body.childNodes[5].childNodes[5].childNodes[0].src;

		//appending the input box for the energy function 
		var energizer = document.createElement("td");
		energizer.innerHTML = 'Energy :<input id = "enegryFile" type = "text" style="border:SOLID 1px #999999;padding:1px" size="12" class = "Dimensions "> ';
		unsafeWindow.document.body.childNodes[5].childNodes[1].childNodes[1].childNodes[0].appendChild(energizer);
		
		var loader = document.createElement("td");
		loader.innerHTML = "<img src = 'http://www.napyfab.com/ajax-indicators/images/indicator.gif' id = 'loaderIMG' style = 'display:none'>"
		unsafeWindow.document.body.childNodes[5].childNodes[1].childNodes[1].childNodes[0].appendChild(loader);		
	},
	
	carveImage : function()
	{
		var imageLoc = document.body.childNodes[5].childNodes[5].childNodes[0];
		var energyName = document.getElementById("enegryFile").value;
		var width = document.getElementById("seamWidth").value;
		var height = document.getElementById("seamHeight").value;
		
		imageLoc.style.width = width;
		imageLoc.style.height = height;
		imageLoc.id = "flickr_image_seam";
		this.seamLink.style.backgroundColor = "#EEEEEE";
		
		document.getElementById("loaderIMG").style.display = "block";
		imageLoc.src = this.seamService + "file=" + this.imageUrl + "&height=" + height + "&width=" + width + "&energy=" + energyName;
		/*imageLoc.onload = function(){document.getElementById("loaderIMG").style.display = "none";}
		imageLoc.onerror = function(){document.getElementById("loaderIMG").style.display = "none";}
		this.correctLinks();*/
	},
	
	correctLinks : function()
	{
		var carvedUrl = document.getElementById("flickr_image_seam").src;

		this.seamLink.innerHTML = this.seamLink.innerHTML.replace("Seam Carved", "<strong>Seam Carved</strong>")
		
		var rowStart = unsafeWindow.document.body.childNodes[5].childNodes[1].childNodes[1].childNodes[0];
		for (var i = 3; i < rowStart.childNodes.length - 2; i+=2)
		{
			if (rowStart.childNodes[i].childNodes[1] && rowStart.childNodes[i].childNodes[1].nodeName == "STRONG")
			{
				rowStart.childNodes[i].style.backgroundColor = "#FFFFFF";
				rowStart.childNodes[i].innerHTML = rowStart.childNodes[i].innerHTML.replace(/strong/g,"a");
				rowStart.childNodes[i].childNodes[1].href = document.location;
				break;
			}
			
		}
		// changing the links in the text box
		var linkDiv = unsafeWindow.document.body.childNodes[7];
		if (linkDiv.childNodes[5])
		{
			linkDiv.childNodes[5].childNodes[0].innerHTML = linkDiv.childNodes[5].childNodes[0].innerHTML.replace(this.imageUrl, carvedUrl);
			linkDiv.childNodes[9].childNodes[0].value = carvedUrl;
		}  
		
		var downloadDiv = document.body.childNodes[5].childNodes[3].childNodes[1].childNodes[2];
		downloadDiv.href = carvedUrl;
		downloadDiv.innerHTML = "Download the Seam Carved Size";
	}
	
	
	
}

unsafeWindow.FlickrSeam = FlickrSeam;
FlickrSeam.init();