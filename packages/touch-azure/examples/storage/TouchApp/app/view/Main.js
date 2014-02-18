Ext.define('Storage.view.Main', {
    extend : 'Ext.tab.Panel',
    xtype  : 'main',

    requires : [
        'Ext.TitleBar',
        'Ext.Container',
        'Storage.view.Table',
        'Storage.view.Blob',
        'Storage.view.Example'
    ],

    config : {

        tabBarPosition : 'bottom',

        items : [
            {
                xtype : 'container',
                title : 'Welcome',

                styleHtmlContent : true,
                scrollable       : true,

                items : [
                    {
                        docked : 'top',
                        xtype  : 'titlebar',
                        title  : 'Storage Demo'
                    }
                ],

                html : [
                    'On each tab, push the buttons execute the Azure Storage API calls for your configured Azure Storage account.<br /><br />',
                    'Watch your debugging console for any output.'
                ].join("")
            },

            {
                xtype : 'storage-table'
            },
            {
                xtype : 'storage-blob'
            },
            {
                xtype : 'storage-blob-example'
            }
        ]
    }
});