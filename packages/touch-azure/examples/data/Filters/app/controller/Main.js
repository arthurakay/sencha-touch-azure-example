Ext.define('Filters.controller.Main', {
    extend : 'Ext.app.Controller',

    config : {
        refs : {
            todoField : 'main toolbar textfield',
            main      : 'main'
        },

        control : {
            'button[action=add]'    : {
                tap : 'onAddItem'
            },
            'button[action=reload]' : {
                tap : 'onReload'
            },

            'button[action=filter]' : {
                tap : 'onFilter'
            },

            'button[action=desc]' : {
                tap : 'sortDesc'
            },

            'button[action=asc]' : {
                tap : 'sortAsc'
            },

            main : {
                activate      : 'loadInitialData',
                itemdoubletap : 'onItemEdit'
            },

            'filters-dataitem checkboxfield' : {
                change : 'onItemCompleteTap'
            },

            'filters-dataitem button' : {
                tap : 'onItemDeleteTap'
            }
        }
    },

    onFilter : function (btn) {
        var store = Ext.getStore('TodoItems');

        if (!btn._filtered) {
            btn.element.down('.icon-circle-check').dom.style.backgroundColor = '#008D00';

            store.filter([
                Ext.create('Ext.azure.Filter', {
                    property : "complete",
                    value    : "false"
                })
            ]);
        }
        else {
            btn.element.down('.icon-circle-check').dom.style.backgroundColor = '';
            store.clearFilter();
        }

        if (btn._filtered === undefined) {
            btn._filtered = true;
        }
        else {
            btn._filtered = !btn._filtered;
        }

        store.loadPage(1);
    },

    sortDesc : function (btn) {
        var store = Ext.getStore('TodoItems');
        if(btn.up().getPressedButtons().length === 0) {
            store.sort([]);
        }
        else {
            store.sort('text', 'DESC');
        }
        store.loadPage(1);
    },

    sortAsc : function (btn) {
        var store = Ext.getStore('TodoItems');
        if(btn.up().getPressedButtons().length === 0) {
            store.sort([]);
        }
        else {
            store.sort('text', 'ASC');
        }
        store.loadPage(1);
    },

    loadInitialData : function () {
        Ext.getStore('TodoItems').load();
    },

    onItemDeleteTap : function (button, e, eOpts) {
        var store    = Ext.getStore('TodoItems'),
            dataItem = button.up('dataitem'),
            rec      = dataItem.getRecord();

        rec.erase({
            success: function (rec, operation) {
                store.remove(rec);
            },
            failure: function (rec, operation) {
                Ext.Msg.alert(
                    'Error',
                    Ext.util.Format.format('There was an error deleting this task.<br/><br/>Status Code: {0}<br/>Status Text: {1}', operation.error.status, operation.error.statusText)
                );
            }
        });
    },

    onItemCompleteTap : function (checkbox, newVal, oldVal, eOpts) {
        var dataItem = checkbox.up('dataitem'),
            rec      = dataItem.getRecord(),
            recVal   = rec.get('complete');

        // this check is needed to prevent an issue where multiple creates get triggered from one create
        if (newVal !== recVal) {
            rec.set('complete', newVal);
            rec.save({
                success: function (rec, operation) {
                    rec.commit();
                },
                failure: function (rec, operation) {
                    // since there was a failure doing the update on the server then silently reject the change
                    rec.reject(true);
                    Ext.Msg.alert(
                        'Error',
                        Ext.util.Format.format('There was an error updating this task.<br/><br/>Status Code: {0}<br/>Status Text: {1}', operation.error.status, operation.error.statusText)
                    );
                }
            });
        }
    },

    onItemEdit : function (list, index, target, record, e, eOpts) {
        var rec = list.getSelection()[0];

        Ext.Msg.prompt('Edit', 'Rename task',
            function (buttonId, value) {
                if (buttonId === 'ok') {
                    rec.set('text', value);
                    rec.save({
                        success: function (rec, operation) {
                            rec.commit();
                        },
                        failure: function (rec, operation) {
                            // since there was a failure doing the update on the server then reject the change
                            rec.reject();
                            Ext.Msg.alert(
                                'Error',
                                Ext.util.Format.format('There was an error updating this task.<br/><br/>Status Code: {0}<br/>Status Text: {1}', operation.error.status, operation.error.statusText)
                            );
                        }
                    });
                }
            },
            null,
            false,
            record.get('text')
        );
    },

    onReload : function () {
        Ext.getStore('TodoItems').load();
    },

    onAddItem : function () {
        var me = this,
            rec,
            store = Ext.getStore('TodoItems'),
            field = me.getTodoField(),
            value = field.getValue();

        if (value === '') {
            Ext.Msg.alert('Error', 'Please enter Task name', Ext.emptyFn);
        }
        else {
            rec = Ext.create('Filters.model.TodoItem', {
                complete : false,
                text     : value
            });

            rec.save({
                success: function (rec, operation) {
                    store.insert(0, rec); //insert at the top
                    field.setValue('');
                },
                failure: function (rec, operation) {
                    Ext.Msg.alert(
                        'Error',
                        Ext.util.Format.format('There was an error creating this task.<br/><br/>Status Code: {0}<br/>Status Text: {1}', operation.error.status, operation.error.statusText)
                    );
                }
            });
        }
    }
});