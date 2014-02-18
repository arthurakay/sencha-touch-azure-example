Ext.define('Auth.store.TodoItems', {
    extend : 'Ext.data.Store',

    requires : [
        'Auth.model.TodoItem'
    ],

    config : {
        model        : 'Auth.model.TodoItem',
        pageSize     : 8,
        remoteSort   : true,
        remoteFilter : true
    }
});