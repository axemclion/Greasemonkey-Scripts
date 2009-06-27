/* This is the command to add a bookmark to delicious */
CmdUtils.CreateCommand(
{
    name: "abookmark",
    icon: "http://l.yimg.com/hr/10363/img/delicious.20.gif",
    homepage: "http://dy-verse.blogspot.com",
    author: 
    {
        name: "Parashuram",
        email: "n.parashuram@gmail.com"
    },
    license: "GPL",
    description: "Automatically adds a delicious bookmark for the existing page. Optionally, adds tags, description, etc",
    help: "Bookmark the existing page to your delicious account. Tags and Notes to the page are automatically added using external services.",
    takes: 
    {
        "url": noun_arb_text
    },
    
    preview: function(pblock, url)
    {
        var template = "Bookmarking ${name} on delicious"
        pblock.innerHTML = CmdUtils.renderTemplate(template, 
        {
            "name": Utils.url(Application.activeWindow.activeTab.document.documentURI).spec
        });
    },
    
    execute: function(notes)
    {
        CmdUtils.log("Getting Tags from Cloud Seeder");
        this.notes = notes;
        this.url = Utils.url(Application.activeWindow.activeTab.document.documentURI).spec;
        this.desc = Application.activeWindow.activeTab.document.title
        this.getTags();
    },
    
    getTags: function()
    {
        var postUrl = "http://pipes.yahoo.com/pipes/pipe.run"
        var params = 
        {
            "_id": "GGBgNrDK3RGsWw_fPxJ3AQ",
            "_render": "json",
            "url": (this.url)
        }
        
        this.tags = [];
        CmdUtils.log("Getting tags for the page using YAHOO PIPES " + this.url);
        var curObj = this;
        jQuery.ajax(
        {
            data: params,
            url: postUrl,
            type: "GET",
            dataType: "json",
            error: function()
            {
                displayMessage("Error Posting to delicious");
                CmdUtils.log("Error getting tags for the current page");
                curObj.postToDelicious();
            },
            success: function(data)
            {
                displayMessage("Sucessfully generated tags for this page");
                CmdUtils.log(data);
                for (var i = 0; i < data.value.items.length; i++) 
                {
                    curObj.tags.push(data.value.items[i].content);
                }
                curObj.postToDelicious();
            }
        });
    },
    
    postToDelicious: function()
    {
        var postUrl = "https://api.del.icio.us/v1/posts/add"
        var params = 
        {
            "url": this.url,
            "description": this.desc,
            "extended": this.notes.text,
            "tags": this.tags.join(" "),
            "dt": "",
            "replace": "yes",
            "shared": "yes"
        }
        CmdUtils.log("Posting to delicious");
        jQuery.ajax(
        {
            type: "POST",
            url: postUrl,
            data: params,
            dataType: "xml",
            error: function()
            {
                displayMessage("Error Posting to delicious");
            },
            success: function(data)
            {
                displayMessage(data.getElementsByTagName("result")[0].getAttribute("code"));
                CmdUtils.log(data.getElementsByTagName("result")[0].getAttribute("code"));
            }
        });
    }
});
