/**
 * Convenience class for Sencha Architect
 */
Ext.define('Ext.azure.Store', {
    extend   : 'Ext.data.Store',
    alias    : 'store.azure',
    requires : [
        'Ext.azure.Proxy'
    ]
});