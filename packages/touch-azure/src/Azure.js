/**
 * The Ext.Azure class provides access to Windows Azure Mobile services from your Sencha Touch
 * application. The current services which are provided in this SDK include Data, Authentication
 * and Push.
 *
 * Initialization
 * ----
 * To initialize your application for use with the Ext.Azure SDK you will need to require the class in your
 * application and then initialize the key and url settings during application launch.
 *
 * Let's take a look at
 * a typical setup. Here we include the Azure class by use of the **requires** property in your application,
 * and then we set the values for your application key and URL when your application is launched :
 *
 *
 *      Ext.application({
 *
 *          requires: [ 'Ext.azure.Azure' ],
 *
 *          launch: function() {
 *              Ext.Azure.init({
 *                  appKey: 'app key here',
 *                  appUrl: 'app url here'
 *              });
 *
 *              //......
 *
 *          }
 *      });
 *
 * @class Ext.Azure
 * @alternateClassName Ext.azure.Azure
 */

Ext.define('Ext.azure.Azure', {
    mixins : [ 'Ext.mixin.Observable' ],

    singleton : true,

    version : '1.0.3.20140212154510',

    requires : [
        'Ext.azure.Authentication',
        'Ext.azure.User',
        'Ext.azure.Proxy',
        'Ext.azure.Push',

        'Ext.azure.storage.Table',
        'Ext.azure.storage.Blob'
    ],

    /**
     * @event authenticationsuccess
     * Fired when successful login has occurred or when the user's credentials have been retreived from localStorage
     */

    /**
     * @event authenticationlogout
     * Fired when the user's credentials have been removed from the application. Note: nothing has been sent to the server ending the user's session.
     */

    /**
     * @event authenticationfailure
     * @param {Object} error
     * Fired when login has not been successful. An error object is returned from Azure.
     */

    /**
     * @event pushnotification
     * @param {Object} event
     * Fired when a notification has been received from Ext.azure.Push
     */

    /**
     * @event pushregistrationsuccess
     * @param {Object} event
     * Fired when PushPlugin successfully registers with Cordova
     */

    /**
     * @event pushregistrationfailure
     * @param {Object} event
     * Fired when PushPlugin fails to register with Cordova
     */

    /**
     * @property {Object}
     * An object that represents the current authenticated user.
     */
    currentUser: null,

    config : {

        /**
         * @cfg {String} appUrl
         * The application url as specified in your Windows Azure app setup.
         */
        appUrl : null,

        /**
         * @cfg {String} appKey
         * The application key as created in the Manage Keys sections of your Azure portal
         */
        appKey : null,

        /**
         * @cfg {String} protocol
         * Protocol used by this application. Should be either http or https.
         */
        protocol: 'http',

        /**
         * @cfg {Array} authIdentities
         * List of auth providers configured in Azure portal. Can be "microsoft", "google", "facebook" or "twitter".
         * Defaults to []
         */
        authIdentities : [],

        /**
         * @cfg {Object}
         * An object containing key/value pairs for the platforms on which Push Notifications are enabled:
         *
         *   - windowsphone (channel)
         *   - android (sender ID)
         *   - ios (true)
         *
         *
         *         pushConfig : {
         *             windowsphone : 'channel_name',
         *             android      : 'sender_id'
         *             ios          : true
         *         }
         */
        pushConfig : null
    },

    /**
     * @private
     */
    constructor : function (config) {
        this.initConfig(config);

        return this;
    },

    /**
     * Initialize Ext.Azure for use
     * @param config
     * @returns {boolean} True for successful initialization.
     */

    init : function (config) {
        if (!config.appUrl || !config.appKey) {
            //<debug>
            Ext.Logger.error('Azure appUrl and/or appKey configs are missing. Aborting Azure initialization.');
            //</debug>
            return false;
        }

        this.setConfig(config);

        //load the currentUser credentials, if they exist
        Ext.azure.Authentication.init();

        //initialize push notifications
        if (this.getPushConfig()) {
            Ext.azure.Push.init(this.getPushConfig());
        }

        return true;
    },

    /**
     * Contructs the Builds the application URL
     *
     * @returns {string}
     */
    buildDomainUrl : function () {

        return this.getProtocol() + "://" + Ext.Azure.getAppUrl() + '/';
    },

    /**
     * When app is successfully authenticated, this method will return the current user object which contains
     * token information.
     *
     * @return {Ext.azure.User} User object
     */
    getCurrentUser : function () {
        return Ext.azure.Authenication.getCurrentUser();
    },

    /**
     * Calls a custom API defined in an Azure Mobile Service.
     *
     * NOTE: any options that you can pass to Ext.Ajax.request can be passed here.
     *
     * @param options
     * @param options.apiName {String} the name of the custom API
     * @param options.jsonData {Object}
     * @param options.callback {Function}
     * @param options.success {Function}
     * @param options.failure {Function}
     */
    invokeApi: function (options) {
        var me = this;

        Ext.Ajax.request(Ext.applyIf({
            url     : me.buildDomainUrl() + '/api/' + options.apiName,
            method  : options.method.toUpperCase()  ,
            
            headers : me.getDefaultHeaders(),
            
            jsonData: options.jsonData,

            disableCachingParam: 'cachebuster',
            
            success: Ext.bind(options.success || Ext.emptyFn, options.scope || this),
            
            failure: Ext.bind(options.failure || Ext.emptyFn, options.scope || this)

        }, options));
    },

    /**
     * @private
     */
    getUserAgentString : function() {
        var v = Ext.Azure.version,
            tpl = Ext.create('Ext.XTemplate', [
            ' ZUMO/{0} (lang={1}; os={2}; os_version={3}; arch={4}; version={5})'
        ]);

        return navigator.userAgent + tpl.apply({
            0 : v.substr(0, v.lastIndexOf('.')),
            1 : 'Sencha',
            2 : '',
            3 : '',
            4 : 'Neutral',
            5 : v
        });
    },

    /**
     * @private
     */
    getDefaultHeaders : function() {
        return {
            'X-ZUMO-APPLICATION' : this.getAppKey(),
            'X-ZUMO-VERSION'     : this.getUserAgentString()
        };
    }

}, function () {

    //for simplicity, create a shorter alias
    Ext.Azure = this;

});