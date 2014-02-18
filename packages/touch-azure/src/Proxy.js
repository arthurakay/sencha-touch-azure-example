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
    extend : 'Ext.data.proxy.Ajax',

    requires : [
        'Ext.azure.Filter',
        'Ext.util.MixedCollection',
        'Ext.Ajax',
        'Ext.azure.override.JsonReader'
    ],

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
            //<debug>
            else {
                Ext.Logger.error('No authorized user! Cannot add X-ZUMO-AUTH header.');
            }
            //</debug>
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

        //<debug>
        if (!appUrl) {
            Ext.Logger.error("Azure application Url not defined.");
        }
        //</debug>

        var tableName = this.getTableName(),
            customApiName = this.getCustomApiName(),
            domainString;

        if (tableName !== null) {
            domainString = Ext.Azure.buildDomainUrl() + 'tables/' + tableName;
        }
        else if (customApiName !== null) {
            domainString = Ext.Azure.buildDomainUrl() + 'api/' + customApiName;
        }

        //<debug>
        if (!domainString) {
            Ext.Logger.error("No tableName or customApiName have been defined on the Azure proxy.");
        }
        //</debug>

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