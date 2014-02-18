Ext.define('Filters.store.TodoItems', {
    extend : 'Ext.data.Store',

    requires : [
        'Filters.model.TodoItem'
    ],

    config : {
        model        : 'Filters.model.TodoItem',
        pageSize     : 8,
        remoteSort   : true,
        remoteFilter : true
    }
});
