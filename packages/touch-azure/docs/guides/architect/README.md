Using Ext.Azure in Sencha Architect 3.x
===

If you have read the [Including Azure in your Application](#!/guide/including_azure-section-downloading-and-installing-the-sencha-touch-azure-extension) guide,
then you will have downloaded the Ext.Azure package in one of two ways:

1. You have manually downloaded the package ZIP file from Sencha Market, or
2. You have used Sencha Cmd to install the package in your local repo

In order to consume Ext.Azure inside Sencha Architect, you will need to copy the package contents into the following directory:

    /Users/johndoe/Documents/Architect/Extensions/touch-azure/1.0.0/

**Note:** This is an example filepath for Mac OS X (and using version 1.0.0 of our package). Please make the necessary
adjustments for your platform and package version - see the [Architect 3 docs](http://docs.sencha.com/architect/3/#!/guide/ux_extend)
for more information.


Creating an Architect Project with Ext.Azure
---

Assuming you have moved the files to the appropriate location, simply create a new Sencha Touch project
(2.3.x or higher) inside Sencha Architect. You should now see "touch-azure" listed in the "Extensions" area
of the Architect toolbox with a few classes.

Because of the way in which Architect consumes user extensions, you must include the "Azure Controller" in your application
by dragging the class from your toolbox into your Project Inspector under "Controllers". This will automatically initialize
Ext.Azure with the settings we define next.

Now click on "Application" in your Project Inspector, and then type "azure" into your configuration pane. (The "azure"
config doesn't actually exist, so click the "Add" button.) Set this to type "Object" and then edit its value to look something
like this:

        {
            appKey: 'myazureservice-access-key',
            appUrl: 'myazure-service.azure-mobile.net'
        }

At this point, you can use any class in the Ext.azure namespace in your application code!


Creating a Store with Ext.azure.Proxy
---

Let's create a Store using the "Azure Store" class - a convenience class which creates both the Store and a proxy
configured to connect with Windows Azure. You simply need to add the "tableName" or "customApiName" configs as necessary.

**Note:** If this is a global store, you cannot set "autoLoad" to true because we must wait until after Ext.Azure has
finished initialization. Also ignore the proxy warnings about the undefined "url" config.