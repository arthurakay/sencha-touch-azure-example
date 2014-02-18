Ext.define('Push.store.TodoItems', {
    extend : 'Ext.data.Store',

    requires : [
        'Push.model.TodoItem'
    ],

    config : {
        model        : 'Push.model.TodoItem',
        pageSize     : 8,
        remoteSort   : true,
        remoteFilter : true
    }
});
