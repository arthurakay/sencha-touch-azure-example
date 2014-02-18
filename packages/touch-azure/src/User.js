/**
 * Model defintion for authenticated user
 * @private
 */
Ext.define('Ext.azure.User', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.data.proxy.LocalStorage'
    ],

    config : {
        fields : [
            {
                name    : 'id',
                type    : 'string'
            },

            {
                name    : 'token',
                type    : 'string'
            },
            {
                name    : 'authMethod',
                type    : 'string'
            }
        ],

        proxy : {
            type : 'localstorage',
            id   : 'azure-user' //auto-generated with appKey in Ext.azure.Authentication.init()
        }
    }
});