Ext.define('Storage.controller.Example', {
    extend : 'Ext.app.Controller',

    config : {
        control : {
            'filefield#ImageSelect' : {
                'change' : 'onImageSelection'
            }
        }
    },

    launch : function () {
        this.blob = Ext.create('Ext.azure.storage.Blob', {
            accountName : 'YOUR_ACCOUNT_NAME',
            accessKey   : 'YOUR_ACCOUNT_KEY'
        });
    },

    onImageSelection : function (cmp, newVal, oldVal, e, eOpts) {
        var me = this,
            file = event.target.files[0],
            img = Ext.Viewport.down('#BlobImage');

        me.blob.setBlockBlob(
            {
                container   : 'foocontainer',
                blobName    : 'image.jpeg',
                blobContent : file
            },
            {}, //optional headers
            function () {
                me.blob.getBlob(
                    {
                        container    : 'foocontainer',
                        blobName     : 'image.jpeg',
                        responseType : 'blob'
                    },
                    {}, //options headers
                    function (response, options) {
                        img.setSrc(webkitURL.createObjectURL(response.responseBytes));
                    },
                    function () {
                        console.log('getBlob failure');
                    }
                );
            },
            function () {
                console.log('setBlockBlob failure');
            }
        );
    }
});

