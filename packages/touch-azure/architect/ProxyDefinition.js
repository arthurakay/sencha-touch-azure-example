{
    "classAlias" : "proxy.azure",
    "className"  : "Ext.azure.Proxy",
    "inherits"   : "Ext.data.proxy.Ajax",
    "autoName"   : "MyAzureProxy",
    "helpText"   : "Sencha Touch proxy for Windows Azure",

    "validChildTypes" : [ "Ext.data.reader.Reader" ],

    "toolbox" : {
        "name"     : "Azure Proxy",
        "category" : "Data Proxies",
        "groups"   : [ "Data Proxies" ]
    },

    "ignoreCfgs" : [ "url" ],

    "configs" : [
        {
            "name"         : "tableName",
            "type"         : "string",
            "initialValue" : "myAzureDataTable"
        },
        {
            "name"         : "customApiName",
            "type"         : "string",
            "initialValue" : ""
        }
    ],

    "listeners" : [
        {
            "name" : "validate",
            "fn"   : "onValidate"
        }
    ],

    "onValidate" : function() {
        return [];
    }
}