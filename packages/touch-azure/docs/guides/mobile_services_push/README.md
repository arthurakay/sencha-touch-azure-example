# Push Notifications

The Ext.azure.Push class provides the necessary functions for you to incorporate Push notifications
into your application. This functionality only works in apps packaged with Cordova (currently >= 2.8.x).

## PhoneGap / Cordova

Ext.azure.Push is a wrapper for the Cordova [PushPlugin](https://github.com/phonegap-build/PushPlugin) plugin, and as such, your application is required to be built with Cordova/Phonegap (and [cordova.js](http://cordova.apache.org/docs/en/2.8.0/)) included in your project.

The sample Push applications already include the correct platform specific plugin and cordova.js file for you so you can skip this step if you are starting with one of the sample Push applications.

If you're new to PhoneGap / Cordova, be sure to read the [tutorials](http://cordova.apache.org/docs/en/2.8.0/guide_getting-started_index.md.html#Getting%20Started%20Guides) available on their website.

## Push Notifications for Azure Mobile Services

In order for your application to receive push notifications, a server needs to send the notification to the appropriate platform's notification/messaging service that will then send the notification to your device. This is where Windows Azure Mobile Services helps out. Instead of having to set up your own server you can configure a Windows Azure Mobile Service to handle the
Push notifications for you.

For more general information, please see the guide [Get started with push notifications in Mobile Services](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-ios/) on the Windows Azure website.

## Step 1 - Create a Windows Azure Mobile Service

From the Windows Azure portal, click 'MOBILE SERVICES' in the left navigation area and then, click 'NEW' in the bottom left corner.

{@img create-new-azure-mobile-service.png Create New Azure Mobile Service}

Follow the steps to create a new Mobile Service.

## Step 2 - Register your application

To send push notifications to applications on users' devices you must register your application with each [platform's notification/messaging service](http://msdn.microsoft.com/en-us/library/windowsazure/jj591526.aspx) following their specific steps. Windows Azure currently supports push notifications for iOS, Android and Windows Phone.

Each platform has it's own approach to registering an application in order to receive push notifications; please follow one of the following guides:

  * [iOS](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-ios/) - Follow steps #1-4.
  * [Android](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-android/) - Follow steps #1 and #2.
  * Windows Phone 8 - Not required but does have a 500 message limit per day per device.

In each of the above tutorials, you only need to register your application with the relevant authority to enable push notifications on that platform.

## Step 3 - Configure Push Notifications in your Windows Azure Mobile Service

Go to the Dashboard of you Mobile Service and click on 'Push' at the top.  From here you can enter the info you received for each of the platforms when you registered your application.

{@img azure-mobile-service-push-config.png Enter Each Platform's required registration information}

## Step 4 - Create Server Scripts for your Mobile Service to send Push Notifications

Once your application has been registered you can then create server scripts that will send [push notifications](http://msdn.microsoft.com/en-us/library/windowsazure/jj631630.aspx) to user devices that are running these applications. Each platform has its own push API so refer to the following for more info:

  * iOS - Use the [Apple Push Notification Service (APNS)](http://msdn.microsoft.com/en-us/library/windowsazure/jj839711.aspx)
  * Android - Use the [Google Cloud Messaging (GCM)](http://msdn.microsoft.com/en-us/library/windowsazure/dn126137.aspx)
  * Windows Phone - Use the [Microsoft Push Notification Service (MPNS)](http://msdn.microsoft.com/en-us/library/windowsazure/jj871025.aspx)

### Example of initiating a Push Notification

    //
    // iOS Device
    //
    function insert(item, user, request) {
        push.apns.send(device.token, {
            alert: "Toast: " + item.text,
            payload: {
                inAppMessage: "Hey, a new item arrived: " + item.text
            },
        }, {
            success: function(response) {
                console.log('SUCCESS sending iOS Push notification: ', response);
            },
            error: function(error) {
                console.log('ERROR sending iOS Push notification: ', error);
            }
        });
    }

    //
    // Android Device
    //
    function insert(item, user, request) {
        push.gcm.send(device.token, item.text, {
            success: function(response) {
               console.log('SUCCESS sending Android Push notification: ', response);
            },
            error: function(error) {
                console.log('ERROR sending Android Push notification: ', error);
            }
        });
    }

    //
    // Windows Phone
    //
    function insert(item, user, request) {
        push.mpns.sendToast(device.token, {
            text1: item.text,
            text2: item.text
        }, {
            success: function (response) {
                console.log('SUCCESS sending WP Toast Push notification: ', response);
            },
            error: function(error) {
                console.log('ERROR sending WP Toast Push notification: ', error);
            }
        });
    }

### For more information on how to send Push notifications from Windows Azure Scripts refer to:

  * [How to send push notifications](http://msdn.microsoft.com/en-us/library/windowsazure/jj631630.aspx)
  * [push object](http://msdn.microsoft.com/en-us/library/windowsazure/jj554217.aspx)
  * [Azure Service Bus Notification Hubs](http://msdn.microsoft.com/en-us/library/windowsazure/jj927170.aspx)


## Step 5 - Configure your Sencha Touch application

After you have registered and configured your device and created server scripts you can enable Push Notifications in your Sencha Touch app.

### Configure Ext.Azure

Following the example configuration outlined in the [Configuring Azure](/#!/guide/configuration) guide, you can add push cability to your application by including the [pushConfig](#!/api/Ext.Azure-cfg-pushConfig) property to the Ext.Azure.init configuration object.

Here we have an example of an applicaton which has push services configured for it:

    Ext.application({
        name : 'MyApp',

        requires : [
            'Ext.azure.Azure'
        ],

        azure : {
            appKey : 'YOUR_APP_KEY',
            appUrl : 'YOUR_APP_URL',

            pushConfig : {
                windowsphone : 'channel_name',
                android      : 'sender_id'
                ios          : true
            }
        },

        //...

        launch: function() {

            Ext.Azure.init(this.config.azure);

        }
    });


### Event Handling

When configured with push notifications, the Azure package is capable of responding to two different push events: **pushregistrationsuccess** and **pushnotification**. 

You may choose how to handle these events by listening for them and inspecting the **event** parameter passed to the listening function. A very simple example of how to listen for, and react to these events is shown as follows: 

    Ext.Azure.on({
        scope                       : this,
        'pushregistrationsuccess'   : this.onPushRegistrationSuccess,
        'pushnotification'          : this.onPushNotification
    });

    //...

    onPushNotification : function(event) {
        Ext.Msg.alert('Notification', event.message);
    },

More information on configuration parameters and events can be found in the Ext.azure.Push API documentation.

A more detailed and complete implementation of handling push notification events can be found by reviewing the source code in the Push Notification example provided in this SDK.
