# User Authentication

[Windows Azure](http://www.windowsazure.com) mobile services allow you to secure your data by means of Authentication and allow you to provide different levels of authentication for your data tables.

User Authentication is performed by allowing users to login to your application using their existing Microsoft Live, Google, Twitter or Facebook accounts.

## Prerequisites

Before continuing through this guide, be sure you have read the [Getting Started with Authentication in Azure Mobile Services](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-users-html/) guide and [Getting Started with Ext.azure](#!/guide/getting_started). You will need to understand these guides before you can integrate authentication into your Sencha Touch application.

In particular, you'll need to be sure to [register your app for authentication and configure Azure Mobile Services](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-users-dotnet/#register).

## Setting Up Authentication in Your Touch App

In order to use Azure authentication services from within your application, you must configure the Azure package with the services you wish to enable. As with other Azure configuration information, this is accomplished using the Ext.Azure.init method.

Following the example configuration outlined in the [Configuring Azure](/#!/guide/configuration) guide, you must supply an array of authentication services you wish to enable using the **authIdentities** property. Valid values for the service names are **microsoft**, **facebook**, **twitter**, and **google**.

Here we have an example of an applicaton which has enable all authentication services for it:

    Ext.application({
        name : 'MyApp',

        requires : [
            'Ext.azure.Azure'
        ],

        azure : {
            appKey : 'YOUR_APP_KEY',
            appUrl : 'YOUR_APP_URL',

            authIdentities : [
                'microsoft',
                'facebook',
                'twitter',
                'google'
            ]
        },

        //...

        launch: function() {

            Ext.Azure.init(this.config.azure);

        }
    });

Once configured with the Azure **authIdentities**, your application will immediately begin to handle the authentication lifecycle. Specifically:


- You can prompt users to login using **Ext.azure.Authentication.login()** or by creating an instance of **Ext.azure.AuthOptions**. On successful login, authentication tokens are stored in localStorage

- You can log users out using **Ext.azure.Authentication.logout()**

- The application will automatically check to see if authentication tokens exist in localStorage at startup.

## Listening for Authentication Events

If you wish your application to listen for authentication events, the following three events are available :

- **authenticationfailure** an attempted authentication has failed
- **authenticationsuccess** user has been successfully authenticated
- **authenticationlogout** user has logged out of application and is no longer authenticated

You can configure your application to listen and react to these events as follows :

    Ext.Azure.on({
        'authenticationfailure': function() {
            // do something here
        }
    });


## Adding Authentication Credentials to data requests

Azure allows you to configure your data services to be secure, that is, requiring a user to be authenticated before any read, write, insert or delete actions are performed on data records. To utilize this feature, you need to configure the Azure data proxy to send authentication information with each request.

By setting the property **useHeaderAuthentication** to **true**, the Azure data proxy will automatically add authentication credentials to CRUD operations.

        proxy : {
            type : 'azure',
            tableName               : 'TodoItem',
            useHeaderAuthentication : true
        }

**Note**: It is your responsibility as the developer to restrict table permissions in your Azure portal as needed.

## Web vs Hybrid

Be aware that the Azure API uses [oAuth 2.0](http://en.wikipedia.org/wiki/OAuth) for authentication which, in the case of Ext.Azure, means that authentication is handled via a new browser window.

The Ext.azure.AuthOptions class (as well as **Ext.azure.Authentication.login()**) automatically handles the cross-frame communication of passing authentication tokens.

If you're using PhoneGap/Cordova to build your hybrid application, you will be required to include the [InAppBrowser]( http://cordova.apache.org/docs/en/2.8.0/cordova_inappbrowser_inappbrowser.md.html#InAppBrowser) plugin to facilitate the creation of a new browser window for login.

## Security Implications for autoSync Stores requiring Authentication

It is assumed that if your applicaton requires authentication to access the data in your Azure mobile services tables, it would be desirable to clear out all the stores of their data when a user logs out.

Logically, this clearing of data would be performed by a listener that is listening for the **authenticationlogout** event. If your application uses a store with **autoSync: true**, be aware of some quirks you will need to handle.

When a store is set to autoSync, any action performed on the store is automatically relayed to the remote data service, including actions such as the deletion of records. This leaves us with a situation where it is desired to delete all the records in a store, yet not relay this action to the remote service.

In the code below, we **temporarily disable** the syncing of the store in order to remove the records locally; we don't want to sync these DELETE operations to the remote API!

Additionally, we have to manually reset the store's internal count of removed records so that these aren't accidentally synced (i.e. deleted) when the store makes subsequent requests to the remote API.

    onAuthLogout : function() {
        var store = Ext.getStore('TodoItems');

        // Turn off autoSync 

        store.setAutoSync(false);

        // Remove records from store 

        store.removeAll();

        // Manually reset the internal removed property so these aren't accidentally synced later

        store.removed = []; 

        // Turn back on autoSync

        store.setAutoSync(true);

        this.getLogoutButton().hide();
        this.getLoginButton().show();

        Ext.Viewport.setMasked(false);
    }

It is strongly suggested you thoroughly test your code to ensure that you are not accidently removing important information from your mobile services tables.

