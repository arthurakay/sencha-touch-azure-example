Data
====

Windows Azure provides you with data storage facilities for your mobile service. This data storage provides you with flexible tables with standard column types (eg. string, boolean, integer). Your service may create as many tables as your application may require, each with unlimited storage capabilities.

**Sencha Touch Extensions for Windows Azure** easily allows you to connect your Sencha Touch models and stores to these data services by means of a special proxy type, **azure**, defined in the package.

Creating a Data Table
---
To create a data service table for use within your Sencha Touch application log into the [Windows Azure](http://www.windowsazure.com) portal, navigate to **Mobile Services** and select an existing service. If you do not have any services defined, you must first do so by clicking the **+New** button in the left hand corner of the portal bottom toolbar. Help is available on the Azure portal to guide you through this process.

Once you click on a mobile service name, you will be presented with that service's dashboard. Select the **Data** menu item to view available tables (the list will be empty if you have no tables defined) and click the **Create** button on the bottom toolbar.

From here just choose a name for your table. This name will be used in the configuration of your proxy. You do not need to define any fields at this time. Azure is quite flexible and can (and will) automatically create fields to match the definition of your model fields within your Sencha Touch application. You will note that along with a table name, you may choose table permission, which can initially be left at the default of 'Anybody with the Application Key'. Click **save** to create the table. That's all there is to it.

At this time you can define fields for your table or let Azure create fields for you when any application attempts to insert data into the table.

For more information, please see the Azure [Getting Started with Data](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-data-html/) guide.


Configuring the Azure Proxy
---
**Note**: It is assumed that you have already downloaded, installed and configured your application with the Sencha Touch Azure package. Please review the [Downloading & Including Azure](/#!/guide/including_azure) guide for more information on these steps.

Using your Mobile Service data **table name**, you can configure the **azure** proxy to communicate with it, allowing it to insert, modify and remove records from within your Sencha Touch application.

You can define the proxy in either a **model** or **store** configuration. Note that if you define the proxy at the model level, all stores which use that model will automatically retrieve and store its data from the data table associated with the proxy configuration. To use several stores, all of which access different Azure service data tables, yet use the same model definition, it would be best to configure the proxy in the store (as shown below) rather than at the model level.

	
	Ext.define('myApp.model.TodoItem', {
    	extend : 'Ext.data.Model',

	    config : {
    	    idProperty : 'id',
        	fields     : [ 'id', 'text', 'completed' ]
	    }
	});

	Ext.define('myApp.store.TodoItems', {
    	extend : 'Ext.data.Store',

	    requires: [
    	    'myApp.model.TodoItem',
    	    'Ext.azure.Proxy'
    	],

	    config : {
    	    model        : 'myApp.model.TodoItem',
	        autoSync     : true,

	        proxy : {
    	        type               : 'azure',
        	    tableName          : 'TodoItem'
        	}
    	}
	});	

Proxies, Stores and Auto Sync 
---
As with all other proxies within Sench Touch, the **azure** proxy type responds to the store configuration **autoSync**. This configuration allows a store to automatically synchronize data changes with the remote Azure Mobile service data table associated with the proxy. This is a nice convenience configuration for the store which removes the need to manually call the store.sync() method after any store updates. 

**Note**: If you forsee that your application will be doing many updates to the store, you may wish to decide to not use the autoSync feature as high volume updates could cause issues with application speed. In this case you should manually synchronize your store after a series of store modifications have finished.

Data Authentication
---
Access to your data services can be configured with security in mind. One of the nice features of Azure is that you can define Read, Write, Insert and Delete privileges on any of your data tables. 

For more information regarding Authentication and how to secure your table data, please refer to the [Authentication](#!/guide/mobile_services_authentication) guide.