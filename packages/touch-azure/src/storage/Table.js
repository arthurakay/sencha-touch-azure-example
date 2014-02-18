/**
 * @class Ext.azure.storage.Table
 *
 * Ext.azure.storage.Table class acts as a wrapper for the [Azure Table Service REST API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179423).
 *
 *     var table = Ext.create('Ext.azure.storage.Table', {
 *         accountName : 'YOUR_ACCOUNT_NAME',
 *         accessKey   : 'YOUR_ACCESS_KEY'
 *     });
 *
 * Currently, Windows Azure does not support cross-domain (CORS) requests to the Storage Services API. As a result,
 * Ext.azure.storage.Table will **only work in a natively packaged application**.
 *
 */
Ext.define('Ext.azure.storage.Table', {

    extend : 'Ext.azure.storage.Abstract',

    config : {
        storageType : 'table'
    },

    /**
     * @private
     */
    _getEntityPath : function (table) {
        //we MUST use single quotes to surround the table name
        return "/" + table.name + "(PartitionKey='" + table.partitionKey + "',RowKey='" + table.row + "')";
    },

    /**
     * @method setStorageServiceProperties
     * @param {Object} data An object containing the elements noted in the Azure [Set Table Service Properties](http://msdn.microsoft.com/en-us/library/windowsazure/hh452240) API.
     * For example:
     *
     *     {
     *         logging : {
     *             version : '1.0',
     *             delete  : false,
     *             read    : false,
     *             write   : false,
     *
     *             retentionPolicy : {
     *                 enabled : true,
     *                 days : 7
     *             }
     *         },
     *         metrics : {
     *             version     : '1.0',
     *             enabled     : true,
     *             includeApis : false,
     *
     *             retentionPolicy : {
     *                 enabled : true,
     *                 days : 7
     *             }
     *         }
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */


    /**
     * @param {Object} params Query/Filter parameters per [Querying the Data Service](http://msdn.microsoft.com/en-us/library/dd673933.aspx)
     * @param {Function} success
     * @param {Function} failure
     */
    queryTables : function (params, success, failure) {
        var canonicalizedResource = '/Tables',
            method = 'GET';

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                headers : {
                    'x-ms-version' : undefined
                },
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} data An object containing the relevant properties of a [Table Storage Data Model](http://msdn.microsoft.com/en-us/library/windowsazure/dd179338).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             { key : 'TableName', value : 'myTableName' }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     *
     */
    createTable : function (data, success, failure) {
        var canonicalizedResource = '/Tables',
            method = 'POST',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name : 'myTable'
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    deleteTable : function (table, success, failure) {
        var canonicalizedResource = "/Tables('" + table.name + "')", //we MUST use single quotes to surround the table name
            method = 'DELETE',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : undefined
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name : 'myTable'
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    getTableAcl : function (table, success, failure) {
        var canonicalizedResource = '/' + table.name,
            method = 'GET',
            params = {
                comp : 'acl'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name : 'myTable'
     *     }
     *
     * @param {Object} data An object containing the elements noted in the Azure [Set Table ACL](http://msdn.microsoft.com/en-us/library/windowsazure/jj159102) API.
     * For example:
     *
     *     {
     *         id : 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=',
     *
     *         accessPolicy : {
     *             start      : '2009-09-28T08:49:37.0000000Z',
     *             expiry     : '2009-09-28T08:49:37.0000000Z',
     *             permission : 'raud'
     *         }
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    setTableAcl : function (table, data, success, failure) {
        var canonicalizedResource = '/' + table.name,
            method = 'PUT',
            params = {
                comp : 'acl'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.acl, data);


        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable'
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    queryEntities : function (table, success, failure) {
        var canonicalizedResource = '/' + table.name,
            method = 'GET',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                headers : {
                    'x-ms-version' : undefined
                },
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name : 'myTable'
     *     }
     *
     * @param {Object} data An object containing the relevant properties of an [Entity](http://msdn.microsoft.com/en-us/library/windowsazure/dd894033).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             {
     *                 key : 'Address',
     *                 value : '123 Test Ave.'
     *             },
     *             {
     *                 key : 'CustomerCode',
     *                 type: 'Edm.Guid',
     *                 value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
     *             }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    insertEntity : function (table, data, success, failure) {
        var canonicalizedResource = '/' + table.name,
            method = 'POST',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable',
     *         partitionKey : 'partition-key',
     *         row          : 123
     *     }
     *
     * @param {Object} data An object containing the relevant properties of an [Entity](http://msdn.microsoft.com/en-us/library/windowsazure/dd894033).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             {
     *                 key : 'Address',
     *                 value : '123 Test Ave.'
     *             },
     *             {
     *                 key : 'CustomerCode',
     *                 type: 'Edm.Guid',
     *                 value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
     *             }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    insertOrMergeEntity : function (table, data, success, failure) {
        var canonicalizedResource = this._getEntityPath(table),
            method = 'MERGE',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable',
     *         partitionKey : 'partition-key',
     *         row          : 123
     *     }
     *
     * @param {Object} data An object containing the relevant properties of an [Entity](http://msdn.microsoft.com/en-us/library/windowsazure/dd894033).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             {
     *                 key : 'Address',
     *                 value : '123 Test Ave.'
     *             },
     *             {
     *                 key : 'CustomerCode',
     *                 type: 'Edm.Guid',
     *                 value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
     *             }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    insertOrReplaceEntity : function (table, data, success, failure) {
        var canonicalizedResource = this._getEntityPath(table),
            method = 'PUT',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable',
     *         partitionKey : 'partition-key',
     *         row          : 123
     *     }
     *
     * @param {Object} data An object containing the relevant properties of an [Entity](http://msdn.microsoft.com/en-us/library/windowsazure/dd894033).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             {
     *                 key : 'Address',
     *                 value : '123 Test Ave.'
     *             },
     *             {
     *                 key : 'CustomerCode',
     *                 type: 'Edm.Guid',
     *                 value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
     *             }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    updateEntity : function (table, data, success, failure) {
        var canonicalizedResource = this._getEntityPath(table),
            method = 'PUT',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18',

                    //Specifies the condition for which the update should be performed. To force an unconditional update, set If-Match to the wildcard character (*).
                    'If-Match'     : '*'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable',
     *         partitionKey : 'partition-key',
     *         row          : 123
     *     }
     *
     * @param {Object} data An object containing the relevant properties of an [Entity](http://msdn.microsoft.com/en-us/library/windowsazure/dd894033).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             {
     *                 key : 'Address',
     *                 value : '123 Test Ave.'
     *             },
     *             {
     *                 key : 'CustomerCode',
     *                 type: 'Edm.Guid',
     *                 value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
     *             }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    mergeEntity : function (table, data, success, failure) {
        var canonicalizedResource = this._getEntityPath(table),
            method = 'MERGE',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18',

                    //Specifies the condition for which the update should be performed. To force an unconditional update, set If-Match to the wildcard character (*).
                    'If-Match'     : '*'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable',
     *         partitionKey : 'partition-key',
     *         row          : 123
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    deleteEntity : function (table, success, failure) {
        var canonicalizedResource = this._getEntityPath(table),
            method = 'DELETE',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    //Specifies the condition for which the update should be performed. To force an unconditional update, set If-Match to the wildcard character (*).
                    'If-Match' : '*',

                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    }

});