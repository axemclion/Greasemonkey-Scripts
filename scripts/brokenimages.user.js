// ==UserScript== 
// @name                broken images 
// @namespace           tag:zzedar@gmail.com,2006-01-20:brokenimages
// @description         show broken image outlines 
// @include             *
// ==/UserScript== 

var allImgs, thisImg;
allImgs = document.getElementsByTagName('img');
heights = new Array(allImgs.length);
widths = new Array(allImgs.length);

for (var i = 0; i < allImgs.length; i++)
{
	thisImg = allImgs[i];
	if
	(
		(thisImg.getAttribute('height') != 0) &&
		(thisImg.getAttribute('width') != 0) &&
		!(thisImg.width * thisImg.height) &&
		(thisImg.getAttribute('src'))
	)
	{
		heights[i] = thisImg.getAttribute('height');
		widths[i] = thisImg.getAttribute('width');
		thisImg.setAttribute('height', 24);
		thisImg.setAttribute('width', 24);
		thisImg.style.cssText += '-moz-force-broken-image-icon:1';
		thisImg.addEventListener
		(
			'load',
			function()
			{
				this.setAttribute('height', heights[i]);
				this.setAttribute('width', widths[i]);
			},
			true
		);
	}
}
