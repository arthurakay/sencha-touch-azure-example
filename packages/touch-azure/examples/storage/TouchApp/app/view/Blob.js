Ext.define('Storage.view.Blob', {
    extend : 'Ext.Container',
    xtype  : 'storage-blob',

    requires : [
        'Ext.Button'
    ],

    config : {
        title : 'Blob Storage',

        items : [
            {
                xtype  : 'button',
                text   : 'List Containers...',
                itemId : 'ListContainers'
            },
            {
                xtype  : 'button',
                text   : 'Create Container...',
                itemId : 'CreateContainer'
            },
            {
                xtype  : 'button',
                text   : 'Delete Container...',
                itemId : 'DeleteContainer'
            },
            {
                xtype  : 'button',
                text   : 'Lease Container...',
                itemId : 'LeaseContainer'
            },
            {
                xtype  : 'button',
                text   : 'Get Container Properties...',
                itemId : 'GetContainerProperties'
            },
            {
                xtype  : 'button',
                text   : 'Get Container MetaData...',
                itemId : 'GetContainerMetaData'
            },
            {
                xtype  : 'button',
                text   : 'Set Container MetaData...',
                itemId : 'SetContainerMetaData'
            },
            {
                xtype  : 'button',
                text   : 'Get Container ACL...',
                itemId : 'GetContainerAcl'
            },
            {
                xtype  : 'button',
                text   : 'Set Container ACL...',
                itemId : 'SetContainerAcl'
            },
            {
                xtype  : 'button',
                text   : 'List Blobs...',
                itemId : 'ListBlobs'
            },
            {
                xtype  : 'button',
                text   : 'Set Block Blob...',
                itemId : 'SetBlockBlob'
            },
            {
                xtype  : 'button',
                text   : 'Set Page Blob...',
                itemId : 'SetPageBlob'
            },
            {
                xtype  : 'button',
                text   : 'Get Blob...',
                itemId : 'GetBlob'
            },
            {
                xtype  : 'button',
                text   : 'Get Blob MetaData...',
                itemId : 'GetBlobMetaData'
            },
            {
                xtype  : 'button',
                text   : 'Set Blob MetaData...',
                itemId : 'SetBlobMetaData'
            },
            {
                xtype  : 'button',
                text   : 'Delete Blob...',
                itemId : 'DeleteBlob'
            },
            {
                xtype  : 'button',
                text   : 'Lease Blob...',
                itemId : 'LeaseBlob'
            },
            {
                xtype  : 'button',
                text   : 'Copy Blob...',
                itemId : 'CopyBlob'
            },
            {
                xtype  : 'button',
                text   : 'Get Blob Snapshot...',
                itemId : 'GetBlobSnapshot'
            },
            {
                xtype  : 'button',
                text   : 'Abort Blob Copy...',
                itemId : 'AbortBlobCopy',
                ui     : 'confirm'
            },
            {
                xtype  : 'button',
                text   : 'Put Block...',
                itemId : 'PutBlock'
            },
            {
                xtype  : 'button',
                text   : 'Put Block List...',
                itemId : 'PutBlockList'
            },
            {
                xtype  : 'button',
                text   : 'Get Block List...',
                itemId : 'GetBlockList'
            },
            {
                xtype  : 'button',
                text   : 'Put Page...',
                itemId : 'PutPage',
                ui     : 'confirm'
            },
            {
                xtype  : 'button',
                text   : 'Get Page Ranges...',
                itemId : 'GetPageRanges'
            }
        ]
    }
});