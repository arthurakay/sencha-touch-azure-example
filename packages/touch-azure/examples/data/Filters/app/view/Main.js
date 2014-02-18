Ext.define('Filters.view.Main', {
    extend : 'Ext.dataview.List',
    xtype  : 'main',

    requires : [
        'Ext.TitleBar',
        'Ext.dataview.List',
        'Ext.data.Store',
        'Ext.plugin.PullRefresh',
        'Ext.plugin.ListPaging',
        'Ext.SegmentedButton',
        'Ext.Button',
        'Filters.view.DataItem',
        'Ext.Spacer',
        'Ext.Label'
    ],

    config : {
        store : 'TodoItems',

        cls : 'tpl-tqj5vndq',

        useSimpleItems   : false,
        defaultType      : 'filters-dataitem',
        disableSelection : true,

        plugins : [
            {
                xclass   : 'Ext.plugin.PullRefresh',
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
                xtype  : 'toolbar',
                items  : [
                    {
                        xtype   : 'button',
                        action  : 'filter',
                        cls     : 'todo-filter-button',
                        iconCls : 'icon-circle-check',
                        text    : 'filter<br />completed'
                    },
                    {
                        xtype : 'spacer'
                    },
                    {
                        xtype : 'label',
                        html  : '<div class="todo-label"><div>TODO</div></div>'
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
                        xtype   : 'button',
                        action  : 'add',
                        iconCls : 'icon-plus'
                    },
                    {
                        xtype        : 'segmentedbutton',
                        align        : 'right',
                        allowDepress : true,
                        items        : [
                            {
                                iconCls  : 'arrow_up',
                                iconMask : true,
                                action   : 'asc'
                            },
                            {
                                align    : 'right',
                                iconCls  : 'arrow_down',
                                iconMask : true,
                                action   : 'desc'
                            }

                        ]
                    }
                ]
            }
        ]
    }
});