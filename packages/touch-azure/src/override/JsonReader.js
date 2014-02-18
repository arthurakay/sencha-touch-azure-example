/**
 * This class is used by the Ext.azure.Proxy class and adds support for processing 'No Content' 204 responses that
 * Azure sends for destroy actions
 *
 * NOTE: Touch versions less than 2.3 do not call a callback function if you add the 'override' property so instead
 * we require the Ext.data.reader.Json class that we want to override and then in the callback we call Ext.override()
 * so that we can then override the methods we want. This issue should be fixed in ST 2.3 (https://sencha.jira.com/browse/TOUCH-4537)
 * but since the Touch/Azure extensions currently need to support ST 2.2 we will do our overrides this way.
 *
 */
Ext.define('Ext.azure.override.JsonReader', {

    requires: 'Ext.data.reader.Json'

}, function () {

    if (Ext.getVersion().isLessThan('2.3')) {

        Ext.override(Ext.data.reader.Json, {

            /**
             * @override
             * Handles the case when the server returns a 204 "No Content" status code.
             */
            process: function (response) {

                if (response.status === 204) {
                    return new Ext.data.ResultSet({
                        total   : 0,
                        count   : 0,
                        records : [],
                        success : true
                    });
                }

                return this.callParent(arguments);

            }

        });

    }

});