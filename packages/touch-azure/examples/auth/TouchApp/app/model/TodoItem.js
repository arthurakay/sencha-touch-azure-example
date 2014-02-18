Ext.define('Auth.model.TodoItem', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.azure.Proxy'
    ],

    config : {
        idProperty : 'id',
        useCache   : false,

        fields     : [
            {
                name : 'id',
                type : 'int'
            },
            {
                name : 'text',
                type : 'string'
            },
            {
                name : 'complete',
                type : 'boolean'
            }
        ],

        proxy : {
            type : 'azure',

            tableName               : 'TodoItem',
            enablePagingParams      : true,
            useHeaderAuthentication : true
        }
    }
});