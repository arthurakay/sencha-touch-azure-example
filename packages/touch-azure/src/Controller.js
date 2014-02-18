/**
 *
 * The Ext.azure.Controller class provides automatic initialization for Ext.Azure.
 *
 *
 *      Ext.application({
 *
 *          requires: [ 'Ext.azure.Controller' ],
 *
 *          azure : {
 *              appKey: 'app key here',
 *              appUrl: 'app url here'
 *          },
 *
 *          //...
 *      });
 *
 *
 *  Using the Ext.azure.Controller in your application, you never need to manually call Ext.Azure.init().
 */
Ext.define('Ext.azure.Controller', {
    extend : 'Ext.app.Controller',

    requires : [
        'Ext.azure.Azure'
    ],

    init : function() {
        var azure   = Ext.azure.Azure,
            config  = this.getApplication().config.azure;

        //add property to Ext.application.app
        this.getApplication().azure = this;

        azure.init(config);
    }

});