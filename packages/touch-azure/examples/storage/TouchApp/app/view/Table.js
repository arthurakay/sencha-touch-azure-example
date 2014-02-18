Ext.define('Storage.view.Table', {
    extend : 'Ext.Container',
    xtype  : 'storage-table',

    requires : [
        'Ext.Button'
    ],

    config : {
        title : 'Table Storage',

        items : [
            {
                xtype  : 'button',
                text   : 'Query Tables...',
                itemId : 'QueryTables'
            },
            {
                xtype  : 'button',
                text   : 'Create table...',
                itemId : 'CreateTable'
            },
            {
                xtype  : 'button',
                text   : 'Delete table...',
                itemId : 'DeleteTable'
            },
            {
                xtype  : 'button',
                text   : 'Get Table ACL...',
                itemId : 'GetTableAcl'
            },
            {
                xtype  : 'button',
                text   : 'Set Table ACL...',
                itemId : 'SetTableAcl'
            },
            {
                xtype  : 'button',
                text   : 'Query Entities...',
                itemId : 'QueryEntities'
            },
            {
                xtype  : 'button',
                text   : 'Insert Entity...',
                itemId : 'InsertEntity'
            },
            {
                xtype  : 'button',
                text   : 'Insert or Merge Entity...',
                itemId : 'InsertOrMergeEntity'
            },
            {
                xtype  : 'button',
                text   : 'Insert or Replace Entity',
                itemId : 'InsertOrReplaceEntity'
            },
            {
                xtype  : 'button',
                text   : 'Update Entity...',
                itemId : 'UpdateEntity'
            },
            {
                xtype  : 'button',
                text   : 'Merge Entity...',
                itemId : 'MergeEntity'
            },
            {
                xtype  : 'button',
                text   : 'Delete Entity...',
                itemId : 'DeleteEntity'
            },
            {
                xtype  : 'button',
                text   : 'Get Storage Service Properties...',
                itemId : 'GetStorageServiceProperties'
            },
            {
                xtype  : 'button',
                text   : 'Set Storage Service Properties...',
                itemId : 'SetStorageServiceProperties'
            }
        ]
    }
});