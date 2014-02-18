/**
 * Override for the Ext.device.push.Abstract class so that we can normalize the notification object
 * for all platforms (Android, BlackBerry, iOS, WindowsPhone, etc.)
 *
 * NOTE: Touch currently does not call a callback function if you add the 'override' property so instead
 * we require the Ext.device.push.Abstract class that we want to override and then in the callback we
 * call Ext.override() so that we can then override the methods we want.
 *
 */
Ext.define('Ext.azure.override.device.push.Abstract', {
    requires : 'Ext.device.push.Abstract'

}, function () {

    if (Ext.getVersion().isLessThan('2.3')) {

        Ext.override(Ext.device.push.Abstract, {

            /**
             * @override
             * Override for normalizing the notifications object returned by various platforms
             */
            onReceived: function(notifications, callback, scope) {
                if (callback) {
                    callback.call(scope, notifications);
                }
            }

        });
    }

});