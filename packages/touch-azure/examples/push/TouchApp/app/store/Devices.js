Ext.define('Push.store.Devices', {
    extend : 'Ext.data.Store',

    requires : [
        'Push.model.Device'
    ],

    config : {
        model        : 'Push.model.Device',
        pageSize     : 8,
        remoteSort   : true,
        remoteFilter : true,
        // autoLoad:true,
        autoSync     : true
    }
});
