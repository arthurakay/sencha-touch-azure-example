/**
 * The Azure authentication class provides the necessary functions for you to obtain user
 * authentication required by your application (if required by your application configuration). 
 *
 * This class is included as part of the core Azure package and provides seamless integration
 * for your application to be authenticated via a user's existing Microsoft, Facebook, Twitter or 
 * Google account.
 *
 *     Ext.application({
 *         name : 'MyApp',
 *
 *         requires : [
 *             'Ext.azure.Azure'
 *         ],
 *
 *         azure : {
 *             appKey         : 'YOUR_AZURE_APP_KEY ',
 *             appUrl         : 'YOUR_AZURE_APP_URL',
 *             authIdentities : [
 *                 'microsoft',
 *                 'facebook',
 *                 'twitter',
 *                 'google'
 *             ]
 *         },
 *
 *         launch : function() {
 *             Ext.Azure.init(this.config.azure);
 *
 *             //display options for authentication
 *             var authOptions = Ext.create('Ext.azure.AuthOptions');
 *             authOptions.showBy(Ext.getBody());
 *         }
 *     });
 *
 *
 *
 *
 *
 * @class Ext.azure.Authentication
 */
Ext.define('Ext.azure.Authentication', {
    singleton : true,

    requires : [
        'Ext.azure.User',
        'Ext.azure.AuthOptions',
        'Ext.azure.AuthWindow'
    ],

    /**
     * @private
     */
    localStorageId : 'azure-user-',

    /**
     * @private
     */
    loginUrl: 'login/',

    /**
     * An object that represents the current authenticated user.
     * @property {Object}
     * @private
     */
    user : null,

    /**
     * @private
     */
    init : function () {
        //isolate localStorage to the current app
        this.localStorageId += Ext.Azure.getAppKey();

        Ext.azure.User.getProxy().setId(this.localStorageId);

        this.getCurrentUser();
    },

    /**
     * Will return the current user, if one is loaded. If the user is not loaded but exists in localstorage,
     * getCurrentUser() will return TRUE and asynchronously load the user.
     *
     * @return {Ext.azure.User/Boolean}
     */
    getCurrentUser : function () {
        if (this.user) {
            return this.user;
        }

        var userId = localStorage.getItem(this.localStorageId);

        if (userId) {
            Ext.azure.User.load(userId, {
                scope : this,

                failure : function (record, operation) {
                    //clear any obsolete data in localStorage
                    Ext.azure.User.getProxy().clear();
                    Ext.Azure.fireEvent('authenticationfailure');
                },

                success : function (record) {
                    this.user = record;
                    Ext.Azure.fireEvent('authenticationsuccess');
                }
            });

            return true;
        }

        return false;
    },

    /**
     * Sets the current user ..
     * @param user
     */
    setCurrentUser : function (user) {
        if (!this.user) {
            this.user = Ext.create('Ext.azure.User');
        }

        this.user.setData({
            id    : user.id,
            token : user.token
        });
        this.user.save();
    },

    /**
     * Defines the login method to use for the application.
     * @param authMethod {String} 'microsoftaccount', 'facebook', 'twitter', or 'google'
     */
    login : function (authMethod) {
        Ext.azure.AuthWindow.create(this.buildAuthUrl(authMethod));
    },

    /**
     * Logout of application and remove local storage authentication tokens.
     */
    logout : function () {
        //remove every bit of saved data from memory and localStorage
        this.user.getProxy().clear();
        this.user.destroy();
        this.user = null;

        Ext.Azure.fireEvent('authenticationlogout');
    },

    /**
     * Called when application has been successfully authenticated
     */
    onAuthSuccess : function (oauth) {
        this.setCurrentUser(oauth);

        Ext.Azure.fireEvent('authenticationsuccess');
    },

    /**
     * Called when authentication fails.
     */
    onAuthFailure : function (error) {
        this.user = null;

        Ext.Azure.fireEvent('authenticationfailure', error);
    },

    /**
     * Returns the login url
     * @returns {string}
     */
    getLoginUrl : function () {
        return Ext.Azure.buildDomainUrl() + this.loginUrl;
    },

    /**
     * Builds the authorization url
     * @param authMethod
     * @returns {string}
     * @private
     */
    buildAuthUrl : function (authMethod) {
        var authUrl = this.getLoginUrl(),
            originUrl = window.location.origin;

        //in hybrid apps, URL begins with file://
        //set this to localhost as that's whitelisted by default in Azure
        if (/file:/.test(originUrl)) {
            originUrl = 'http://localhost';
        }

        switch (authMethod) {
            case 'facebook':
                authUrl += 'facebook';
                break;

            case 'twitter':
                authUrl += 'twitter';
                break;

            case 'google':
                authUrl += 'google';
                break;

            case 'microsoftaccount':
                authUrl += 'microsoftaccount';
                break;
        }

        if (Ext.browser.is.WebView) {
            return authUrl;
        }

        authUrl = Ext.urlAppend(authUrl, Ext.Object.toQueryString({
            mode              : 'authenticationToken',
            completion_type   : 'postMessage',
            completion_origin : originUrl
        }));

        return  authUrl;
    }

});