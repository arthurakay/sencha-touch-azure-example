# Walkthrough: Storage Services example

The Storage sample application is a bare-bones example demonstrating the simplest parts
of the Azure Storage Services API. You can view the full source code in the download package
by opening the /examples/storage/TouchApp folder.

## Notes

Currently, Windows Azure does not support cross-domain (CORS) requests to the Storage Services API As a result, Ext.azure.storage.Table and Ext.azure.storage.Blob will **only work in a natively packaged application**.

## app.json

In order to connect to the Azure Storage Services, Ext.Azure requires a third-party encryption library: CryptoJS.

This library ships with the Ext.Azure download -- but needs to be manually included in your app.json file.

    "js": [
        {
            "path": "touch/sencha-touch.js",
            "x-bootstrap": true
        },
        {
            "path": "bootstrap.js",
            "x-bootstrap": true
        },
        {
            "path": "app.js",
            "bundle": true,  /* Indicates that all class dependencies are concatenated into this file when build */
            "update": "delta"
        },

        /* INCLUDE THESE TWO FILES */
        {
            "path": "packages/touch-azure/resources/CryptoJS v3.1.2/rollups/hmac-sha256.js",
            "update": "full"
        },
        {
            "path": "packages/touch-azure/resources/CryptoJS v3.1.2/components/enc-base64.js",
            "update": "full"
        }
    ],


## app.js

In app.js, you'll notice is that we set the Ext.Loader paths:

    Ext.Loader.setConfig({
        enabled : true,
        paths   : {
            'Ext'       : 'touch/src',
            'Ext.azure' : 'packages/touch-azure/src'
        }
    });

Next, we include Ext.azure.Azure in our Ext.application():

    Ext.application({
        name : 'Storage',

        requires : [
            'Ext.MessageBox',
            'Ext.azure.Azure'
        ],

        //...

    });

One other thing you'll notice is that we didn't configure any of the standard **Ext.azure.Azure** bits, or call **Ext.Azure.init()**. The Windows Azure Storage Services don't use the same account/key as the Mobile Services, so we will configure the account/key directly on the Storage classes.


## app/controller/Table.js

Inside our Table controller we see a number of event handlers - one for each button on the "Table Storage" tab. Additionally, we see a **launch()** method which configures our Azure Table Storage account:

    launch : function () {
        this.table = Ext.create('Ext.azure.storage.Table', {
            accountName : 'YOUR_ACCOUNT_NAME',
            accessKey   : 'YOUR_ACCOUNT_KEY'
        });
    },

Next we'll take a look at how the Ext.azure.storage.Table class connects to the Storage Services API. For example, querying the list of tables currently in our Storage account:

    onQueryTablesTap : function () {
        this.table.queryTables(
            {},
            this.successHandler,
            this.failureHandler
        );
    },

Ext.azure.storage.Table automatically sets the correct HTTP headers and formats any data to be sent to the Azure Storage API.

## app/controller/Blob.js

Inside our Blob controller we see a number of event handlers - one for each button on the "Blob Storage" tab. Additionally, we see a **launch()** method which configures our Azure Blob Storage account:

    launch : function () {
        this.blob = Ext.create('Ext.azure.storage.Blob', {
            accountName : 'YOUR_ACCOUNT_NAME',
            accessKey   : 'YOUR_ACCOUNT_KEY'
        });
    },

Next we'll take a look at how the Ext.azure.storage.Blob class connects to the Storage Services API. For example, querying the list of containers currently in our Storage account:

    onListContainersTap : function () {
        this.blob.listContainers(
            {},
            this.successHandler,
            this.failureHandler
        );
    },

Ext.azure.storage.Blob automatically sets the correct HTTP headers and formats any data to be sent to the Azure Storage API.
