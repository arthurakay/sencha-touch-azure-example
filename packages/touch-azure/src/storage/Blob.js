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

    extend : 'Ext.azure.storage.Abstract',

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

        //<debug>
        if ((rangeStart && rangeStart % 512 !== 0) ||
            (rangeEnd && (rangeEnd + 1) % 512 !== 0)) {
            Ext.Logger.error('rangeStart or rangeEnd have not been configured correctly for this request.');
        }
        //</debug>

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

        //<debug>
        if (!config.blobContentLength) {
            Ext.Logger.error('blobContentLength has not been configured correctly for this request.');
            return false;
        }
        //</debug>

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