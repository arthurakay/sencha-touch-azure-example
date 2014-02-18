Ext.define('Basic.store.TodoItems', {
    extend : 'Ext.data.Store',

    requires : [
        'Basic.model.TodoItem'
    ],

    config : {
        model        : 'Basic.model.TodoItem',
        pageSize     : 8,
        remoteSort   : true,
        remoteFilter : true
    }
});