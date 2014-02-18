# Walkthrough: Mobile Services Authentication example

The Authentication sample application is an example building on the simpler [Basic](#!/example/Basic) demo. You can view the full source code in the download package by opening the /examples/auth/MSAuth folder.

Be sure you have read and fully understand the [Basic walkthrough](#!/guide/data_basic) before continuing with this guide.

## app.js

In order to use Authentication in your application, you'll need to configure your Azure Mobile Service with the desired oAuth providers per the [Get started with authentication in Mobile Services](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-users-html/)
guide.

Once you have configured your Mobile Service with the desired oAuth providers, you will need to add the **authIdentities** config to your *azure* object:

    Ext.application({

        //...

            azure : {
                appKey         : 'YOUR-APP-KEY',
                appUrl         : 'YOUR-APP-URL',

                authIdentities : [
                    'microsoft',
                    'facebook',
                    'twitter',
                    'google'
                ]
            },

        //...

    });

## app/controller/Main.js

You should also notice that the Main controller has been edited slightly compared to the *Basic* example. Specifically, the "main" view no longer has an handler on its "activate" event (which automatically loaded the Store).

## app/controller/Auth.js

In the upper-left corner of the application is a new button - tapping this button opens a floating panel (Ext.azure.AuthOptions) which displays the available oAuth providers configured in your app.js file.

The **Auth** controller also handles the application logic which happens during the authentication event cycle.

  - authenticationsuccess
  - authenticationfailure
  - authenticationlogout

The Authentication example is overly-simplified to help you understand how the authentication process works in Windows Azure.

Also, be sure you read the documentation on [Quirks with autoSync Stores](#!/guide/mobile_services_authentication-section-quirks-with-autosync-stores).