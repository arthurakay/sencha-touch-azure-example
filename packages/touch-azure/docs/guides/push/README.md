# Walkthrough: Mobile Services Push example

The Push sample application is an example building on the simpler [Basic](#!/example/Basic) demo.
You can view the full source code in the download package by opening the /examples/push folder.

Be sure you have read and fully understand the [Basic walkthrough](#!/guide/data_basic) before continuing with this guide.

## app.js

In order to use Push in your application, you'll need to configure the Push section of your Azure Mobile Service. For more info see the [Push Notifications Guide](#!/guide/mobile_services_push-section-1).

Once you have configured your Mobile Service with the desired Push registrations, you will need to add the **pushConfig** config to your *azure* object:

    Ext.application({

        //...

            azure : {

                appKey: 'YOUR-APP-KEY',
                appUrl: 'YOUR-APP-URL',

                pushConfig: {
                    windowsphone : 'channel_name',
                    android      : 'sender_id'
                    ios          : true
                }
            },

        //...

    });

## Windows Azure Data Table for Storage

To run the Push Notification sample application, your Azure mobile service should use two data tables:

  * TodoItem
  * Devices

After you have created these tables in the Windows Azure portal, update the **INSERT** script for the **TodoItem** table with the following:

    function insert(item, user, request) {

        var devicesTable = tables.getTable('Devices');

        // execute the request
        request.execute({
            success: function() {
                request.respond();
                sendNotifications();
            }
        });

        function sendNotifications() {

            devicesTable.read({
                success: function(devices) {

                    devices.forEach(function(device) {

                        // Android
                        if (device.platform == "Android") {
                            console.log('Android Push to registrationId ' + device.token);
                            push.gcm.send(device.token, item.text, {
                                success: function(response) {
                                   console.log('SUCCESS sending Android Push notification: ', response);
                                },
                                error: function(error) {
                                    console.log('ERROR sending Android Push notification: ', error);
                                }
                            });
                        }

                        // iOS
                        if (device.platform == "iOS") {
                            console.log('iOS Push to deviceToken ' + device.token);
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

                        // WP8
                        if (device.platform == "WindowsPhone") {
                            console.log('WindowsPhone Push to channel ' + device.token);
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
                            push.mpns.sendFlipTile(device.token, {
                                title: item.text
                            }, {
                                success: function (response) {
                                    console.log('SUCCESS sending WP Flip Tile Push notification: ', response);
                                },
                                error: function(error) {
                                    console.log('ERROR sending WP Flip Tile Push notification: ', error);
                                }
                            });
                        }
                    });

                },
                error: function(error) {
                    console.log('ERROR reading Devices table: ', error);
                }
            });
        }

    }

Next, update the **INSERT** script for the **Devices** table with the following:

    function insert(item, user, request) {
      var devices = tables.getTable('Devices');

      devices
          .where({
              token: item.token
          })
          .read({
              success: insertDeviceIfNotFound
          });

      function insertDeviceIfNotFound(existingDevices) {
          if (existingDevices.length > 0) {
              console.log("Device Token already exists for token " + existingDevices[0]);
              request.respond(200, existingDevices[0]);
          } else {
              console.log("Adding device Token " + item.token);
              request.execute();
          }
      }
    }

## How Push Notifications are sent

Push notifications are done from the insert script of the TodoItem table.  Since each platform has its own API for sending notifications, the script checks to see which platform is stored for the token in the Devices table and then the appropriate API is called.

For more information on each platforms Push API refer to the following:

  * iOS - Use the [Apple Push Notification Service (APNS)](http://msdn.microsoft.com/en-us/library/windowsazure/jj839711.aspx)
  * Android - Use the [Google Cloud Messaging (GCM)](http://msdn.microsoft.com/en-us/library/windowsazure/dn126137.aspx)
  * Windows Phone - Use the [Microsoft Push Notification Service (MPNS)](http://msdn.microsoft.com/en-us/library/windowsazure/jj871025.aspx)

