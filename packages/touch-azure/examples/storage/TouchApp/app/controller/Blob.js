Ext.define('Storage.controller.Blob', {
    extend : 'Ext.app.Controller',

    config : {
        control : {
            'button#ListContainers' : {
                'tap' : 'onListContainersTap'
            },

            'button#CreateContainer' : {
                'tap' : 'onCreateContainerTap'
            },

            'button#DeleteContainer' : {
                'tap' : 'onDeleteContainerTap'
            },

            'button#LeaseContainer' : {
                'tap' : 'onLeaseContainerTap'
            },

            'button#GetContainerProperties' : {
                'tap' : 'onGetContainerPropertiesTap'
            },

            'button#GetContainerMetaData' : {
                'tap' : 'onGetContainerMetaDataTap'
            },

            'button#SetContainerMetaData' : {
                'tap' : 'onSetContainerMetaDataTap'
            },

            'button#GetContainerAcl' : {
                'tap' : 'onGetContainerAclTap'
            },

            'button#SetContainerAcl' : {
                'tap' : 'onSetContainerAclTap'
            },

            'button#ListBlobs' : {
                'tap' : 'onListBlobsTap'
            },

            'button#SetBlockBlob' : {
                'tap' : 'onSetBlockBlobTap'
            },

            'button#SetPageBlob' : {
                'tap' : 'onSetPageBlobTap'
            },

            'button#GetBlob' : {
                'tap' : 'onGetBlobTap'
            },

            'button#GetBlobMetaData' : {
                'tap' : 'onGetBlobMetaDataTap'
            },

            'button#SetBlobMetaData' : {
                'tap' : 'onSetBlobMetaDataTap'
            },

            'button#DeleteBlob' : {
                'tap' : 'onDeleteBlobTap'
            },

            'button#LeaseBlob' : {
                'tap' : 'onLeaseBlobTap'
            },

            'button#CopyBlob' : {
                'tap' : 'onCopyBlobTap'
            },

            'button#GetBlobSnapshot' : {
                'tap' : 'onGetBlobSnapshotTap'
            },

            'button#AbortBlobCopy' : {
                'tap' : 'onAbortBlobCopyTap'
            },

            'button#PutBlock' : {
                'tap' : 'onPutBlockTap'
            },

            'button#PutBlockList' : {
                'tap' : 'onPutBlockListTap'
            },

            'button#GetBlockList' : {
                'tap' : 'onGetBlockListTap'
            },

            'button#PutPage' : {
                'tap' : 'onPutPageTap'
            },

            'button#GetPageRanges' : {
                'tap' : 'onGetPageRangesTap'
            }
        }
    },

    launch : function () {
        this.blob = Ext.create('Ext.azure.storage.Blob', {
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

    onListContainersTap : function () {
        this.blob.listContainers(
            {},
            this.successHandler,
            this.failureHandler
        );
    },

    onCreateContainerTap : function () {
        this.blob.createContainer(
            {
                container : 'foocontainer'
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onDeleteContainerTap : function () {
        this.blob.deleteContainer(
            {
                container : 'foocontainer'
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onLeaseContainerTap : function () {
        this.blob.leaseContainer(
            {
                container     : 'foocontainer',
                operation     : 'acquire',
                leaseDuration : 15
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onGetContainerPropertiesTap : function () {
        this.blob.getContainerProperties(
            {
                container : 'foocontainer'
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onGetContainerMetaDataTap : function () {
        this.blob.getContainerMetaData(
            {
                container : 'foocontainer'
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onSetContainerMetaDataTap : function () {
        this.blob.setContainerMetaData(
            {
                container : 'foocontainer'
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onGetContainerAclTap : function () {
        this.blob.getContainerAcl(
            {
                container : 'foocontainer'
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onSetContainerAclTap : function () {
        this.blob.setContainerAcl(
            {
                container : 'foocontainer'
            },
            {
                id : 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=',

                accessPolicy : {
                    start      : '2012-09-28T08:49:37.0000000Z',
                    expiry     : '2014-09-28T08:49:37.0000000Z',
                    permission : 'rwd'
                }
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onListBlobsTap : function () {
        this.blob.listBlobs(
            {
                container : 'foocontainer'
            },
            {}, //optional parameters
            this.successHandler,
            this.failureHandler
        );
    },

    onSetBlockBlobTap : function () {
        this.blob.setBlockBlob(
            {
                container   : 'foocontainer',
                blobName    : 'myblob',
                blobContent : 'blob text'
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onSetPageBlobTap : function () {
        this.blob.setPageBlob(
            {
                container         : 'foocontainer',
                blobName          : 'pageblob',
                blobContentLength : 1024
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onGetBlobTap : function () {
        this.blob.getBlob(
            {
                container : 'foocontainer',
                blobName  : 'myblob'
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onGetBlobMetaDataTap : function () {
        this.blob.getBlobMetaData(
            {
                container : 'foocontainer',
                blobName  : 'myblob'
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onSetBlobMetaDataTap : function () {
        this.blob.setBlobMetaData(
            {
                container : 'foocontainer',
                blobName  : 'myblob'
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onDeleteBlobTap : function () {
        this.blob.deleteBlob(
            {
                container : 'foocontainer',
                blobName  : 'myblob'
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onLeaseBlobTap : function () {
        this.blob.leaseBlob(
            {
                container : 'foocontainer',
                blobName  : 'myblob',

                operation     : 'acquire',
                leaseDuration : 15
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onCopyBlobTap : function () {
        this.blob.copyBlob(
            {
                container : 'foocontainer',
                blob      : 'anewblob',
                url       : 'https://YOUR_ACCOUNT_NAME.blob.core.windows.net/foocontainer/myblob'
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onGetBlobSnapshotTap : function () {
        this.blob.getBlobSnapshot(
            {
                container : 'foocontainer',
                blobName  : 'myblob'
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onAbortBlobCopyTap : function () {
        this.blob.abortBlobCopy(
            {
                container : 'foocontainer',
                blobName  : 'myblob',
                copyId    : '1f812371-a41d-49e6-b123-f4b542e851c5'
            },
            this.successHandler,
            this.failureHandler
        );
    },

    onPutBlockTap : function () {
        this.blob.putBlock(
            {
                container    : 'foocontainer',
                blobName     : 'myblob',
                blockId      : 'ANAAAA==',
                blockContent : 'test content'
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onPutBlockListTap : function () {
        this.blob.putBlockList(
            {
                container : 'foocontainer',
                blobName  : 'myblob'
            },
            {
                properties : [
                    { key : 'Uncommitted', value : 'ANAAAA==' }
                ]
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onGetBlockListTap : function () {
        this.blob.getBlockList(
            {
                container : 'foocontainer',
                blobName  : 'myblob'
            },
            {}, //optional parameters
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onPutPageTap : function () {
        //TODO: 500 error... no indication it's my fault, but leaving this comment here until further notice
        this.blob.putPage(
            {
                container : 'foocontainer',
                blobName  : 'pageblob',

                rangeStart : 0,
                rangeEnd   : 511,

                operation   : 'update',
                blobContent : 'test content'
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    },

    onGetPageRangesTap : function () {
        this.blob.getPageRanges(
            {
                container : 'foocontainer',
                blobName  : 'pageblob',

                rangeStart : 0,
                rangeEnd   : 511
            },
            {}, //optional headers
            this.successHandler,
            this.failureHandler
        );
    }

});