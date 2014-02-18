Ext.define('Push.model.Device', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.azure.Proxy'
    ],

    config : {
        idProperty : 'id',
        fields     : [
            {
                name : 'id',
                type : 'int'
            },
            {
                name : 'platform',
                type : 'string'
            },
            {
                name : 'token',
                type : 'string'
            }
        ],

        proxy : {
            type               : 'azure',
            tableName          : 'Devices',
            enablePagingParams : true
        }
    }
});