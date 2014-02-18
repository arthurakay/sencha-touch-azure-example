Configuring Azure
====

Once you have successfully downloaded and installed the Azure extension and included it in your application, the final step is to supply your application with your Azure mobile service access credentials. 

Prerequisites
---

Before continuing with this section, you are required to have already setup an Azure mobile service that your application will be using. 

When you create a mobile service in Azure (see [Getting Started with Azure](#!/guide/getting_started)) an application key and URL will be assigned to that service. This information must be provided to your Azure package so it can connect to your service.


Basic Azure Initialization
---
The Azure package is initialized by calling the **Ext.Azure.init** method in the launch section of your application. This method is passed a configuration object containing mobile service creditials as well as other creditials and features you wish to utilize.

While you can pass the configuration object directly to the init method, we suggest creating a Sencha application configuration property called **azure** and placing all the appropriate information there. You can then pass this property value to the Ext.Azure.init method.

This example shows a very simple Azure configuration and initialization supplying only the application key and URL. You would, of course, be providing the actual key and url for your mobile service in place of the example values shows here:

    Ext.application({
        name: 'MyApp',

        requires: [ 'Ext.azure.Azure' ],

        azure: {
            appKey: 'myazureservice-access-key',
            appUrl: 'myazure-service.azure-mobile.net'
        },

        launch: function() {

            // Call Azure initialization

            Ext.Azure.init(this.config.azure);

        }
    });

For more detailed information on the Azure configuration options, please consult the Ext.Azure API documentation.

Configuring the Azure data proxy
----

Providing the application key and URL allows your application to connect to the service. However it does not provide any information about the service itself and tables within the service that are available to your application. 

You provide table information by configuring data proxies in your application models or stores. The proxy only needs to be set to type **azure** and be provided with a service tablename. The model fields are used to identify the columns you created in your Azure mobile service table.

In this example, we configure our data model with an Azure proxy and specify a **tableName** of 'ToDoItem'. The **tableName** config tells the proxy which Azure database table to use.


        Ext.define('MyApp.model.TodoItem', {
            extend : 'Ext.data.Model',

            requires : [
                'Ext.azure.Proxy'
            ],

            config : {
                idProperty : 'id',
                fields     : [
                    {
                        name : 'id',
                        type : 'int'
                    },
                    {
                        name : 'text',
                        type : 'string'
                    },
                    {
                        name : 'complete',
                        type : 'boolean'
                    }
                ],

                proxy : {
                    type        : 'azure',
                    tablename   : 'TodoItem'
                }
            }
        });


The Azure proxy will automatically set all HTTP headers with the appropriate CRUD operations expected by the Azure API (including authentication credentials, if they exist).

Congratulations! Your application should now have access to your Azure mobile service.

