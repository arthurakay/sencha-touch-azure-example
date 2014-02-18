Ext.define('Storage.controller.Table', {
    extend : 'Ext.app.Controller',

    config : {
        control : {
            'button#QueryTables' : {
                'tap' : 'onQueryTablesTap'
            },

            'button#CreateTable' : {
                'tap' : 'onCreateTableTap'
            },

            'button#DeleteTable' : {
                'tap' : 'onDeleteTableTap'
            },

            'button#GetTableAcl' : {
                'tap' : 'onGetTableAclTap'
            },

            'button#SetTableAcl' : {
                'tap' : 'onSetTableAclTap'
            },

            'button#QueryEntities' : {
                'tap' : 'onQueryEntitiesTap'
            },

            'button#InsertEntity' : {
                'tap' : 'onInsertEntityTap'
            },

            'button#InsertOrMergeEntity' : {
                'tap' : 'onInsertOrMergeEntityTap'
            },

            'button#InsertOrReplaceEntity' : {
                'tap' : 'onInsertOrReplaceEntityTap'
            },

            'button#UpdateEntity' : {
                'tap' : 'onUpdateEntityTap'
            },

            'button#MergeEntity' : {
                'tap' : 'onMergeEntityTap'
            },

            'button#DeleteEntity' : {
                'tap' : 'onDeleteEntityTap'
            },

            'button#GetStorageServiceProperties' : {
                'tap' : 'onGetStorageServicePropertiesTap'
            },

            'button#SetStorageServiceProperties' : {
                'tap' : 'onSetStorageServicePropertiesTap'
            }
        }
    },

    launch : function () {
        this.table = Ext.create('Ext.azure.storage.Table', {
            accountName : 'YOUR_ACCOUNT_NAME',
            accessKey   : 'YOUR_ACCOUNT_KEY'
        });
    },

    successHandler : function (response, options) {
        console.log('success!');
    },

    failureHandler : function (response, options) {
        console.log('failure... wah wah');
    },

    onQueryTablesTap : function () {
        this.table.queryTables(
            {},
            this.successHandler,
            this.failureHandler
        );
    },

    onCreateTableTap : function () {
        this.table.createTable(
            {
                properties : [
                    {
                        key : 'TableName', value : 'Foo'
                    }
                ]
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onDeleteTableTap : function () {
        this.table.deleteTable(
            {
                name : 'Foo'
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onGetTableAclTap : function () {
        this.table.getTableAcl(
            {
                name : 'Foo'
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onSetTableAclTap : function () {
        this.table.setTableAcl(
            {
                name : 'Foo'
            },
            {
                id : 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=',

                accessPolicy : {
                    start      : '2009-09-28T08:49:37.0000000Z',
                    expiry     : '2009-09-28T08:49:37.0000000Z',
                    permission : 'raud'
                }
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onQueryEntitiesTap : function () {
        this.table.queryEntities(
            {
                name : 'Foo' //assumes a table named Foo already exists
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onInsertEntityTap : function () {
        this.table.insertEntity(
            {
                name : 'Foo'
            },
            {
                updated : new Date().toISOString(),

                properties : [
                    {
                        key   : 'Address',
                        value : '123 Test Ave.'
                    },
                    {
                        key   : 'CustomerCode',
                        type  : 'Edm.Guid',
                        value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
                    },
                    {
                        key   : 'RowKey',
                        value : 3
                    },
                    {
                        key   : 'PartitionKey',
                        value : 'key'
                    }
                ]
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onInsertOrMergeEntityTap : function () {
        this.table.insertOrMergeEntity(
            {
                name         : 'Foo',
                partitionKey : 'key',
                row          : 3
            },
            {
                updated : new Date().toISOString(),

                properties : [
                    {
                        key   : 'Address',
                        value : '123 Test Ave.'
                    },
                    {
                        key   : 'CustomerCode',
                        type  : 'Edm.Guid',
                        value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
                    }
                ]
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onInsertOrReplaceEntityTap : function () {
        this.table.insertOrReplaceEntity(
            {
                name         : 'Foo',
                partitionKey : 'key',
                row          : 3
            },
            {
                updated : new Date().toISOString(),

                properties : [
                    {
                        key   : 'Address',
                        value : '123 Test Ave.'
                    },
                    {
                        key   : 'CustomerCode',
                        type  : 'Edm.Guid',
                        value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
                    }
                ]
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onUpdateEntityTap : function () {
        this.table.updateEntity(
            {
                name         : 'Foo',
                partitionKey : 'key',
                row          : 3
            },
            {
                updated : new Date().toISOString(),

                properties : [
                    {
                        key   : 'Address',
                        value : '1234 Test Ave.'
                    }
                ]
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onMergeEntityTap : function () {
        this.table.mergeEntity(
            {
                name         : 'Foo',
                partitionKey : 'key',
                row          : 3
            },
            {
                updated : new Date().toISOString(),

                properties : [
                    {
                        key   : 'Address',
                        value : '123 Test Ave.'
                    }
                ]
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onDeleteEntityTap : function () {
        this.table.deleteEntity(
            {
                name         : 'Foo',
                partitionKey : 'key',
                row          : 3
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onGetStorageServicePropertiesTap : function () {
        this.table.getStorageServiceProperties(
            this.successHandler,
            this.failureHandler
        );
    },

    onSetStorageServicePropertiesTap : function () {
        this.table.setStorageServiceProperties(
            {
                logging : {
                    'version' : '1.0',
                    'delete'  : false,
                    'read'    : true,
                    'write'   : true,

                    retentionPolicy : {
                        enabled : true,
                        days    : 7
                    }
                },
                metrics : {
                    version     : '1.0',
                    enabled     : true,
                    includeApis : true,

                    retentionPolicy : {
                        enabled : true,
                        days    : 7
                    }
                }
            },
            this.successHandler,
            this.failureHandler
        );
    }

});