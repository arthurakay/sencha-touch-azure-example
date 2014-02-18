/**
 * @private
 */
Ext.define('Ext.azure.storage.Abstract', {

    requires : [
        'Ext.Date'
    ],

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