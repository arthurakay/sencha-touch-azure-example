Ext.define('Auth.view.Main', {
    extend : 'Ext.dataview.List',
    xtype  : 'main',

    requires : [
        'Ext.Button',
        'Ext.TitleBar',
        'Ext.dataview.List',
        'Ext.data.Store',
        'Ext.plugin.PullRefresh',
        'Ext.plugin.ListPaging',
        'Auth.view.DataItem'
    ],

    config : {
        store : 'TodoItems',

        useSimpleItems : false,
        defaultType    : 'auth-dataitem',

        plugins : [
            {
                xclass          : 'Ext.plugin.PullRefresh',
                pullRefreshText : 'Pull down to refresh!'
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
                title  : 'Logged out.',
                items  : [
                    {
                        xtype  : 'button',
                        text   : 'Login',
                        itemId : 'Login',
                        ui     : 'confirm'
                    },
                    {
                        xtype  : 'button',
                        text   : 'Logout',
                        itemId : 'Logout',
                        hidden : true,
                        ui     : 'decline'
                    }
                ]
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