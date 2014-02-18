Ext.define('Auth.controller.Auth', {
    extend : 'Ext.app.Controller',

    config : {
        refs : {
            loginButton  : 'button#Login',
            logoutButton : 'button#Logout',
            titleBar     : 'titlebar'
        },

        control : {
            'button#Login' : {
                tap : 'onLoginTap'
            },

            'button#Logout' : {
                tap : 'onLogoutTap'
            }
        }
    },

    init : function () {
        //Until Touch has event domains, we have to manually set these event handlers
        Ext.Azure.on('authenticationsuccess', this.onAuthSuccess, this);
        Ext.Azure.on('authenticationfailure', this.onAuthFailure, this);
        Ext.Azure.on('authenticationlogout', this.onAuthLogout, this);
    },

    onLoginTap : function (button, event, options) {
        //this example actually supports MS, Facebook, Google and Twitter...
        //but for simplicity we're only using one
        var authOptions = Ext.create('Ext.azure.AuthOptions');
        authOptions.showBy(button);
    },

    onLogoutTap : function (button, event, options) {
        Ext.Viewport.setMasked(true);
        Ext.azure.Authentication.logout();
    },

    onAuthFailure : function () {
        Ext.Msg.alert('Error', 'Authentication Failed.');
    },

    onAuthSuccess : function () {
        this.getLogoutButton().show();
        this.getLoginButton().hide();

        this.getTitleBar().setTitle(
            'Logged in as: ' + Ext.azure.Authentication.user.get('id').substring(0, 5) + '...'
        );

        var store = Ext.getStore('TodoItems');
        store.load();
    },

    onAuthLogout : function () {
        var store = Ext.getStore('TodoItems');

        //remove records locally... we already logged out, so don't try to sync the removal
        store.setAutoSync(false);
        store.removeAll();
        store.removed = []; //manually reset the internal removed property so these aren't accidentally synced later
        store.setAutoSync(true);

        this.getLogoutButton().hide();
        this.getLoginButton().show();

        this.getTitleBar().setTitle('Logged out');

        Ext.Viewport.setMasked(false);
    }
});