# Azure Storage: Blob Storage REST APIs

[Windows Azure Blob storage](https://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/) is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world via HTTP or HTTPS. A single blob can be hundreds of gigabytes in size, and a single storage account can contain up to 100TB of blobs.

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

## Ext.azure.storage.Blob

The Ext.azure.storage.Blob class acts as a wrapper for the [Azure Blob Service REST API](http://msdn.microsoft.com/en-us/library/windowsazure/dd135733.aspx).

     var blob = Ext.create('Ext.azure.storage.Blob', {
         accountName : 'YOUR_ACCOUNT_NAME',
         accessKey   : 'YOUR_ACCESS_KEY'
     });

     blob.listContainers(
         {}, //optional parameters for the request
         function () {
             console.log('success!')
         },
         function () {
             console.log('failure... wah wah')
         }
     );


Using Ext.azure.storage.Blob, you can easily connect to the Azure Blob Service and manage your data!