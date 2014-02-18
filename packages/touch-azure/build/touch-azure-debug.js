/**
 * The Azure AuthOptions class displays the available authentication options for users of your application.
 * These options are defined on Ext.Azure via the authIdentities config.
 *
 */
Ext.define('Ext.azure.AuthOptions', {
    extend :  Ext.Panel ,

                
                    
      

    hideOnMaskTap : true,
    modal         : true,

    /**
     * @constructor
     */

    initialize : function () {
        var me = this,
            i = 0,
            authIdentities = Ext.Azure.getAuthIdentities(),
            len = authIdentities.length,
            items = [];

        for (i; i < len; i++) {
            switch (authIdentities[i].toLowerCase()) {
                case 'microsoft':
                    items.push({
                        xtype   : 'button',
                        text    : 'Microsoft',
                        handler : Ext.Function.bind(me.microsoftHandler, me)
                    });
                    break;

                case 'facebook':
                    items.push({
                        xtype   : 'button',
                        text    : 'Facebook',
                        handler : Ext.Function.bind(me.facebookHandler, me)
                    });
                    break;

                case 'google':
                    items.push({
                        xtype   : 'button',
                        text    : 'Google',
                        handler : Ext.Function.bind(me.googleHandler, me)
                    });
                    break;

                case 'twitter':
                    items.push({
                        xtype   : 'button',
                        text    : 'Twitter',
                        handler : Ext.Function.bind(me.twitterHandler, me)
                    });
                    break;
            }
        }

        if (items.length > 0) {
            me.setItems(items);
        }

        me.callParent();
    },

    microsoftHandler : function() {
        Ext.azure.Authentication.login('microsoftaccount');
        this.destroy();
    },

    facebookHandler : function() {
        Ext.azure.Authentication.login('facebook');
        this.destroy();
    },

    googleHandler : function() {
        Ext.azure.Authentication.login('google');
        this.destroy();
    },

    twitterHandler : function() {
        Ext.azure.Authentication.login('twitter');
        this.destroy();
    }
});

/**
 * @private
 */
Ext.define('Ext.azure.AuthWindow', {
    singleton : true,

                
                  
      

    window : null,

    intervalId : null,

    scopedMessageFn : null,

    create : function (url) {
        this.window = window.open(url, '_blank', 'location=no');

        if (Ext.browser.is.WebView) {
            this.window.addEventListener('loadstart', this.urlChangeHandler);
            this.window.addEventListener('exit', this.exitHandler);
        }
        else {
            //this.scopedMessageFn = Ext.Function

            window.addEventListener('message', this.messageHandler);
        }

        this.intervalId = window.setInterval(this.intervalFn, 250);
    },

    intervalFn : function () {
        var auth = Ext.azure.AuthWindow;

        if (auth.window && auth.window.closed === true) {
            auth.endRequest('setInterval() detected the authentication window was closed manually.');
        }
    },

    endRequest : function (err, oauth) {
        var authWindow = this.window;

        window.clearInterval(this.intervalId);

        if (authWindow) {
            if (Ext.browser.is.WebView) {
                authWindow.removeEventListener('loadstart', this.urlChangeHandler);
                authWindow.removeEventListener('exit', this.exitHandler);
            }
            else {
                window.removeEventListener('message', this.messageHandler);
            }

            authWindow.close();
        }

        if (!err) {
            Ext.azure.Authentication.onAuthSuccess(oauth);
        }
        else {
            Ext.azure.Authentication.onAuthFailure(err);
        }
    },

    messageHandler : function (rawResponse) {
        var auth = Ext.azure.AuthWindow,
            jsonResponse;

        if (rawResponse.source === auth.window) {
            try {
                //Twitter returns a message on page load, but that's not what we want
                if (rawResponse.data === '__ready__') {
                    return;
                }

                jsonResponse = Ext.JSON.decode(rawResponse.data);
            }
            catch (r) {
                auth.endRequest('An error occurred decoding the response.');
                return;
            }

            if (jsonResponse.type === 'LoginCompleted') {
                auth.endRequest(false, {
                    id    : jsonResponse.oauth.user.userId,
                    token : jsonResponse.oauth.authenticationToken
                });
            }

            if (jsonResponse.error) {
                auth.endRequest(jsonResponse.error);
            }
        }
    },

    urlChangeHandler : function (urlObject) {
        var url = urlObject.url,
            queryIndex = url.indexOf('#');

        if (queryIndex < 0) { return false; }

        var params = Ext.Object.fromQueryString(url.slice(queryIndex + 1)); //don't include the #

        if (params.token) {
            var credentials = Ext.JSON.decode(params.token);

            Ext.azure.AuthWindow.endRequest(false, {
                id    : credentials.user.userId,
                token : credentials.authenticationToken
            });

            return true;
        }

        return false;
    },

    exitHandler : function () {
        Ext.azure.AuthWindow.endRequest('exitHandler() detected the authentication window was closed manually.');
    }
});

/**
 * Model defintion for authenticated user
 * @private
 */
Ext.define('Ext.azure.User', {
    extend :  Ext.data.Model ,

                
                                     
      

    config : {
        fields : [
            {
                name    : 'id',
                type    : 'string'
            },

            {
                name    : 'token',
                type    : 'string'
            },
            {
                name    : 'authMethod',
                type    : 'string'
            }
        ],

        proxy : {
            type : 'localstorage',
            id   : 'azure-user' //auto-generated with appKey in Ext.azure.Authentication.init()
        }
    }
});

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

/**
 * The Ext.azure.Filter class offers functionality for filtering your remote data in the Azure cloud.
 *
 *         store.filter([
 *             Ext.create('Ext.azure.Filter', {
 *                 property : "text",
 *                 value    : "'aaa'"
 *             }),
 *             Ext.create('Ext.azure.Filter', {
 *                 property      : "complete",
 *                 value         : true,
 *                 operator      :'eq',
 *                 chainOperator :'or'
 *             })
 *         ]);
 *
 */
Ext.define('Ext.azure.Filter', {
    extend :  Ext.util.Filter ,
    config : {

        /**
         * @cfg {String} operator
         *
         * Sets type of the operator to use for predicate
         * Possible values:
         * eq     Equal
         * ne     Not equal
         * gt     Greater than
         * ge     Greater than or equal
         * lt     Less than
         * le     Less than or equal
         *
         * Default: 'eq'
         */
        operator : 'eq',

        /**
         * @cfg {String} chainOperator
         *
         * Sets chaining operator between two or more predicates, e.g $filter=Price le 200 and Price gt 3.5
         * Possible values:
         * and     Logical and
         * or     Logical or
         * not     Logical negation
         *
         * Default: ''
         */
        chainOperator : ''
    }
});

/**
 * This class is used by the Ext.azure.Proxy class and adds support for processing 'No Content' 204 responses that
 * Azure sends for destroy actions
 *
 * NOTE: Touch versions less than 2.3 do not call a callback function if you add the 'override' property so instead
 * we require the Ext.data.reader.Json class that we want to override and then in the callback we call Ext.override()
 * so that we can then override the methods we want. This issue should be fixed in ST 2.3 (https://sencha.jira.com/browse/TOUCH-4537)
 * but since the Touch/Azure extensions currently need to support ST 2.2 we will do our overrides this way.
 *
 */
Ext.define('Ext.azure.override.JsonReader', {

                                    

}, function () {

    if (Ext.getVersion().isLessThan('2.3')) {

        Ext.override(Ext.data.reader.Json, {

            /**
             * @override
             * Handles the case when the server returns a 204 "No Content" status code.
             */
            process: function (response) {

                if (response.status === 204) {
                    return new Ext.data.ResultSet({
                        total   : 0,
                        count   : 0,
                        records : [],
                        success : true
                    });
                }

                return this.callParent(arguments);

            }

        });

    }

});

/**
 * @author Juris Vecvanags
 *
 * The Azure data proxy is used to provide the communication layer between your application and Windows
 * Azure mobile services data storage.
 *
 * The Azure data proxy is included as one of the default classes when you add Azure to your Sencha
 * Touch application.
 *
 * You will need to add this proxy to your models or stores and provide the table name as it is defined
 * in your Azure portal application in the Data section. The proxy type to use is '**azure**' :
 *
 *      Ext.define('MyApp.model', {
 *          extend: 'Ext.data.Model',
 *
 *          requires : [
 *              'Ext.azure.Proxy'
 *          ],
 *
 *          config: {
 *              idProperty : 'id',
 *              fields : [ 'id', 'text', 'complete'],
 *
 *              proxy : {
 *                  type               : 'azure',
 *                  tableName          : 'TodoItem',
 *                  enablePagingParams : true
 *              }
 *          }
 *      });
 *
 *  ### Quirks with autoSync Stores
 *
 * If your application uses a Store with **autoSync : true**, be aware of some quirks you will need to handle.
 *
 * The **Auth example** responds to the "authenticationlogout" event by clearing the shared data store:
 *
 * onAuthLogout : function() {
 *        var store = Ext.getStore('TodoItems');
 *
 *        //remove records locally... we already logged out, so don't try to sync the removal
 *        store.setAutoSync(false);
 *        store.removeAll();
 *        store.removed = []; //manually reset the internal removed property so these aren't accidentally synced later
 *        store.setAutoSync(true);
 *
 *        this.getLogoutButton().hide();
 *        this.getLoginButton().show();
 *
 *        Ext.Viewport.setMasked(false);
 *    }
 *
 * Note that we want to remove all records from this store when a user has logged out so that other
 * users cannot view the data which requires authentication.
 *
 * In the code above, we **temporarily disable** the syncing of the store in order to remove the records locally; we
 * don't want to sync these DELETE operations to the remote API!
 *
 * Additionally, we have to manually reset the store's internal count of removed records so that these aren't
 * accidentally synced (i.e. deleted) when the store makes subsequent requests to the remote API.
 *
 */
Ext.define('Ext.azure.Proxy', {
    extend :  Ext.data.proxy.Ajax ,

                
                           
                                   
                   
                                       
      

    alias              : 'proxy.azure',
    alternateClassName : 'Ext.data.AzureProxy',

    config : {

        /**
         * @cfg {Boolean} appendId
         * `true` to automatically append the ID of a Model instance when performing a request based on that single instance.
         * See Rest proxy intro docs for more details.
         */
        appendId : true,

        /**
         * @cfg {Boolean} batchActions
         * `true` to batch actions of a particular type when synchronizing the store.
         */
        batchActions : false,

        /**
         * @cfg {Object} actionMethods
         * @private
         */
        actionMethods : {
            create  : 'POST',
            read    : 'GET',
            update  : 'PATCH',
            destroy : 'DELETE'
        },

        /**
         * @cfg selectParam
         * @hide
         */
        selectParam : '$select',

        /**
         * @cfg orderParam
         * @hide
         */
        orderParam  : '$orderby',

        /*
         * @cfg filterParam
         * @private
         */
        filterParam : '$filter',

        /**
         * @cfg {String} startParam
         * @hide
         */
        startParam : '$skip',

        /**
         * @cfg {String} limitParam
         * @hide
         */
        limitParam : '$top',

        /**
         * Grouping is not supported by Azure mobile
         * @cfg {String} groupParam
         * @hide
         */
        groupParam : null,

        /**
         * @cfg {String} sortParam
         * The name of the `sort` parameter to send in a request. Set this to `undefined` if you don't
         * want to send a sort parameter.
         */
        sortParam : '$orderby',

        /**
         * @cfg {String} pageParam
         * @hide
         */
        pageParam : null,

        /**
         * @cfg {String} protocol
         * http/https , defaults to https
         */
        protocol : 'https',

        /**
         * @cfg {String} tableName
         * The table name to access as defined in the data section of your Azure mobile application. This value is case-sensitive.
         */
        tableName : null,

        /**
         * @cfg {String} customApiName
         * The Custom API name to access as defined in the data section of your Azure mobile application. This value is case-sensitive.
         *
         * **Note:** do not configure values for both tableName and customApiName - only one of these is required and will work.
         */
        customApiName : null,

        /**
         * @cfg {Boolean} enablePagingParams This can be set to false if you want to prevent the paging params to be
         * sent along with the requests made by this proxy.
         */
        enablePagingParams : true,

        /**
         * @cfg {Number} timeout
         * The number of milliseconds to wait for a response. Defaults to 30000 milliseconds (30 seconds).
         */
        timeout : 30000,

        /**
         * @cfg {Object} extraParams
         * To have the count of the number or records on the server returned in the response we must have
         * every request include the '$inlinecount' param and have it set to 'allpages'
         */
        extraParams : {
            '$inlinecount' : 'allpages'
        },

        headers : {'Accept' : '*/*', 'Content-Type' : 'application/json'},

        reader : {
            type             : 'json',
            implicitIncludes : false,
            rootProperty     : 'results',
            totalProperty    : 'count'
        },

        writer : {
            type : 'json'
        },

        url : '/',

        noCache : false,

        /**
         * @cfg {Boolean} useHeaderAuthentication If you want to send authentication credentials on the request
         */
        useHeaderAuthentication : false
    },

    initialize : function () {
        this.callParent();

        this.on('exception', this.onProxyExceptionHandler);
    },

    /**
     * @private
     */
    onProxyExceptionHandler : function (thisProxy, response, operation, eopts) {
        //unauthorized access
        if (response.status === 401) {
            Ext.Azure.fireEvent('authenticationfailure', {
                message : 'Ext.azure.Proxy failed to load a resource because it requires authorization.'
            });
        }
    },

    doRequest : function (operation, callback, scope) {
        var me = this,
            data,
            writer = me.getWriter(),
            action = operation.getAction(),
            request = me.buildRequest(operation),
            headers = Ext.applyIf(Ext.Azure.getDefaultHeaders(), me.getHeaders());

        //optionally include the authorization header
        if (me.getUseHeaderAuthentication()) {
            var authorizedUser = Ext.azure.Authentication.getCurrentUser();

            if (typeof authorizedUser !== 'boolean') {
                headers['X-ZUMO-AUTH'] = authorizedUser.get('token');
            }
            else {
                Ext.Logger.error('No authorized user! Cannot add X-ZUMO-AUTH header.');
            }
        }

        request.setConfig({
            headers  : headers,
            timeout  : me.getTimeout(),
            method   : me.getMethod(request),
            callback : me.createRequestCallback(request, operation, callback, scope),
            scope    : me,
            proxy    : me
        });

        // We now always have the writer prepare the request
        request = writer.write(request);

        if (action === 'create') {
            data = request.getJsonData();
            delete data.id;
            request.setJsonData(data); //Azure does not like id in create method, and will assign id on serverside. We have to look for that id in response
        }

        Ext.Ajax.request(request.getCurrentConfig());
        return request;
    },

    buildUrl : function (request) {
        var me = this,
            operation = request.getOperation(),
            records = operation.getRecords() || [],
            record = records[0],
            model = me.getModel(),
            idProperty = model.getIdProperty(),
            url = me.getUrl(request),
            params = request.getParams() || {},
            id = (record && !record.phantom) ? record.getId() : params[idProperty],
            appUrl = Ext.Azure.getAppUrl();

        if (me.getAppendId() && id) {
            if (!url.match(/\/$/)) {
                url += '/';
            }
            url += id;
        }

        if (!appUrl) {
            Ext.Logger.error("Azure application Url not defined.");
        }

        var tableName = this.getTableName(),
            customApiName = this.getCustomApiName(),
            domainString;

        if (tableName !== null) {
            domainString = Ext.Azure.buildDomainUrl() + 'tables/' + tableName;
        }
        else if (customApiName !== null) {
            domainString = Ext.Azure.buildDomainUrl() + 'api/' + customApiName;
        }

        if (!domainString) {
            Ext.Logger.error("No tableName or customApiName have been defined on the Azure proxy.");
        }

        request.setUrl(domainString + url);

        return me.callParent([request]);
    },

    /**
     * @override
     * Override to process create actions properly.
     */
    processResponse : function (success, operation, request, response, callback, scope) {

        if (operation.getAction() === 'create') {
            // change response string to be an array, so reader can consume it properly
            response.responseText = '[' + response.responseText + ']';
        }

        this.callParent(arguments);

    },

    /**
     * @private
     * Copy any sorters, filters etc into the params so they can be sent over the wire
     */
    getParams : function (operation) {
        var me = this,
            f, val, chain,
            params = {},
            sorters = operation.getSorters(),
            filters = operation.getFilters(),
            page = operation.getPage(),
            start = operation.getStart(),
            limit = operation.getLimit(),

            pageParam = me.getPageParam(),
            startParam = me.getStartParam(),
            limitParam = me.getLimitParam(),
            sortParam = me.getSortParam(),
            filterParam = me.getFilterParam();

        if (me.getEnablePagingParams()) {
            if (pageParam && page !== null) {
                params[pageParam] = page;
            }

            if (startParam && start !== null) {
                params[startParam] = start;
            }

            if (limitParam && limit !== null) {
                params[limitParam] = limit;
            }
        }

        if (sortParam && sorters && sorters.length > 0) {
            params[sortParam] = sorters[0].getProperty() + ' ' + sorters[0].getDirection().toLowerCase();
        }

        //filters are based on predicate.
        if (filterParam && filters && filters.length > 0) {
            var filtersArr = [],
                i = 0,
                len = filters.length;

            for (i; i < len; i++) {
                f = filters[i];

                val = f.getProperty() + ' ' + f.getOperator() + ' ' + f.getValue();
                chain = f.getChainOperator() === '' ? '' : ' ' + f.getChainOperator() + ' ';
                filtersArr.push(val + chain);
            }

            params[filterParam] = filtersArr.join('');
        }

        return params;
    }
});

/**
 * Override for the Ext.device.push.Abstract class so that we can normalize the notification object
 * for all platforms (Android, BlackBerry, iOS, WindowsPhone, etc.)
 *
 * NOTE: Touch currently does not call a callback function if you add the 'override' property so instead
 * we require the Ext.device.push.Abstract class that we want to override and then in the callback we
 * call Ext.override() so that we can then override the methods we want.
 *
 */
Ext.define('Ext.azure.override.device.push.Abstract', {
                                         

}, function () {

    if (Ext.getVersion().isLessThan('2.3')) {

        Ext.override(Ext.device.push.Abstract, {

            /**
             * @override
             * Override for normalizing the notifications object returned by various platforms
             */
            onReceived: function(notifications, callback, scope) {
                if (callback) {
                    callback.call(scope, notifications);
                }
            }

        });
    }

});

/**
 * This class conditionally creates the Ext.device.push.Cordova class if the version of Touch
 * is lesss than 2.3 since since it should be included in Touch by then.
 */
Ext.define('Ext.azure.override.device.push.Cordova', {
                                         

}, function () {

    if (Ext.getVersion().isLessThan('2.3')) {

        /**
         * Cordova push class that handles registering with the Cordova pushNotifications plugin
         */
        Ext.define('Ext.device.push.Cordova', {

            extend:  Ext.device.push.Abstract ,

            statics : {
                /**
                 * @private
                 * A collection of callback methods that can be globally called by the Cordova PushPlugin
                 */
                callbacks : {}
            },

            setPushConfig : function (config) {
                var methodName = Ext.id(null, 'callback');

                //Cordova's PushPlugin needs a static method to call when notifications are received
                Ext.device.push.Cordova.callbacks[methodName] = config.callbacks.received;

                return {
                    badge         : (config.callbacks.type === Ext.device.Push.BADGE) ? "true" : "false",
                    sound         : (config.callbacks.type === Ext.device.Push.SOUND) ? "true" : "false",
                    alert         : (config.callbacks.type === Ext.device.Push.ALERT) ? "true" : "false",
                    ecb           : 'Ext.device.push.Cordova.callbacks.' + methodName,
                    senderID      : config.senderID,

                    //TODO: we will eventually want to normalize this across iOS, Android and Windows...
                    channelName   : config.channelName
                };
            },

            register : function (config) {
                config.callbacks = this.callParent(arguments);

                var pushConfig = this.setPushConfig(config),
                    plugin = window.plugins.pushNotification;

                plugin.register(
                    config.callbacks.success,
                    config.callbacks.failure,
                    pushConfig
                );

            }

        });

    }

});

/**
 * This class is used to create a new version of the 'Ext.device.Push' singleton so that an Ext.device.push.Cordova
 * class can be created.
 *
 * This code is only needed in Touch versions less than 2.3 and therefore in the Ext.azure.Push class
 * we require both classes and then in the setup method we determine which class to use.
 */
Ext.define('Ext.azure.override.device.Push', {

               
                                  
                                 
                                                  
                                                
     

}, function () {

    if (Ext.getVersion().isLessThan('2.3')) {

        /**
         * Redefining the Ext.device.Push class for Touch versions < 2.3
         * so that we can include the Cordova Push class
         */
        Ext.define('Ext.device.Push', {
            singleton: true,

                       
                                          
                                         
                                                        
              

            constructor: function() {
                var browserEnv = Ext.browser.is;

                if (browserEnv.WebView) {
                    if (!browserEnv.PhoneGap) {
                        return Ext.create('Ext.device.push.Sencha');
                    }

                    return Ext.create('Ext.device.push.Cordova');

                }

                return Ext.create('Ext.device.push.Abstract');
            }
        });

    }

});

/**
 * @class Ext.azure.Push
 *
 * The Ext.azure.Push class provides the necessary functions for you to incorporate Push notifications
 * into your application. This functionality only works in apps packaged with Cordova (currently >= 2.8.x).
 *
 * Ext.azure.Push is a wrapper for the Cordova [PushPlugin](https://github.com/phonegap-build/PushPlugin) plugin,
 * so be sure to include this (and [cordova.js](http://cordova.apache.org/docs/en/2.8.0/)) in your project.
 *
 * Additionally, you will need to follow the Azure guide for [Get Started with Push Notifications](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-ios/).
 * For a detailed guide on setting up Push notifications, please see the [Sencha Touch guide](#!/guide/mobile_services_push).
 *
 * Initialization
 * ----
 *
 * To use Ext.azure.Push you must explicitly set a **pushConfig** config property inside Ext.Azure.init():
 *
 *      Ext.application({
 *          requires: [
 *              'Ext.azure.Azure'
 *          ],
 *
 *          launch: function() {
 *              Ext.Azure.init({
 *                  appKey : 'app key here',
 *                  appUrl : 'app url here',
 *
 *                  pushConfig : {
 *                       windowsphone : 'channel_name',
 *                       android      : 'sender_id'
 *                       ios          : true
 *                  }
 *              });

 *          },
 *
 *          //......
 *      });
 *
 *
 * On iOS devices, Push Notifications require a "device ID" - this is automatically captured and set as part of
 * the init() method, so passing *true* is all you need.
 *
 * On Android devices, Push Notifications require a "registration ID".
 *
 * On Windows Phone devices, Push Notifications require a "channel ID".
 *
 *
 * Handling Events
 * ----
 *
 * Notifications are handled via events fired on Ext.Azure - specifically the **pushnotification** event.
 *
 * You may choose how to handle this event by inspecting the **event** parameter.
 *
 */
Ext.define('Ext.azure.Push', {
    singleton : true,

                
                          
                                        
      

    /**
     * @property token
     * Automatically set after a successful registration.
     */
    token : null,

    /**
     * @property platform
     * Automatically set after a successful registration.
     */
    platform : null,

    /**
     * @event pushregistrationsuccess
     * Fires when application has successfully registered for push notification service.
     * @param {Object} event
     */

    /**
     * @event pushregistrationfailure
     * Fires when application has failed push notification service registration.
     * @param {Object} event
     */

    /**
     * @event pushnotification
     * Fires when a push notification is received by the application
     * @param {Object} notification The notification object
     */

    config : {

        /**
         * For Android notifications this config is used for the senderID, which is the project number of an existing
         * Google API Project that has the Google Cloud Messaging (GCM) service enabled.
         *
         * http://developer.android.com/google/gcm/index.html
         * http://developer.android.com/google/gcm/gs.html
         */
        android : null,

        /**
         * For iOS notifications you enter true if you want notifications enabled and false if not.
         */
        ios : null,

        /**
         * For Windows Phone notifications you set this config to a channel name of your choosing.
         *
         * http://msdn.microsoft.com/en-us/library/hh221549.aspx
         */
        windowsphone : null

    },

    /**
     *  Register the PushPlugin if the device is not a desktop
     */
    init : function (config) {
        if (config) {
            this.setConfig(config);
        }

        this.platform = Ext.os.name;

        if (!Ext.os.is.Desktop) {
            this.setup();
        }
        else {
            Ext.Logger.info('Cannot register PushPlugin for a Desktop');
        }
    },

    /**
     * @private
     */
    setup : function () {
        var me = this,
            registrationConfig =  {
                scope    : me,
                type     : Ext.device.Push.ALERT,
                success  : me.registrationSuccessHandler,
                failure  : me.errorHandler,
                received : me.notificationHandler
            };

        switch (Ext.os.name) {
            case 'iOS':
                if (me.getIos()) {
                    Ext.device.Push.register(registrationConfig);
                }
                break;

            case 'WindowsPhone':
                if (me.getWindowsphone()) {
                    Ext.device.Push.register(Ext.apply(registrationConfig, { channelName: me.getWindowsphone() }));
                }
                break;

            case 'Android':
                if (me.getAndroid()) {
                    Ext.device.Push.register(Ext.apply(registrationConfig, { senderID: me.getAndroid() }));
                }
                break;

            default:
                break;
        }

    },

    registrationSuccessHandler : function (result) {
        switch (Ext.os.name) {
            case 'iOS':
                this.token = result;
                break;

            case 'WindowsPhone':
                this.token = result.uri;
                break;

            case 'Android':
                this.token = result.regid;
                break;

            default:
                break;
        }

        Ext.Azure.fireEvent('pushregistrationsuccess', result);
    },

    /**
     * @private
     */
    errorHandler : function (error) {
        Ext.Logger.error('Error registering push notification service: ' + error);

        Ext.Azure.fireEvent('pushregistrationfailure', error);
    },

    /**
     * @private
     */
    notificationHandler : function (notification) {
        if (Ext.os.is('Android')) {
            if (notification.event === 'registered' && notification.regid.length > 0) {
                this.registrationSuccessHandler(notification);
                return; // no need to fire pushnotification event if this is for the registrationId
            }
        }

        Ext.Azure.fireEvent('pushnotification', notification);
    }
});

/**
 * @private
 */
Ext.define('Ext.azure.storage.Abstract', {

                
                  
      

    config : {
        /**
         * @cfg {String}
         */
        accountName : '',

        /**
         * @cfg {String}
         */
        accessKey : '',

        /**
         * @cfg {String}
         * Used to configure the **x-ms-version** request header. Must be specified in the format YYYY-MM-DD
         * Defaults to 2012-02-12. See [Versioning for the Blob, Queue, and Table services in Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/dd894041)
         */
        msVersion : '2012-02-12',

        /**
         * @private
         */
        storageType : ''
    },

    constructor : function (config) {
        this.initConfig(config);
    },

    xmlDocumentTpl : {
        storageService : [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<StorageServiceProperties>',
            '    <Logging>',
            '        <Version>{logging.version}</Version>',
            '        <Delete>{logging.delete}</Delete>',
            '        <Read>{logging.read}</Read>',
            '        <Write>{logging.write}</Write>',
            '        <RetentionPolicy>',
            '            <Enabled>{logging.retentionPolicy.enabled}</Enabled>',
            '            <Days>{logging.retentionPolicy.days}</Days>',
            '        </RetentionPolicy>',
            '    </Logging>',
            '    <Metrics>',
            '        <Version>{metrics.version}</Version>',
            '        <Enabled>{metrics.enabled}</Enabled>',
            '        <IncludeAPIs>{metrics.includeApis}</IncludeAPIs>',
            '        <RetentionPolicy>',
            '            <Enabled>{metrics.retentionPolicy.enabled}</Enabled>',
            '            <Days>{metrics.retentionPolicy.days}</Days>',
            '        </RetentionPolicy>',
            '    </Metrics>',
            '</StorageServiceProperties>'
        ],

        acl : [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<SignedIdentifiers>',
            '    <SignedIdentifier>',
            '        <Id>{id}</Id>',
            '        <AccessPolicy>',
            '            <Start>{accessPolicy.start}</Start>',
            '            <Expiry>{accessPolicy.expiry}</Expiry>',
            '            <Permission>{accessPolicy.permission}</Permission>',
            '        </AccessPolicy>',
            '    </SignedIdentifier>',
            '</SignedIdentifiers>'
        ],

        item : [
            '<?xml version="1.0" encoding="utf-8" standalone="yes"?>',
            '<entry xmlns="http://www.w3.org/2005/Atom" ',
            '       xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" ',
            '       xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">',

            '    <updated>{updated}</updated>',
            '    {[ this.renderId(values.id) ]}',
            '    <content type="application/xml">',
            '        <m:properties>',
            '            <tpl for="properties">{[ this.renderProperty(values) ]}</tpl>',
            '        </m:properties>',
            '    </content>',
            '</entry>',

            {
                renderProperty : function (property) {
                    var propType = property.type;

                    if (!propType) {
                        propType = 'Edm.String';
                    }

                    return '<d:' + property.key + ' m:type="' + propType + '">' + property.value + '</d:' + property.key + '>';
                },

                renderId : function (id) {
                    if (id) {
                        return '<id>' + id + '</id>';
                    }

                    return '';
                }
            }
        ],

        blocklist : [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<BlockList>',
            '    <tpl for="properties">',
            '    {[ this.renderProperty(values) ]}',
            '    </tpl>',
            '</BlockList>',

            {
                renderProperty : function (property) {
                    return '<' + property.key + '>' + window.btoa(property.value) + '</' + property.key + '>';
                }
            }
        ]
    },

    /**
     * @private
     */
    _getDomain : function (excludePort) {
        var port = (excludePort) ? '' : ':443';

        return 'https://' +
               this.getAccountName() + '.' +
               this.getStorageType() + '.core.windows.net' + port;
    },

    /**
     * @private
     */
    _formatRequestUrl : function (canonicalResourceString, params) {
        return Ext.String.urlAppend(
            this._getDomain() + canonicalResourceString,
            Ext.Object.toQueryString(params)
        );
    },

    /**
     * @private
     *
     * http://msdn.microsoft.com/en-us/library/windowsazure/dd179428
     * 2009-09-19 Shared Key Lite and Table Service Format
     */
    _formatCanonicalResource : function (canonicalizedResource, params) {
        return '/' + this.getAccountName() + canonicalizedResource + this._normalizeAuthHeaderParams(params);
    },

    /**
     * @private
     */
    _formatCanonicalizedHeaders : function (headers) {
        var canonicalizedHeaders = '';

        if (headers) {
            var canonicalizedHeadersArray = [];

            Ext.Object.each(headers, function (header) {
                if (header.indexOf('x-ms-') === 0) {
                    canonicalizedHeadersArray.push(header);
                }
            });

            canonicalizedHeadersArray.sort();

            Ext.each(canonicalizedHeadersArray, function (currentHeader) {
                canonicalizedHeaders += currentHeader.toLowerCase() + ':' + headers[currentHeader] + '\n';
            });
        }

        return canonicalizedHeaders;
    },

    /**
     * @private
     */
    _formatStringToSign : function (canonicalizedResource, request) {
        if (this.getStorageType() === 'table') {
            /*
             StringToSign = Date + "\n" + CanonicalizedResource
             */
            return request.headers['x-ms-date'] + '\n' + canonicalizedResource;
        }

        /*
         StringToSign = VERB + "\n" +
         Content-MD5 + "\n" +
         Content-Type + "\n" +
         Date + "\n" +
         CanonicalizedHeaders +
         CanonicalizedResource;
         */
        return request.method + '\n' +
               (request.headers['Content-MD5'] || '') + '\n' +
               request.headers['Content-Type'] + '\n' +
               request.headers['Date'] + '\n' +
               this._formatCanonicalizedHeaders(request.headers) +
               canonicalizedResource;
    },

    /**
     * @private
     */
    _encryptSignature : function (stringToSign) {
        //https://code.google.com/p/crypto-js/#HMAC
        var encodedBits = CryptoJS.HmacSHA256(
            unescape(encodeURIComponent(stringToSign)), //UTF-8 encode the message
            CryptoJS.enc.Base64.parse(this.getAccessKey())
        ).toString(CryptoJS.enc.Base64);

        /*
         Signature=Base64(HMAC-SHA256(UTF8(StringToSign)))
         */
        return 'SharedKeyLite ' + this.getAccountName() + ':' + encodedBits;
    },

    /**
     * @private
     */
    _encodeAuthHeader : function (canonicalizedResource, params, request) {
        var canonicalizedUrl = this._formatCanonicalResource(canonicalizedResource, params),
            stringToSign = this._formatStringToSign(canonicalizedUrl, request);

        request.headers['Authorization'] = this._encryptSignature(stringToSign);

        return request;
    },

    /**
     * @private
     */
    _normalizeAuthHeaderParams : function (params) {
        var str = '';

        if (params.comp) {
            str += '?comp=' + params.comp;
        }

        return str;
    },

    /**
     * @private
     */
    _formatRequest : function (request, url, params, date) {
        if (!request.headers) {
            request.headers = {};
        }

        if (!date) {
            date = new Date();
        }

        request.headers = Ext.apply({
            /*
             The x-ms-date header is provided because some HTTP client libraries and proxies automatically set
             the Date header, and do not give the developer an opportunity to read its value in order to include
             it in the authenticated request. If you set x-ms-date, construct the signature with an empty value
             for the Date header.
             */
            'x-ms-date' : date.toUTCString(),
            'Date'      : '',

            'x-ms-version' : this.getMsVersion(),

            'accept'         : '*/*',
            'Accept-Charset' : 'UTF-8',
            'host'           : this.getAccountName() + '.' + this.getStorageType() + '.core.windows.net:443',
            'Origin'         : '',

            'X-ZUMO-VERSION' : Ext.Azure.getUserAgentString(),

            'dataserviceversion'    : '1.0;NetFx',
            'maxdataserviceversion' : '2.0;NetFx'
        }, request.headers);

        if (request.xmlData !== undefined) {
            request.headers = Ext.apply({
                'Content-Type'   : (request.xmlData.length === 0) ? '' : 'application/atom+xml',
                'Content-Length' : request.xmlData.length
            }, request.headers);
        }
        else if (request.binaryData !== undefined) {
            var length, type;

            if (request.binaryData instanceof Blob) {
                length = request.binaryData.size;
                type = request.binaryData.type;
            }
            else { //assume it's an array of some kind
                length = request.binaryData.length;
                type = 'application/octet-stream';
            }

            request.headers = Ext.apply({
                'Content-Type'   : type,
                'Content-Length' : length
            }, request.headers);
        }

        //remove any undefined headers
        Ext.Object.each(request.headers, function (header, value) {
            if (value === undefined) {
                delete request.headers[header];
            }
        });

        return this._encodeAuthHeader(url, params, request);
    },

    /**
     * @private
     */
    _applyXmlDocumentTpl : function (documentTpl, data) {
        if (!data) {
            return '';
        }

        if (!documentTpl) {
            return data;
        }

        var tpl = Ext.create('Ext.XTemplate', documentTpl);

        return tpl.apply(data);
    },

    /**
     * @private
     */
    _sendRequest : function (config) {
        Ext.Ajax.request(Ext.apply(config, {
            disableCaching      : false,
            useDefaultXhrHeader : false,
            withCredentials     : true
        }));
    },

    /**
     * @param {Function} success
     * @param {Function} failure
     */
    getStorageServiceProperties : function (success, failure) {
        var canonicalizedResource = '/',
            method = 'GET',
            params = {
                restype : 'service',
                comp    : 'properties'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : this.getMsVersion()
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    setStorageServiceProperties : function (data, success, failure) {
        var canonicalizedResource = '/',
            method = 'PUT',
            params = {
                restype : 'service',
                comp    : 'properties'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.storageService, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    }
});

/**
 * @class Ext.azure.storage.Table
 *
 * Ext.azure.storage.Table class acts as a wrapper for the [Azure Table Service REST API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179423).
 *
 *     var table = Ext.create('Ext.azure.storage.Table', {
 *         accountName : 'YOUR_ACCOUNT_NAME',
 *         accessKey   : 'YOUR_ACCESS_KEY'
 *     });
 *
 * Currently, Windows Azure does not support cross-domain (CORS) requests to the Storage Services API. As a result,
 * Ext.azure.storage.Table will **only work in a natively packaged application**.
 *
 */
Ext.define('Ext.azure.storage.Table', {

    extend :  Ext.azure.storage.Abstract ,

    config : {
        storageType : 'table'
    },

    /**
     * @private
     */
    _getEntityPath : function (table) {
        //we MUST use single quotes to surround the table name
        return "/" + table.name + "(PartitionKey='" + table.partitionKey + "',RowKey='" + table.row + "')";
    },

    /**
     * @method setStorageServiceProperties
     * @param {Object} data An object containing the elements noted in the Azure [Set Table Service Properties](http://msdn.microsoft.com/en-us/library/windowsazure/hh452240) API.
     * For example:
     *
     *     {
     *         logging : {
     *             version : '1.0',
     *             delete  : false,
     *             read    : false,
     *             write   : false,
     *
     *             retentionPolicy : {
     *                 enabled : true,
     *                 days : 7
     *             }
     *         },
     *         metrics : {
     *             version     : '1.0',
     *             enabled     : true,
     *             includeApis : false,
     *
     *             retentionPolicy : {
     *                 enabled : true,
     *                 days : 7
     *             }
     *         }
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */


    /**
     * @param {Object} params Query/Filter parameters per [Querying the Data Service](http://msdn.microsoft.com/en-us/library/dd673933.aspx)
     * @param {Function} success
     * @param {Function} failure
     */
    queryTables : function (params, success, failure) {
        var canonicalizedResource = '/Tables',
            method = 'GET';

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                headers : {
                    'x-ms-version' : undefined
                },
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} data An object containing the relevant properties of a [Table Storage Data Model](http://msdn.microsoft.com/en-us/library/windowsazure/dd179338).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             { key : 'TableName', value : 'myTableName' }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     *
     */
    createTable : function (data, success, failure) {
        var canonicalizedResource = '/Tables',
            method = 'POST',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name : 'myTable'
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    deleteTable : function (table, success, failure) {
        var canonicalizedResource = "/Tables('" + table.name + "')", //we MUST use single quotes to surround the table name
            method = 'DELETE',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : undefined
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name : 'myTable'
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    getTableAcl : function (table, success, failure) {
        var canonicalizedResource = '/' + table.name,
            method = 'GET',
            params = {
                comp : 'acl'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name : 'myTable'
     *     }
     *
     * @param {Object} data An object containing the elements noted in the Azure [Set Table ACL](http://msdn.microsoft.com/en-us/library/windowsazure/jj159102) API.
     * For example:
     *
     *     {
     *         id : 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=',
     *
     *         accessPolicy : {
     *             start      : '2009-09-28T08:49:37.0000000Z',
     *             expiry     : '2009-09-28T08:49:37.0000000Z',
     *             permission : 'raud'
     *         }
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    setTableAcl : function (table, data, success, failure) {
        var canonicalizedResource = '/' + table.name,
            method = 'PUT',
            params = {
                comp : 'acl'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.acl, data);


        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable'
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    queryEntities : function (table, success, failure) {
        var canonicalizedResource = '/' + table.name,
            method = 'GET',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                headers : {
                    'x-ms-version' : undefined
                },
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name : 'myTable'
     *     }
     *
     * @param {Object} data An object containing the relevant properties of an [Entity](http://msdn.microsoft.com/en-us/library/windowsazure/dd894033).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             {
     *                 key : 'Address',
     *                 value : '123 Test Ave.'
     *             },
     *             {
     *                 key : 'CustomerCode',
     *                 type: 'Edm.Guid',
     *                 value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
     *             }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    insertEntity : function (table, data, success, failure) {
        var canonicalizedResource = '/' + table.name,
            method = 'POST',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable',
     *         partitionKey : 'partition-key',
     *         row          : 123
     *     }
     *
     * @param {Object} data An object containing the relevant properties of an [Entity](http://msdn.microsoft.com/en-us/library/windowsazure/dd894033).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             {
     *                 key : 'Address',
     *                 value : '123 Test Ave.'
     *             },
     *             {
     *                 key : 'CustomerCode',
     *                 type: 'Edm.Guid',
     *                 value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
     *             }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    insertOrMergeEntity : function (table, data, success, failure) {
        var canonicalizedResource = this._getEntityPath(table),
            method = 'MERGE',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable',
     *         partitionKey : 'partition-key',
     *         row          : 123
     *     }
     *
     * @param {Object} data An object containing the relevant properties of an [Entity](http://msdn.microsoft.com/en-us/library/windowsazure/dd894033).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             {
     *                 key : 'Address',
     *                 value : '123 Test Ave.'
     *             },
     *             {
     *                 key : 'CustomerCode',
     *                 type: 'Edm.Guid',
     *                 value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
     *             }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    insertOrReplaceEntity : function (table, data, success, failure) {
        var canonicalizedResource = this._getEntityPath(table),
            method = 'PUT',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable',
     *         partitionKey : 'partition-key',
     *         row          : 123
     *     }
     *
     * @param {Object} data An object containing the relevant properties of an [Entity](http://msdn.microsoft.com/en-us/library/windowsazure/dd894033).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             {
     *                 key : 'Address',
     *                 value : '123 Test Ave.'
     *             },
     *             {
     *                 key : 'CustomerCode',
     *                 type: 'Edm.Guid',
     *                 value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
     *             }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    updateEntity : function (table, data, success, failure) {
        var canonicalizedResource = this._getEntityPath(table),
            method = 'PUT',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18',

                    //Specifies the condition for which the update should be performed. To force an unconditional update, set If-Match to the wildcard character (*).
                    'If-Match'     : '*'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable',
     *         partitionKey : 'partition-key',
     *         row          : 123
     *     }
     *
     * @param {Object} data An object containing the relevant properties of an [Entity](http://msdn.microsoft.com/en-us/library/windowsazure/dd894033).
     * Note that these properties are configured as key/value pairs.
     *
     * For example:
     *
     *     {
     *         properties : [
     *             {
     *                 key : 'Address',
     *                 value : '123 Test Ave.'
     *             },
     *             {
     *                 key : 'CustomerCode',
     *                 type: 'Edm.Guid',
     *                 value : 'c9da6455-213d-42c9-9a79-3e9149a57833'
     *             }
     *         ]
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    mergeEntity : function (table, data, success, failure) {
        var canonicalizedResource = this._getEntityPath(table),
            method = 'MERGE',
            params = {},
            date = new Date();

        data = Ext.apply(data, {
            updated : date.toISOString()
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.item, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    'x-ms-version' : '2011-08-18',

                    //Specifies the condition for which the update should be performed. To force an unconditional update, set If-Match to the wildcard character (*).
                    'If-Match'     : '*'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params,
            date
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} table Details about the table
     * For example:
     *
     *     {
     *         name         : 'myTable',
     *         partitionKey : 'partition-key',
     *         row          : 123
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    deleteEntity : function (table, success, failure) {
        var canonicalizedResource = this._getEntityPath(table),
            method = 'DELETE',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : {
                    //Specifies the condition for which the update should be performed. To force an unconditional update, set If-Match to the wildcard character (*).
                    'If-Match' : '*',

                    'x-ms-version' : '2011-08-18'
                },
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    }

});

/**
 * @class Ext.azure.storage.Blob
 *
 * Ext.azure.storage.Blob class acts as a wrapper for the [Azure Blob Service REST API](http://msdn.microsoft.com/en-us/library/windowsazure/dd135733.aspx).
 *
 *     var blob = Ext.create('Ext.azure.storage.Blob', {
 *         accountName : 'YOUR_ACCOUNT_NAME',
 *         accessKey   : 'YOUR_ACCESS_KEY'
 *     });
 *
 * Currently, Windows Azure does not support cross-domain (CORS) requests to the Storage Services API. As a result,
 * Ext.azure.storage.Blob will **only work in a natively packaged application**.
 */
Ext.define('Ext.azure.storage.Blob', {

    extend :  Ext.azure.storage.Abstract ,

    config : {
        storageType : 'blob'
    },

    /**
     * @method setStorageServiceProperties
     * @param {Object} data An object containing the elements noted in the Azure [Set Blob Service Properties](http://msdn.microsoft.com/en-us/library/windowsazure/hh452235.aspx) API.
     * For example:
     *
     *     {
     *         logging : {
     *             version : '1.0',
     *             delete  : false,
     *             read    : false,
     *             write   : false,
     *
     *             retentionPolicy : {
     *                 enabled : true,
     *                 days : 7
     *             }
     *         },
     *         metrics : {
     *             version     : '1.0',
     *             enabled     : true,
     *             includeApis : false,
     *
     *             retentionPolicy : {
     *                 enabled : true,
     *                 days : 7
     *             }
     *         }
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */

    /**
     * @private
     */
    _isBlob : function (blob) {
        return (blob instanceof Blob || blob instanceof Array);
    },

    /**
     * @private
     */
    _setRangeHeader : function (headers, rangeStart, rangeEnd) {
        var rangeHeader = '';

        if ((rangeStart && rangeStart % 512 !== 0) ||
            (rangeEnd && (rangeEnd + 1) % 512 !== 0)) {
            Ext.Logger.error('rangeStart or rangeEnd have not been configured correctly for this request.');
        }

        if (rangeStart >= 0) {
            rangeHeader = 'bytes=' + rangeStart + '-';
        }

        if (rangeHeader !== '' && rangeEnd >= 0) {
            rangeHeader += rangeEnd;
        }

        if (rangeHeader !== '') {
            Ext.apply(headers, {
                'x-ms-range' : rangeHeader
            });
        }

        return headers;
    },

    /**
     * @private
     */
    _setLeaseHeaders : function (config, headers) {
        Ext.apply(headers, {
            'x-ms-lease-action' : config.operation
        });

        if (config.leaseId !== undefined) {
            headers['x-ms-lease-id'] = config.leaseId;
        }

        if (config.leaseBreakPeriod !== undefined) {
            headers['x-ms-lease-break-period'] = config.leaseBreakPeriod;
        }

        if (config.leaseDuration !== undefined) {
            headers['x-ms-lease-duration'] = config.leaseDuration;
        }

        if (config.proposedLeaseId !== undefined) {
            headers['x-ms-proposed-lease-id'] = config.proposedLeaseId;
        }

        return headers;
    },

    /**
     * @param {Object} params Additional parameters per [List Containers](http://msdn.microsoft.com/en-us/library/windowsazure/dd179352.aspx)
     * @param {Function} success
     * @param {Function} failure
     */
    listContainers : function (params, success, failure) {
        var canonicalizedResource = '/',
            method = 'GET';

        if (!params) {
            params = {};
        }
        params = Ext.apply(params, {
            comp : 'list'
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'myContainer'
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    createContainer : function (config, success, failure) {
        var canonicalizedResource = '/' + config.container,
            method = 'PUT',
            params = {
                restype : 'container'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} container An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'myContainer',
     *
     *         operation : 'acquire', //or 'renew', 'change', 'release', 'break'
     *
     *         leaseId : '...' //Required to renew, change, or release the lease
     *
     *         leaseDuration    : '', //only allowed and required on an acquire operation. Specifies the duration of the lease, in seconds, or negative one (-1) for a lease that never expires. A non-infinite lease can be between 15 and 60 seconds.
     *         leaseBreakPeriod : '', //For a break operation, this is the proposed duration of seconds that the lease should continue before it is broken, between 0 and 60 seconds.
     *         proposedLeaseId  : ''  //optional for acquire, required for change. Proposed lease ID, in a GUID string format
     *     }
     *
     * @param {Object} headers An object containing any optional headers
     * @param {Function} success
     * @param {Function} failure
     *
     * See the [Lease Container API](http://msdn.microsoft.com/en-us/library/windowsazure/jj159103.aspx) for more information.
     */
    leaseContainer : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container,
            method = 'PUT',
            params = {
                restype : 'container',
                comp    : 'lease'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';
        headers = headers || {};

        headers = this._setLeaseHeaders(config, headers);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'myContainer',
     *         leaseId   : 123
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    deleteContainer : function (config, success, failure) {
        var canonicalizedResource = '/' + config.container,
            method = 'DELETE',
            params = {
                restype : 'container'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var headers = {};

        if (config.leaseId) {
            headers['x-ms-lease-id'] = config.leaseId;
        }

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'myContainer',
     *         leaseId   : 123
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    getContainerProperties : function (config, success, failure) {
        var canonicalizedResource = '/' + config.container,
            method = 'GET',
            params = {
                restype : 'container'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var headers = {};

        if (config.leaseId) {
            headers['x-ms-lease-id'] = config.leaseId;
        }

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'myContainer',
     *         leaseId   : 123
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    getContainerMetaData : function (config, success, failure) {
        var canonicalizedResource = '/' + config.container,
            method = 'GET',
            params = {
                restype : 'container',
                comp    : 'metadata'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var headers = {};

        if (config.leaseId) {
            headers['x-ms-lease-id'] = config.leaseId;
        }

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'myContainer'
     *     }
     *
     * @param {Object} headers An object containing any optional headers
     * @param {Function} success
     * @param {Function} failure
     *
     * See the [Set Container MetaData API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179362.aspx) for more information.
     */
    setContainerMetaData : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container,
            method = 'PUT',
            params = {
                restype : 'container',
                comp    : 'metadata'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'myContainer'
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     */
    getContainerAcl : function (config, success, failure) {
        var canonicalizedResource = '/' + config.container,
            method = 'GET',
            params = {
                restype : 'container',
                comp    : 'acl'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var headers = {};

        if (config.leaseId) {
            headers['x-ms-lease-id'] = config.leaseId;
        }

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'myContainer'
     *     }
     *
     * @param {Object} data An object containing the elements noted in the Azure [Set Container ACL API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179391.aspx)
     * For example:
     *
     *     {
     *         id : 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=',
     *
     *         accessPolicy : {
     *             start      : '2009-09-28T08:49:37.0000000Z',
     *             expiry     : '2009-09-28T08:49:37.0000000Z',
     *             permission : 'rwd'
     *         }
     *     }
     *
     * @param {Object} headers An object containing any optional headers
     * @param {Function} success
     * @param {Function} failure
     *
     * See the [Set Container ACL API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179391.aspx) for more information.
     */
    setContainerAcl : function (config, data, headers, success, failure) {
        var canonicalizedResource = '/' + config.container,
            method = 'PUT',
            params = {
                restype : 'container',
                comp    : 'acl'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.acl, data);
        headers = headers || {};

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'myContainer'
     *     }
     *
     * @param {Object} params An object containing optional parameters to send to the API per [List Blobs API](http://msdn.microsoft.com/en-us/library/windowsazure/dd135734.aspx)
     * @param {Function} success
     * @param {Function} failure
     */
    listBlobs : function (config, params, success, failure) {
        var canonicalizedResource = '/' + config.container,
            method = 'GET';

        if (!params) {
            params = {};
        }
        params = Ext.apply(params, {
            restype : 'container',
            comp    : 'list'
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container   : 'myContainer',
     *         blobName    : 'myBlob',
     *
     *         blobContentLength : 512 //specifies the maximum size for the page blob, up to 1 TB. The page blob size must be aligned to a 512-byte boundary.
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Put Blob API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179451.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    setPageBlob : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'PUT',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';
        headers = headers || {};

        if (!config.blobContentLength) {
            Ext.Logger.error('blobContentLength has not been configured correctly for this request.');
            return false;
        }

        Ext.apply(headers, {
            'x-ms-blob-type'           : 'PageBlob',
            'x-ms-blob-content-length' : config.blobContentLength
        });

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);

    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container   : 'myContainer',
     *         blobName    : 'myBlob',
     *         blobContent : '...',
     *
     *         publicAccessLevel : '' //Optional. See Put Blob API for more info: http://msdn.microsoft.com/en-us/library/windowsazure/dd179451.aspx
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Put Blob API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179451.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    setBlockBlob : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'PUT',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = config.blobContent || '';
        headers = headers || {};

        headers = Ext.apply({
            'x-ms-blob-type'          : 'BlockBlob',
            'x-ms-blob-public-access' : (config.publicAccessLevel === '' || config.publicAccessLevel === null || config.publicAccessLevel === undefined) ? undefined : config.publicAccessLevel
        }, headers);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,

                xmlData    : this._isBlob(requestBody) ? undefined : requestBody,
                binaryData : this._isBlob(requestBody) ? requestBody : undefined,

                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container    : 'myContainer',
     *         blobName     : 'myBlob',
     *         responseType : 'blob' // or 'arraybuffer', or can be undefined
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Get Blob API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179440.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    getBlob : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'GET',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url          : url,
                method       : method,
                headers      : headers,
                xmlData      : requestBody,
                success      : success,
                failure      : failure,
                xhr2         : true,
                responseType : config.responseType
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container   : 'myContainer',
     *         blobName    : 'myBlob'
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Delete Blob API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179413.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    deleteBlob : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'DELETE',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} container An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'myContainer',
     *         blobName  : 'myBlob',
     *
     *         operation : 'acquire', //or 'renew', 'change', 'release', 'break'
     *
     *         leaseId : '...' //Required to renew, change, or release the lease
     *
     *         leaseDuration    : '', //only allowed and required on an acquire operation. Specifies the duration of the lease, in seconds, or negative one (-1) for a lease that never expires. A non-infinite lease can be between 15 and 60 seconds.
     *         leaseBreakPeriod : '', //For a break operation, this is the proposed duration of seconds that the lease should continue before it is broken, between 0 and 60 seconds.
     *         proposedLeaseId  : ''  //optional for acquire, required for change. Proposed lease ID, in a GUID string format
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Lease Blob API](http://msdn.microsoft.com/en-us/library/windowsazure/ee691972.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    leaseBlob : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'PUT',
            params = {
                comp : 'lease'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';
        headers = headers || {};

        headers = this._setLeaseHeaders(config, headers);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     *
     * @param {Object} config An object containing the relevant properties for this request.
     *
     * For example:
     *
     *     {
     *         container : 'mycontainer',
     *         blobName  : 'mynewblob',
     *         url       : 'https://myaccount.blob.core.windows.net/mycontainer/myblob' //URL of blob to be copied
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Copy Blob API](http://msdn.microsoft.com/en-us/library/windowsazure/dd894037.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    copyBlob : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'PUT',
            params = {};

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';
        headers = headers || {};

        headers['x-ms-copy-source'] = config.url;

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for this request.
     *
     * For example:
     *
     *     {
     *         container : 'mycontainer',
     *         blobName  : 'mynewblob'
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Snapshop Blob API](http://msdn.microsoft.com/en-us/library/windowsazure/ee691971.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    getBlobSnapshot : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'PUT',
            params = {
                comp : 'snapshot'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for this request.
     *
     * For example:
     *
     *     {
     *         container : 'mycontainer',
     *         blobName  : 'mynewblob',
     *         copyId    : 123,
     *         leaseId   : 456
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     *
     * See the [Abort Copy Blob API](http://msdn.microsoft.com/en-us/library/windowsazure/jj159098.aspx) for more information.
     */
    abortBlobCopy : function (config, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'PUT',
            params = {
                comp   : 'copy',
                copyid : config.copyId
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var headers = {
            'x-ms-copy-action' : 'abort'
        };

        if (config.leaseId) {
            headers['x-ms-lease-id'] = config.leaseId;
        }

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for this request.
     *
     * For example:
     *
     *     {
     *         container    : 'mycontainer',
     *         blobName     : 'mynewblob',
     *         blockId      : 123,
     *         blockContent : 456
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Put Block API](http://msdn.microsoft.com/en-us/library/windowsazure/dd135726.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    putBlock : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'PUT',
            params = {
                comp    : 'block',
                blockid : window.btoa(config.blockId) //base64 encode the block ID
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = config.blockContent;

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,

                xmlData    : this._isBlob(requestBody) ? undefined : requestBody,
                binaryData : this._isBlob(requestBody) ? requestBody : undefined,

                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for this request.
     *
     * For example:
     *
     *     {
     *         container    : 'mycontainer',
     *         blobName     : 'mynewblob'
     *     }
     *
     * @param {Object} data An object containing the elements for the request body
     * For example:
     *
     *     {
     *         properties : [
     *             { key : 'Committed', value : 'base64-encoded-block-id' },
     *             { key : 'Uncommitted', value : 'base64-encoded-block-id' },
     *             { key : 'Latest', value : 'base64-encoded-block-id' }
     *
     *         ]
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Put Block List API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179467.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    putBlockList : function (config, data, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'PUT',
            params = {
                comp : 'blocklist'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = this._applyXmlDocumentTpl(this.xmlDocumentTpl.blocklist, data);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for this request.
     *
     * For example:
     *
     *     {
     *         container    : 'mycontainer',
     *         blobName     : 'mynewblob'
     *     }
     *
     * @param {Object} params An object containing optional parameters for the request
     * @param {Object} headers An object containing any optional headers per the [Get Block List API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179400.aspx).
     * @param {Function} success
     * @param {Function} failure
     *
     */
    getBlockList : function (config, params, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'GET';

        if (!params) {
            params = {};
        }
        params = Ext.apply(params, {
            comp : 'blocklist'
        });

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     *
     * @param {Object} config An object containing the relevant properties for this request.
     *
     * For example:
     *
     *     {
     *         container    : 'mycontainer',
     *         blobName     : 'mynewblob',
     *
     *         //these numbers must be divisible by 512 (-1 for rangeEnd)
     *         //see http://msdn.microsoft.com/en-us/library/windowsazure/ee691967.aspx
     *         rangeStart : 0,
     *         rangeEnd   : 511,
     *
     *         operation : 'update', //or 'clear'
     *
     *         blobContent : '...' //if operation === 'update'
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Put Page API](http://msdn.microsoft.com/en-us/library/windowsazure/ee691975.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    putPage : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'PUT',
            params = {
                comp : 'page'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = (config.operation === 'update') ? config.blobContent : '';
        headers = headers || {};

        headers = this._setRangeHeader(headers, config.rangeStart, config.rangeEnd);

        headers = Ext.apply({
            'x-ms-page-write' : config.operation,
            'Content-Type'    : 'application/octet-stream'
        }, headers);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,

                xmlData    : this._isBlob(requestBody) ? undefined : requestBody,
                binaryData : this._isBlob(requestBody) ? requestBody : undefined,

                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for this request.
     *
     * For example:
     *
     *     {
     *         container    : 'mycontainer',
     *         blobName     : 'mynewblob',
     *
     *         //these numbers must be divisible by 512 (-1 for rangeEnd)
     *         //see http://msdn.microsoft.com/en-us/library/windowsazure/ee691967.aspx
     *         rangeStart : 0,
     *         rangeEnd   : 511,
     *
     *         snapshotId : 123 //optional
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Get Page Ranges API](http://msdn.microsoft.com/en-us/library/windowsazure/ee691973.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    getPageRanges : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'GET',
            params = {
                comp : 'pagelist'
            };

        if (config.snapshotId) {
            params.snapshot = config.snapshotId;
        }

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';
        headers = headers || {};

        headers = this._setRangeHeader(headers, config.rangeStart, config.rangeEnd);

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'mycontainer',
     *         blobName  : 'myblob',
     *         leaseId   : 123
     *     }
     *
     * @param {Function} success
     * @param {Function} failure
     *
     */
    getBlobMetaData : function (config, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'GET',
            params = {
                comp : 'metadata'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var headers = {};

        if (config.leaseId) {
            headers['x-ms-lease-id'] = config.leaseId;
        }

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    },

    /**
     * @param {Object} config An object containing the relevant properties for the request.
     *
     * For example:
     *
     *     {
     *         container : 'mycontainer',
     *         blobName  : 'myblob'
     *     }
     *
     * @param {Object} headers An object containing any optional headers per the [Set Blob Metadata API](http://msdn.microsoft.com/en-us/library/windowsazure/dd179414.aspx).
     * @param {Function} success
     * @param {Function} failure
     */
    setBlobMetaData : function (config, headers, success, failure) {
        var canonicalizedResource = '/' + config.container + '/' + config.blobName,
            method = 'PUT',
            params = {
                comp : 'metadata'
            };

        var url = this._formatRequestUrl(canonicalizedResource, params);
        var requestBody = '';

        var request = this._formatRequest(
            {
                url     : url,
                method  : method,
                headers : headers,
                xmlData : requestBody,
                success : success,
                failure : failure
            },
            canonicalizedResource,
            params
        );

        this._sendRequest(request);
    }
});

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
    mixins : [  Ext.mixin.Observable  ],

    singleton : true,

    version : '1.0.3.20140212154510',

                
                                   
                         
                          
                         

                                  
                                
      

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
            Ext.Logger.error('Azure appUrl and/or appKey configs are missing. Aborting Azure initialization.');
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
    extend :  Ext.app.Controller ,

                
                         
      

    init : function() {
        var azure   = Ext.azure.Azure,
            config  = this.getApplication().config.azure;

        //add property to Ext.application.app
        this.getApplication().azure = this;

        azure.init(config);
    }

});

/**
 * Convenience class for Sencha Architect
 */
Ext.define('Ext.azure.Store', {
    extend   :  Ext.data.Store ,
    alias    : 'store.azure' 
                
                         
     
});

