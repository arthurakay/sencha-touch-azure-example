# Azure Storage: Table Storage REST APIs

With a [Windows Azure Storage Account](https://www.windowsazure.com/en-us/documentation/services/storage/) you can store large amounts of unstructured data in the [Table Storage Service](https://www.windowsazure.com/en-us/develop/net/how-to-guides/table-services/)
The service is a NoSQL datastore which accepts authenticated calls from inside and outside the Windows Azure cloud. Windows Azure tables are ideal for storing structured, non-relational data.

## Setup - app.json

In order to correctly sign the authentication headers for Azure, we first need to include an encryption library. Ext.Azure ships with CryptoJS for this very purpose.

In your app.json file, simply add two files to your "js" array:

    "js": [
        {
            "path": "touch/sencha-touch.js",
            "x-bootstrap": true
        },
        {
            "path": "app.js",
            "bundle": true,  /* Indicates that all class dependencies are concatenated into this file when build */
            "update": "full"
        },

        /* ADD THESE TWO ITEMS */
        {
            "path": "path/to/azure/resources/CryptoJS v3.1.2/rollups/hmac-sha256.js",
            "update": "full"
        },
        {
            "path": "path/to/azure/resources/CryptoJS v3.1.2/components/enc-base64.js",
            "update": "full"
        }
    ],

With CryptoJS in place, the Azure Storage API can now be successfully authenticated via HTTP headers.

## Ext.azure.storage.Table

The Ext.azure.storage.Table class acts as a wrapper for the [Azure Table Service REST API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179423).

     var table = Ext.create('Ext.azure.storage.Table', {
         accountName : 'YOUR_ACCOUNT_NAME',
         accessKey   : 'YOUR_ACCESS_KEY'
     });

     table.createTable(
          {
              properties : [
                  {
                      key : 'TableName', value : 'myTableName'
                  }
              ]
          },
         function () {
             console.log('success!')
         },
         function () {
             console.log('failure... wah wah')
         }
     );


Using Ext.azure.storage.Table, you can easily connect to the Azure Table Service and manage your data!