/**
 * @private
 */
Ext.define('Ext.azure.AuthWindow', {
    singleton : true,

    requires : [
        'Ext.Ajax'
    ],

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