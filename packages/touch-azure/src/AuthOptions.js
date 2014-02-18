/**
 * The Azure AuthOptions class displays the available authentication options for users of your application.
 * These options are defined on Ext.Azure via the authIdentities config.
 *
 */
Ext.define('Ext.azure.AuthOptions', {
    extend : 'Ext.Panel',

    requires : [
        'Ext.Button'
    ],

    hideOnMaskTap : true,
    modal         : true,

    /**
     * @constructor
     */

    initialize : function () {
        var me = this,
            i = 0,
            authIdentities = Ext.Azure.getAuthIdentities(),
            len = authIdentities.length,
            items = [];

        for (i; i < len; i++) {
            switch (authIdentities[i].toLowerCase()) {
                case 'microsoft':
                    items.push({
                        xtype   : 'button',
                        text    : 'Microsoft',
                        handler : Ext.Function.bind(me.microsoftHandler, me)
                    });
                    break;

                case 'facebook':
                    items.push({
                        xtype   : 'button',
                        text    : 'Facebook',
                        handler : Ext.Function.bind(me.facebookHandler, me)
                    });
                    break;

                case 'google':
                    items.push({
                        xtype   : 'button',
                        text    : 'Google',
                        handler : Ext.Function.bind(me.googleHandler, me)
                    });
                    break;

                case 'twitter':
                    items.push({
                        xtype   : 'button',
                        text    : 'Twitter',
                        handler : Ext.Function.bind(me.twitterHandler, me)
                    });
                    break;
            }
        }

        if (items.length > 0) {
            me.setItems(items);
        }

        me.callParent();
    },

    microsoftHandler : function() {
        Ext.azure.Authentication.login('microsoftaccount');
        this.destroy();
    },

    facebookHandler : function() {
        Ext.azure.Authentication.login('facebook');
        this.destroy();
    },

    googleHandler : function() {
        Ext.azure.Authentication.login('google');
        this.destroy();
    },

    twitterHandler : function() {
        Ext.azure.Authentication.login('twitter');
        this.destroy();
    }
});