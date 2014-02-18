# Using Windows Azure Custom APIs in your App

This guide explains how to add custom APIs you create in the Azure portal to your Azure proxy. If you have not already done so, it is advised that you are familiar with configuring Azure data services within your Touch application. More information about this is available in the [Getting Started with Data in Azure Mobile Services](#!/guide/mobile_services_data) guide.

In Windows Azure, a custom API enables you to define custom functions within the Azure mobile service that are made available to your application. These functions do not map to the standard INSERT, UPDATE, DELETE, or READ operations. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON.

## Creating Custom APIs in Windows Azure

First, you'll need to follow some of the setup instruction in the Azure [Call a Custom API](https://www.windowsazure.com/en-us/develop/mobile/tutorials/call-custom-api-js/) tutorial. Specifically, you'll need to follow step #1: **Define the custom API** (steps #2 & #3 can be ignored).

## Adding Custom APIs to the Azure Proxy

Once your custom API has been configured in the Azure Portal, you will need to tell your application's Azure proxy the name of the API it will be using. This is done in the proxy configuration using the **customApiName** property:

	Ext.define('todo.store.TodoItems', {
    	extend : 'Ext.data.Store',

	    requires: [
    	    'todo.model.TodoItem',
    	    'Ext.azure.Proxy'
    	],

	    config : {
    	    model        : 'todo.model.TodoItem',
	        autoSync     : true,

	        proxy : {
    	        type          : 'azure',
                customApiName : 'YOUR_API_NAME'
        	}
    	}
	});

When a **customApiName** property is defined in an Azure proxy, requests are no longer directed to the default data endpoints but instead sent to the following endpoint: 

  * https://YOUR_AZURE_SERVICE.azure-mobile.net/api/YOUR_API_NAME

Your next step is to ensure that the server-side logic of your API is defined and functioning correctly. You may add your server-side logic to the API via the "Scripts" tab in your Azure portal per the [Call a Custom API](https://www.windowsazure.com/en-us/develop/mobile/tutorials/call-custom-api-js/) tutorial.