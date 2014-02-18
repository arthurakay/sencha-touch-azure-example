Ext.data.JsonP.architect({"guide":"<h1 id='architect-section-using-ext.azure-in-sencha-architect-3.x'>Using Ext.Azure in Sencha Architect 3.x</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/architect-section-creating-an-architect-project-with-ext.azure'>Creating an Architect Project with Ext.Azure</a></li>\n<li><a href='#!/guide/architect-section-creating-a-store-with-ext.azure.proxy'>Creating a Store with Ext.azure.Proxy</a></li>\n</ol>\n</div>\n\n<p>If you have read the <a href=\"#!/guide/including_azure-section-downloading-and-installing-the-sencha-touch-azure-extension\">Including Azure in your Application</a> guide,\nthen you will have downloaded the <a href=\"#!/api/Ext.Azure\" rel=\"Ext.Azure\" class=\"docClass\">Ext.Azure</a> package in one of two ways:</p>\n\n<ol>\n<li>You have manually downloaded the package ZIP file from Sencha Market, or</li>\n<li>You have used Sencha Cmd to install the package in your local repo</li>\n</ol>\n\n\n<p>In order to consume <a href=\"#!/api/Ext.Azure\" rel=\"Ext.Azure\" class=\"docClass\">Ext.Azure</a> inside Sencha Architect, you will need to copy the package contents into the following directory:</p>\n\n<pre><code>/Users/johndoe/Documents/Architect/Extensions/touch-azure/1.0.0/\n</code></pre>\n\n<p><strong>Note:</strong> This is an example filepath for Mac OS X (and using version 1.0.0 of our package). Please make the necessary\nadjustments for your platform and package version - see the <a href=\"http://docs.sencha.com/architect/3/#!/guide/ux_extend\">Architect 3 docs</a>\nfor more information.</p>\n\n<h2 id='architect-section-creating-an-architect-project-with-ext.azure'>Creating an Architect Project with Ext.Azure</h2>\n\n<p>Assuming you have moved the files to the appropriate location, simply create a new Sencha Touch project\n(2.3.x or higher) inside Sencha Architect. You should now see \"touch-azure\" listed in the \"Extensions\" area\nof the Architect toolbox with a few classes.</p>\n\n<p>Because of the way in which Architect consumes user extensions, you must include the \"Azure Controller\" in your application\nby dragging the class from your toolbox into your Project Inspector under \"Controllers\". This will automatically initialize\n<a href=\"#!/api/Ext.Azure\" rel=\"Ext.Azure\" class=\"docClass\">Ext.Azure</a> with the settings we define next.</p>\n\n<p>Now click on \"Application\" in your Project Inspector, and then type \"azure\" into your configuration pane. (The \"azure\"\nconfig doesn't actually exist, so click the \"Add\" button.) Set this to type \"Object\" and then edit its value to look something\nlike this:</p>\n\n<pre><code>    {\n        appKey: 'myazureservice-access-key',\n        appUrl: 'myazure-service.azure-mobile.net'\n    }\n</code></pre>\n\n<p>At this point, you can use any class in the Ext.azure namespace in your application code!</p>\n\n<h2 id='architect-section-creating-a-store-with-ext.azure.proxy'>Creating a Store with Ext.azure.Proxy</h2>\n\n<p>Let's create a Store using the \"Azure Store\" class - a convenience class which creates both the Store and a proxy\nconfigured to connect with Windows Azure. You simply need to add the \"tableName\" or \"customApiName\" configs as necessary.</p>\n\n<p><strong>Note:</strong> If this is a global store, you cannot set \"autoLoad\" to true because we must wait until after <a href=\"#!/api/Ext.Azure\" rel=\"Ext.Azure\" class=\"docClass\">Ext.Azure</a> has\nfinished initialization. Also ignore the proxy warnings about the undefined \"url\" config.</p>\n","title":"Using Ext.Azure with Sencha Architect"});