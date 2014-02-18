/**
 * @class Ext.azure.Push
 *
 * The Ext.azure.Push class provides the necessary functions for you to incorporate Push notifications
 * into your application. This functionality only works in apps packaged with Cordova (currently >= 2.8.x).
 *
 * Ext.azure.Push is a wrapper for the Cordova [PushPlugin](https://github.com/phonegap-build/PushPlugin) plugin,
 * so be sure to include this (and [cordova.js](http://cordova.apache.org/docs/en/2.8.0/)) in your project.
 *
 * Additionally, you will need to follow the Azure guide for [Get Started with Push Notifications](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-ios/).
 * For a detailed guide on setting up Push notifications, please see the [Sencha Touch guide](#!/guide/mobile_services_push).
 *
 * Initialization
 * ----
 *
 * To use Ext.azure.Push you must explicitly set a **pushConfig** config property inside Ext.Azure.init():
 *
 *      Ext.application({
 *          requires: [
 *              'Ext.azure.Azure'
 *          ],
 *
 *          launch: function() {
 *              Ext.Azure.init({
 *                  appKey : 'app key here',
 *                  appUrl : 'app url here',
 *
 *                  pushConfig : {
 *                       windowsphone : 'channel_name',
 *                       android      : 'sender_id'
 *                       ios          : true
 *                  }
 *              });

 *          },
 *
 *          //......
 *      });
 *
 *
 * On iOS devices, Push Notifications require a "device ID" - this is automatically captured and set as part of
 * the init() method, so passing *true* is all you need.
 *
 * On Android devices, Push Notifications require a "registration ID".
 *
 * On Windows Phone devices, Push Notifications require a "channel ID".
 *
 *
 * Handling Events
 * ----
 *
 * Notifications are handled via events fired on Ext.Azure - specifically the **pushnotification** event.
 *
 * You may choose how to handle this event by inspecting the **event** parameter.
 *
 */
Ext.define('Ext.azure.Push', {
    singleton : true,

    requires : [
        'Ext.device.Push',
        'Ext.azure.override.device.Push'
    ],

    /**
     * @property token
     * Automatically set after a successful registration.
     */
    token : null,

    /**
     * @property platform
     * Automatically set after a successful registration.
     */
    platform : null,

    /**
     * @event pushregistrationsuccess
     * Fires when application has successfully registered for push notification service.
     * @param {Object} event
     */

    /**
     * @event pushregistrationfailure
     * Fires when application has failed push notification service registration.
     * @param {Object} event
     */

    /**
     * @event pushnotification
     * Fires when a push notification is received by the application
     * @param {Object} notification The notification object
     */

    config : {

        /**
         * For Android notifications this config is used for the senderID, which is the project number of an existing
         * Google API Project that has the Google Cloud Messaging (GCM) service enabled.
         *
         * http://developer.android.com/google/gcm/index.html
         * http://developer.android.com/google/gcm/gs.html
         */
        android : null,

        /**
         * For iOS notifications you enter true if you want notifications enabled and false if not.
         */
        ios : null,

        /**
         * For Windows Phone notifications you set this config to a channel name of your choosing.
         *
         * http://msdn.microsoft.com/en-us/library/hh221549.aspx
         */
        windowsphone : null

    },

    /**
     *  Register the PushPlugin if the device is not a desktop
     */
    init : function (config) {
        if (config) {
            this.setConfig(config);
        }

        this.platform = Ext.os.name;

        if (!Ext.os.is.Desktop) {
            this.setup();
        }
        //<debug>
        else {
            Ext.Logger.info('Cannot register PushPlugin for a Desktop');
        }
        //</debug>
    },

    /**
     * @private
     */
    setup : function () {
        var me = this,
            registrationConfig =  {
                scope    : me,
                type     : Ext.device.Push.ALERT,
                success  : me.registrationSuccessHandler,
                failure  : me.errorHandler,
                received : me.notificationHandler
            };

        switch (Ext.os.name) {
            case 'iOS':
                if (me.getIos()) {
                    Ext.device.Push.register(registrationConfig);
                }
                break;

            case 'WindowsPhone':
                if (me.getWindowsphone()) {
                    Ext.device.Push.register(Ext.apply(registrationConfig, { channelName: me.getWindowsphone() }));
                }
                break;

            case 'Android':
                if (me.getAndroid()) {
                    Ext.device.Push.register(Ext.apply(registrationConfig, { senderID: me.getAndroid() }));
                }
                break;

            default:
                break;
        }

    },

    registrationSuccessHandler : function (result) {
        switch (Ext.os.name) {
            case 'iOS':
                this.token = result;
                break;

            case 'WindowsPhone':
                this.token = result.uri;
                break;

            case 'Android':
                this.token = result.regid;
                break;

            default:
                break;
        }

        Ext.Azure.fireEvent('pushregistrationsuccess', result);
    },

    /**
     * @private
     */
    errorHandler : function (error) {
        //<debug>
        Ext.Logger.error('Error registering push notification service: ' + error);
        //</debug>

        Ext.Azure.fireEvent('pushregistrationfailure', error);
    },

    /**
     * @private
     */
    notificationHandler : function (notification) {
        if (Ext.os.is('Android')) {
            if (notification.event === 'registered' && notification.regid.length > 0) {
                this.registrationSuccessHandler(notification);
                return; // no need to fire pushnotification event if this is for the registrationId
            }
        }

        Ext.Azure.fireEvent('pushnotification', notification);
    }
});