/**
 * This class is used to create a new version of the 'Ext.device.Push' singleton so that an Ext.device.push.Cordova
 * class can be created.
 *
 * This code is only needed in Touch versions less than 2.3 and therefore in the Ext.azure.Push class
 * we require both classes and then in the setup method we determine which class to use.
 */
Ext.define('Ext.azure.override.device.Push', {

    requires: [
        'Ext.device.Communicator',
        'Ext.device.push.Sencha',
        'Ext.azure.override.device.push.Abstract',
        'Ext.azure.override.device.push.Cordova'
    ]

}, function () {

    if (Ext.getVersion().isLessThan('2.3')) {

        /**
         * Redefining the Ext.device.Push class for Touch versions < 2.3
         * so that we can include the Cordova Push class
         */
        Ext.define('Ext.device.Push', {
            singleton: true,

            requires: [
                'Ext.device.Communicator',
                'Ext.device.push.Sencha',
                'Ext.azure.override.device.push.Cordova'
            ],

            constructor: function() {
                var browserEnv = Ext.browser.is;

                if (browserEnv.WebView) {
                    if (!browserEnv.PhoneGap) {
                        return Ext.create('Ext.device.push.Sencha');
                    }

                    return Ext.create('Ext.device.push.Cordova');

                }

                return Ext.create('Ext.device.push.Abstract');
            }
        });

    }

});