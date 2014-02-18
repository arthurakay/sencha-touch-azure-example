{
    "classAlias" : "store.azure",
    "className"  : "Ext.azure.Store",
    "inherits"   : "Ext.data.Store",
    "autoName"   : "MyAzureStore",
    "helpText"   : "Sencha Touch connector for Windows Azure",

    "validChildTypes" : [ 
        "Ext.azure.Proxy", 
        "Ext.data.Field"
    ],

    "toolbox" : {
        "name"     : "Azure Store",
        "category" : "Data Stores",
        "groups"   : [ "Data Stores" ]
    },

    "configs"    : [],
    "ignoreCfgs" : [ "Fields" ],

    "listeners" : [
        {
            "name" : "create",
            "fn"   : "onCreate"
        }
    ],

    onCreate : function() {
        var me = this,
            promise, ODataProxy;


        promise = me.createInstance({
            type : "Ext.azure.Proxy"
        });
    }
}