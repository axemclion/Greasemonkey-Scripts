
/*
 This is a command to linkify the selected text with search results in Google
 Particularily useful to insert links while blogging
 */
CmdUtils.CreateCommand(
{
    /**
     * Command Descriptors
     */
    author: 
    {
        name: "Parashuram",
        email: "n.parashuram@yahoo.co.in"
    },
    name: "linkify",
    icon: "http://www.google.com/favicon.ico",
    homepage: "http://dy-verse.blogspot.com/search/label/ubiquity",
    license: "GPL",
    description: "This is a command to linkify the selected text with 'n'th search result link in Google",
    help: "This is a command to linkify the selected text with 'n'th search result link in Google. Just select the text to linkify, and give teh search result number as the arguement to insert that link.",
    
    /**
     * Command variables
     */
    appId: "dLS1WgbV34HPanHaqoe6u2pJz0KnkMGMIXHhC6ZcdECyhj8e3199HRGbIqWvBXPR",
    takes: 
    {
        "what": noun_arb_text
    },
    modifiers: 
    {
        "with": noun_arb_text
    },
    searchResultList: null,
    searchRequest: null,
    
    /**
     * stores a given key in a global space so that it can be retrieved between command invocation by ubiquity
     * @param {Object} key
     * @param {Object} value
     */
    setGlobal: function(key, value)
    {
        if (typeof window["_ubiquityVar"] === "undefined") 
        {
            window["_ubiquityVar"] = {};
        }
        window["_ubiquityVar"][key] = value;
    },
    
    /**
     * Gets a key from the global storage
     * @param {Object} key
     */
    getGlobal: function(key)
    {
        if (typeof window["_ubiquityVar"] !== "undefined") 
        {
            return window["_ubiquityVar"][key];
        }
    },
    
    /**
     * preview function called by ubiquity
     * @param {Object} pblock
     * @param {Object} input
     * @param {Object} mods
     */
    preview: function(pblock, input, mods)
    {
        var searchTerm = (CmdUtils.getSelection() === "") ? input.text : CmdUtils.getSelection();
        if (searchTerm === "") 
        {
            return;
        }
        
        if (searchTerm === this.getGlobal("searchTerm") && pblock.innerHTML !== "") 
        {
            return;
        }
        pblock.innerHTML = "Loading search results, please wait...."
        this.previewDiv = pblock;
        this.setGlobal("searchTerm", searchTerm);
        this.getSearchResults(searchTerm, this.renderResults);
    },
    
    /**
     * Called when a command is executed
     * @param {Object} input
     * @param {Object} mods
     */
    execute: function(input, mods)
    {
        this.getSearchResults(input.text, function(searchResultList)
        {
            var url = (mods["with"].text == CmdUtils.getSelection()) ? 1 : mods["with"].text;
            if (!isNaN(parseInt(url))) 
            {
                url = searchResultList[parseInt(url) - 1].url;
                if (typeof url === "undefined") 
                {
                    displayMessage("Search result " + parseInt(url) + " not found.")
                }
            }
            
            CmdUtils.log("Search Complete, linkifying with " + url);
            
            var oldText = CmdUtils.getSelection();
            var spaces = 0;
            while (oldText.lastIndexOf(" ") == oldText.length - 1) 
            {
                spaces++;
                oldText = oldText.substr(0, oldText.length - 1)
            }
            
            var newText = CmdUtils.renderTemplate("<a href='${url}'>${text}</a>", 
            {
                "text": oldText,
                "url": url,
            });
            
            
            for (var i = 0; i < spaces; i++) 
            {
                newText = newText + " ";
            }
            
            CmdUtils.setSelection(newText);
            displayMessage("Selected Text linkified with " + url);
        });
    },
    
    /**
     * Renders the list of search results in the preview mode
     * @param {Object} searchResultList
     */
    renderResults: function(searchResultList)
    {
        CmdUtils.log("Search Complete, rendering results ");
        var pblock = this.previewDiv;
        
        var searchHTML = "<li style = 'border-bottom : BLACK 1px DASHED'><a href = '${link}'><span style = 'font-weight:bold; color : blue; text-decoration:underline'>${title}</span></a><br><span style = 'color:green'>${link}</span><br><span style = 'font-size : 0.9em' >${summary}</span></li>"
        var resultDiv = ["<div style = 'background-color : #FFFFFF; color : #000000; overflow : scroll; height : 500px'><ol>"];
        resultDiv.push("<div style = 'font-size : 1.1em'>Searching for : <span style = 'color : RED; font-size : 1.1em' >" + this.getGlobal("searchTerm") + "</span></div>")
        searchResultList.forEach(function(elem)
        {
            var result = CmdUtils.renderTemplate(searchHTML, 
            {
                "title": elem["title"],
                "summary": elem["abstract"],
                "link": elem["url"]
            });
            resultDiv.push(result);
        });
        resultDiv.push("</ol></div>")
        pblock.innerHTML = resultDiv.join('');
        this.searchResultList = searchResultList;
    },
    
    /**
     * Gets search results from YAHOO
     * @param {Object} searchTerm
     * @param {Object} successCallback
     */
    getSearchResults: function(searchTerm, successCallback)
    {
        if (typeof this.searchRequest !== "undeinfed" && this.searchRequest != null) 
        {
            this.searchRequest.abort();
            CmdUtils.log("Aborting an older search request");
        }
        
        bossUrl = "http://boss.yahooapis.com/ysearch/web/v1/${query}?appid=${appId}&format=${format}"
        var updateUrl = CmdUtils.renderTemplate(bossUrl, 
        {
            "format": "json",
            "appId": this.appId,
            "query": searchTerm
        });
        
        var currentObject = this;
        this.searchRequest = jQuery.ajax(
        {
            type: "GET",
            url: updateUrl,
            dataType: "json",
            error: function(data)
            {
                displayMessage("Error fetching Search results");
            },
            success: function(data)
            {
                successCallback.call(currentObject, data.ysearchresponse.resultset_web);
            }
        });
        CmdUtils.log("Searching for term .. " + searchTerm);
    }
});

