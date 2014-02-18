Ext.define('Storage.view.Example', {
    extend : 'Ext.Container',
    xtype  : 'storage-blob-example',

    requires : [
        'Ext.Img',
        'Ext.field.File'
    ],

    config : {
        title : 'Blob Example',

        items : [
            {
                xtype  : 'image',
                itemId : 'BlobImage',
                height : 100,
                width  : 100
            },
            {
                xtype  : 'filefield',
                itemId : 'ImageSelect',
                label  : 'Select Image',
                accept : 'image'
            }
        ]
    }
});