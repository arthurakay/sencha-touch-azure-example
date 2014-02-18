Ext.define('Basic.view.Main', {
    extend : 'Ext.dataview.List',
    xtype  : 'main',

    requires : [
        'Ext.TitleBar',
        'Ext.dataview.List',
        'Ext.data.Store',
        'Ext.plugin.PullRefresh',
        'Ext.plugin.ListPaging',
        'Basic.view.DataItem'
    ],

    config : {
        store : 'TodoItems',

        useSimpleItems : false,
        defaultType    : 'basic-dataitem',

        plugins : [
            {
                xclass          : 'Ext.plugin.PullRefresh',
                pullText : 'Pull down to refresh!'
            },
            {
                xclass     : 'Ext.plugin.ListPaging',
                autoPaging : true
            }
        ],

        scrollable : {
            direction     : 'vertical',
            directionLock : true
        },

        items : [
            {
                docked : 'top',
                xtype  : 'titlebar',
                title  : 'Azure Mobile - Basic Data Example'
            },
            {
                xtype  : 'toolbar',
                docked : 'bottom',
                items  : [
                    {
                        xtype       : 'textfield',
                        placeHolder : 'Enter new task',
                        flex        : 1
                    },
                    {
                        xtype  : 'button',
                        action : 'add',
                        text   : 'Add'
                    }
                ]
            }
        ]
    }
});