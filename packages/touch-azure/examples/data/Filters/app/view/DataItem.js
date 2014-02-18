Ext.define('Filters.view.DataItem', {
    extend : 'Ext.dataview.component.ListItem',
    xtype  : 'filters-dataitem',

    requires : [
        'Ext.Button',
        'Ext.layout.HBox',
        'Ext.field.Checkbox'
    ],

    config : {
        checkbox : {
            docked     : 'left',
            xtype      : 'checkboxfield',
            cls        : 'todo-completed',
            labelWidth : 0
        },

        text : {
            flex : 1,
            cls  : 'todo-task'
        },

        button : {
            docked   : 'right',
            xtype    : 'button',
            ui       : 'plain',
            padding  : '10px',
            iconMask : true,
            iconCls  : 'delete',
            cls      : 'todo-delete',
            style    : 'color: #fff;'
        },

        dataMap : {
            getText : {
                setHtml : 'text'
            },

            getCheckbox : {
                setChecked : 'complete'
            }
        },

        layout : {
            type  : 'hbox',
            align : 'center'
        }
    },

    applyCheckbox : function (config) {
        return Ext.factory(config, Ext.field.Checkbox, this.getCheckbox());
    },

    updateCheckbox : function (cmp) {
        if (cmp) {
            this.add(cmp);
        }
    },

    applyButton : function (config) {
        return Ext.factory(config, Ext.Button, this.getButton());
    },

    updateButton : function (cmp) {
        if (cmp) {
            this.add(cmp);
        }
    }

});