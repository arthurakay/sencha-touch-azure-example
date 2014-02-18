/**
 * This class conditionally creates the Ext.device.push.Cordova class if the version of Touch
 * is lesss than 2.3 since since it should be included in Touch by then.
 */
Ext.define('Ext.azure.override.device.push.Cordova', {
    requires : 'Ext.device.push.Abstract'

}, function () {

    if (Ext.getVersion().isLessThan('2.3')) {

        /**
         * Cordova push class that handles registering with the Cordova pushNotifications plugin
         */
        Ext.define('Ext.device.push.Cordova', {

            extend: 'Ext.device.push.Abstract',

            statics : {
                /**
                 * @private
                 * A collection of callback methods that can be globally called by the Cordova PushPlugin
                 */
                callbacks : {}
            },

            setPushConfig : function (config) {
                var methodName = Ext.id(null, 'callback');

                //Cordova's PushPlugin needs a static method to call when notifications are received
                Ext.device.push.Cordova.callbacks[methodName] = config.callbacks.received;

                return {
                    badge         : (config.callbacks.type === Ext.device.Push.BADGE) ? "true" : "false",
                    sound         : (config.callbacks.type === Ext.device.Push.SOUND) ? "true" : "false",
                    alert         : (config.callbacks.type === Ext.device.Push.ALERT) ? "true" : "false",
                    ecb           : 'Ext.device.push.Cordova.callbacks.' + methodName,
                    senderID      : config.senderID,

                    //TODO: we will eventually want to normalize this across iOS, Android and Windows...
                    channelName   : config.channelName
                };
            },

            register : function (config) {
                config.callbacks = this.callParent(arguments);

                var pushConfig = this.setPushConfig(config),
                    plugin = window.plugins.pushNotification;

                plugin.register(
                    config.callbacks.success,
                    config.callbacks.failure,
                    pushConfig
                );

            }

        });

    }

});