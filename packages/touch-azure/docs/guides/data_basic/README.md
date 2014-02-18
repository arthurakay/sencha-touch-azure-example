# Walkthrough: Mobile Services "data" - Basic example

The [Basic](#!/example/Basic) sample application is a bare-bones example demonstrating the simplest parts of the Azure Mobile Services API - connecting to data. You can view the full source code in the download package by opening the /examples/data/Basic folder.

## app.js

The first thing you'll notice is that we set the Ext.Loader paths so that Sencha Touch can find the source files for the Ext.azure classes:

    Ext.Loader.setConfig({
        enabled : true,
        paths   : {
            'Ext'       : 'touch/src',
            'Ext.azure' : 'packages/touch-azure/src'
        }
    });

Next, we need to configure Azure for our application. In this example we created an application configuration property called **azure**, and then passed that property to Ext.Azure.init.

You can also provide a configuration object directly to Ext.Azure.init, but creating an application property object as shown below allows you to easily locate the Azure configuration values for updates or additions :

    Ext.application({
        name : 'Basic',

        requires : [
            'Ext.MessageBox',
            'Ext.azure.Azure'
        ],

        //...

        azure : {
            appUrl : 'YOUR-APP-URL',
            appKey : 'YOUR-APP-KEY'
        },

        //...

        launch : function () {
            // Destroy the #appLoadingIndicator element
            Ext.fly('appLoadingIndicator').destroy();

            // Initialize Azure
            Ext.Azure.init(this.config.azure);

            // Initialize the main view
            Ext.Viewport.add(Ext.create('Basic.view.Main'));
        },

        //...

    });

The important parts:

  - adding Ext.azure.Azure to the **requires** block
  - adding the **azure** config object with your *appKey* and *appUrl*
  - calling Ext.Azure.init() inside your launch() method

## app/model/TodoItem.js

We must also set the correct proxy on our data model (or store). In our example, we chose to place the proxy on the Model:

    Ext.define('Basic.model.TodoItem', {

        //...

        proxy : {
            type               : 'azure',
            tableName          : 'TodoItem',
            enablePagingParams : true
        }
    });

Be sure that the *tableName* property matches the name of the table you defined in your Azure Mobile Services portal!

## app/controller/Main.js

The premise of this sample app is showcase the basic CRUD operations available in the Azure Mobile Services API:

  - add new items to the TodoItem table (CREATE)
  - list items in the TodoItem table (READ)
  - update existing items in the TodoItem table (UPDATE - double-tap on any record in the list)
  - remove items from the TodoItem table (DELETE - single-tap on any record in the list)

Our *Main.js* controller handles each of these operations in separate handlers.

For example, adding a new TodoItem:

    onAddItem : function () {
        var me = this,
            rec,
            store = Ext.getStore('TodoItems'),
            field = me.getTodoField(),
            value = field.getValue();

        if (value === '') {
            Ext.Msg.alert('Error', 'Please enter Task name', Ext.emptyFn);
        }
        else {
            rec = Ext.create('Basic.model.TodoItem', {complete : false, text : value});
            store.insert(0, rec); //insert at the top
            field.setValue('');
        }
    }

By simply adding, removing, or editing a record in the data store the Ext.azure.Proxy automatically handles
the appropriate REST call and synchronizes your data with the remote database. It's that easy!