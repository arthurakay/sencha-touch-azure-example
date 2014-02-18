Ext.define('Push.view.DataItem', {
    extend : 'Ext.dataview.component.ListItem',
    xtype  : 'push-dataitem',

    requires : [
        'Ext.Button',
        'Ext.layout.HBox',
        'Ext.field.Checkbox'
    ],

    config : {
        checkbox : {
            docked     : 'left',
            xtype      : 'checkboxfield',
            width      : 50,
            labelWidth : 0
        },

        text : {
            flex : 1
        },

        button : {
            docked   : 'right',
            xtype    : 'button',
            ui       : 'plain',
            iconMask : true,
            iconCls  : 'delete',
            style    : 'color: red;'
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
            type : 'hbox',
            align: 'stretch'
        }
    },

    applyCheckbox : function(config) {
        return Ext.factory(config, Ext.field.Checkbox, this.getCheckbox());
    },

    updateCheckbox : function (cmp) {
        if (cmp) {
            this.add(cmp);
        }
    },

    applyButton : function(config) {
        return Ext.factory(config, Ext.Button, this.getButton());
    },

    updateButton : function (cmp) {
        if (cmp) {
            this.add(cmp);
        }
    }

});