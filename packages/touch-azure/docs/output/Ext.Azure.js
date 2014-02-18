Ext.data.JsonP.Ext_Azure({"tagname":"class","name":"Ext.Azure","autodetected":{},"files":[{"filename":"Azure.js","href":"Azure.html#Ext-Azure"}],"alternateClassNames":["Ext.azure.Azure"],"members":[{"name":"appKey","tagname":"cfg","owner":"Ext.Azure","id":"cfg-appKey","meta":{}},{"name":"appUrl","tagname":"cfg","owner":"Ext.Azure","id":"cfg-appUrl","meta":{}},{"name":"authIdentities","tagname":"cfg","owner":"Ext.Azure","id":"cfg-authIdentities","meta":{}},{"name":"protocol","tagname":"cfg","owner":"Ext.Azure","id":"cfg-protocol","meta":{}},{"name":"pushConfig","tagname":"cfg","owner":"Ext.Azure","id":"cfg-pushConfig","meta":{}},{"name":"currentUser","tagname":"property","owner":"Ext.Azure","id":"property-currentUser","meta":{}},{"name":"version","tagname":"property","owner":"Ext.Azure","id":"property-version","meta":{"private":true}},{"name":"constructor","tagname":"method","owner":"Ext.Azure","id":"method-constructor","meta":{"private":true}},{"name":"buildDomainUrl","tagname":"method","owner":"Ext.Azure","id":"method-buildDomainUrl","meta":{}},{"name":"getAppKey","tagname":"method","owner":"Ext.Azure","id":"method-getAppKey","meta":{}},{"name":"getAppUrl","tagname":"method","owner":"Ext.Azure","id":"method-getAppUrl","meta":{}},{"name":"getAuthIdentities","tagname":"method","owner":"Ext.Azure","id":"method-getAuthIdentities","meta":{}},{"name":"getCurrentUser","tagname":"method","owner":"Ext.Azure","id":"method-getCurrentUser","meta":{}},{"name":"getDefaultHeaders","tagname":"method","owner":"Ext.Azure","id":"method-getDefaultHeaders","meta":{"private":true}},{"name":"getProtocol","tagname":"method","owner":"Ext.Azure","id":"method-getProtocol","meta":{}},{"name":"getPushConfig","tagname":"method","owner":"Ext.Azure","id":"method-getPushConfig","meta":{}},{"name":"getUserAgentString","tagname":"method","owner":"Ext.Azure","id":"method-getUserAgentString","meta":{"private":true}},{"name":"init","tagname":"method","owner":"Ext.Azure","id":"method-init","meta":{}},{"name":"invokeApi","tagname":"method","owner":"Ext.Azure","id":"method-invokeApi","meta":{}},{"name":"setAppKey","tagname":"method","owner":"Ext.Azure","id":"method-setAppKey","meta":{}},{"name":"setAppUrl","tagname":"method","owner":"Ext.Azure","id":"method-setAppUrl","meta":{}},{"name":"setAuthIdentities","tagname":"method","owner":"Ext.Azure","id":"method-setAuthIdentities","meta":{}},{"name":"setProtocol","tagname":"method","owner":"Ext.Azure","id":"method-setProtocol","meta":{}},{"name":"setPushConfig","tagname":"method","owner":"Ext.Azure","id":"method-setPushConfig","meta":{}},{"name":"authenticationfailure","tagname":"event","owner":"Ext.Azure","id":"event-authenticationfailure","meta":{}},{"name":"authenticationlogout","tagname":"event","owner":"Ext.Azure","id":"event-authenticationlogout","meta":{}},{"name":"authenticationsuccess","tagname":"event","owner":"Ext.Azure","id":"event-authenticationsuccess","meta":{}},{"name":"pushnotification","tagname":"event","owner":"Ext.Azure","id":"event-pushnotification","meta":{}},{"name":"pushregistrationfailure","tagname":"event","owner":"Ext.Azure","id":"event-pushregistrationfailure","meta":{}},{"name":"pushregistrationsuccess","tagname":"event","owner":"Ext.Azure","id":"event-pushregistrationsuccess","meta":{}}],"aliases":{},"id":"class-Ext.Azure","short_doc":"The Ext.Azure class provides access to Windows Azure Mobile services from your Sencha Touch\napplication. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Alternate names</h4><div class='alternate-class-name'>Ext.azure.Azure</div><h4>Files</h4><div class='dependency'><a href='source/Azure.html#Ext-Azure' target='_blank'>Azure.js</a></div></pre><div class='doc-contents'><p>The <a href=\"#!/api/Ext.Azure\" rel=\"Ext.Azure\" class=\"docClass\">Ext.Azure</a> class provides access to Windows Azure Mobile services from your Sencha Touch\napplication. The current services which are provided in this SDK include Data, Authentication\nand Push.</p>\n\n<h2>Initialization</h2>\n\n<p>To initialize your application for use with the <a href=\"#!/api/Ext.Azure\" rel=\"Ext.Azure\" class=\"docClass\">Ext.Azure</a> SDK you will need to require the class in your\napplication and then initialize the key and url settings during application launch.</p>\n\n<p>Let's take a look at\na typical setup. Here we include the Azure class by use of the <strong>requires</strong> property in your application,\nand then we set the values for your application key and URL when your application is launched :</p>\n\n<pre><code> Ext.application({\n\n     requires: [ '<a href=\"#!/api/Ext.Azure\" rel=\"Ext.Azure\" class=\"docClass\">Ext.azure.Azure</a>' ],\n\n     launch: function() {\n         <a href=\"#!/api/Ext.Azure-method-init\" rel=\"Ext.Azure-method-init\" class=\"docClass\">Ext.Azure.init</a>({\n             appKey: 'app key here',\n             appUrl: 'app url here'\n         });\n\n         //......\n\n     }\n });\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-appKey' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-appKey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-cfg-appKey' class='name expandable'>appKey</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The application key as created in the Manage Keys sections of your Azure portal</p>\n</div><div class='long'><p>The application key as created in the Manage Keys sections of your Azure portal</p>\n</div></div></div><div id='cfg-appUrl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-appUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-cfg-appUrl' class='name expandable'>appUrl</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The application url as specified in your Windows Azure app setup.</p>\n</div><div class='long'><p>The application url as specified in your Windows Azure app setup.</p>\n</div></div></div><div id='cfg-authIdentities' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-authIdentities' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-cfg-authIdentities' class='name expandable'>authIdentities</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>List of auth providers configured in Azure portal. ...</div><div class='long'><p>List of auth providers configured in Azure portal. Can be \"microsoft\", \"google\", \"facebook\" or \"twitter\".\nDefaults to []</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='cfg-protocol' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-protocol' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-cfg-protocol' class='name expandable'>protocol</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Protocol used by this application. ...</div><div class='long'><p>Protocol used by this application. Should be either http or https.</p>\n<p>Defaults to: <code>'http'</code></p></div></div></div><div id='cfg-pushConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-pushConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-cfg-pushConfig' class='name expandable'>pushConfig</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>An object containing key/value pairs for the platforms on which Push Notifications are enabled:\n\n\nwindowsphone (chann...</div><div class='long'><p>An object containing key/value pairs for the platforms on which Push Notifications are enabled:</p>\n\n<ul>\n<li>windowsphone (channel)</li>\n<li>android (sender ID)</li>\n<li><p>ios (true)</p>\n\n<pre><code>pushConfig : {\n    windowsphone : 'channel_name',\n    android      : 'sender_id'\n    ios          : true\n}\n</code></pre></li>\n</ul>\n\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-currentUser' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-property-currentUser' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-property-currentUser' class='name expandable'>currentUser</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>An object that represents the current authenticated user.</p>\n</div><div class='long'><p>An object that represents the current authenticated user.</p>\n</div></div></div><div id='property-version' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-property-version' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-property-version' class='name expandable'>version</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'1.0.3.20140212154510'</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Ext.Azure-method-constructor' class='name expandable'>Ext.Azure</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Ext.Azure\" rel=\"Ext.Azure\" class=\"docClass\">Ext.Azure</a><span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Ext.Azure\" rel=\"Ext.Azure\" class=\"docClass\">Ext.Azure</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-buildDomainUrl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-method-buildDomainUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-buildDomainUrl' class='name expandable'>buildDomainUrl</a>( <span class='pre'></span> ) : string<span class=\"signature\"></span></div><div class='description'><div class='short'>Contructs the Builds the application URL ...</div><div class='long'><p>Contructs the Builds the application URL</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>string</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getAppKey' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-appKey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-getAppKey' class='name expandable'>getAppKey</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of appKey. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/Ext.Azure-cfg-appKey\" rel=\"Ext.Azure-cfg-appKey\" class=\"docClass\">appKey</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getAppUrl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-appUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-getAppUrl' class='name expandable'>getAppUrl</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of appUrl. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/Ext.Azure-cfg-appUrl\" rel=\"Ext.Azure-cfg-appUrl\" class=\"docClass\">appUrl</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getAuthIdentities' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-authIdentities' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-getAuthIdentities' class='name expandable'>getAuthIdentities</a>( <span class='pre'></span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of authIdentities. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/Ext.Azure-cfg-authIdentities\" rel=\"Ext.Azure-cfg-authIdentities\" class=\"docClass\">authIdentities</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getCurrentUser' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-method-getCurrentUser' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-getCurrentUser' class='name expandable'>getCurrentUser</a>( <span class='pre'></span> ) : <a href=\"#!/api/Ext.azure.User\" rel=\"Ext.azure.User\" class=\"docClass\">Ext.azure.User</a><span class=\"signature\"></span></div><div class='description'><div class='short'>When app is successfully authenticated, this method will return the current user object which contains\ntoken informat...</div><div class='long'><p>When app is successfully authenticated, this method will return the current user object which contains\ntoken information.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Ext.azure.User\" rel=\"Ext.azure.User\" class=\"docClass\">Ext.azure.User</a></span><div class='sub-desc'><p>User object</p>\n</div></li></ul></div></div></div><div id='method-getDefaultHeaders' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-method-getDefaultHeaders' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-getDefaultHeaders' class='name expandable'>getDefaultHeaders</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getProtocol' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-protocol' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-getProtocol' class='name expandable'>getProtocol</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of protocol. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/Ext.Azure-cfg-protocol\" rel=\"Ext.Azure-cfg-protocol\" class=\"docClass\">protocol</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getPushConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-pushConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-getPushConfig' class='name expandable'>getPushConfig</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of pushConfig. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/Ext.Azure-cfg-pushConfig\" rel=\"Ext.Azure-cfg-pushConfig\" class=\"docClass\">pushConfig</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getUserAgentString' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-method-getUserAgentString' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-getUserAgentString' class='name expandable'>getUserAgentString</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-init' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-init' class='name expandable'>init</a>( <span class='pre'>config</span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Initialize Ext.Azure for use ...</div><div class='long'><p>Initialize <a href=\"#!/api/Ext.Azure\" rel=\"Ext.Azure\" class=\"docClass\">Ext.Azure</a> for use</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'><p>True for successful initialization.</p>\n</div></li></ul></div></div></div><div id='method-invokeApi' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-method-invokeApi' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-invokeApi' class='name expandable'>invokeApi</a>( <span class='pre'>options</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Calls a custom API defined in an Azure Mobile Service. ...</div><div class='long'><p>Calls a custom API defined in an Azure Mobile Service.</p>\n\n<p>NOTE: any options that you can pass to Ext.Ajax.request can be passed here.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'>\n<ul><li><span class='pre'>apiName</span> : <div class='sub-desc'><p>{String} the name of the custom API</p>\n</div></li><li><span class='pre'>jsonData</span> : <div class='sub-desc'><p>{Object}</p>\n</div></li><li><span class='pre'>callback</span> : <div class='sub-desc'><p>{Function}</p>\n</div></li><li><span class='pre'>success</span> : <div class='sub-desc'><p>{Function}</p>\n</div></li><li><span class='pre'>failure</span> : <div class='sub-desc'><p>{Function}</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-setAppKey' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-appKey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-setAppKey' class='name expandable'>setAppKey</a>( <span class='pre'>appKey</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of appKey. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/Ext.Azure-cfg-appKey\" rel=\"Ext.Azure-cfg-appKey\" class=\"docClass\">appKey</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>appKey</span> : String<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div><div id='method-setAppUrl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-appUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-setAppUrl' class='name expandable'>setAppUrl</a>( <span class='pre'>appUrl</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of appUrl. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/Ext.Azure-cfg-appUrl\" rel=\"Ext.Azure-cfg-appUrl\" class=\"docClass\">appUrl</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>appUrl</span> : String<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div><div id='method-setAuthIdentities' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-authIdentities' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-setAuthIdentities' class='name expandable'>setAuthIdentities</a>( <span class='pre'>authIdentities</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of authIdentities. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/Ext.Azure-cfg-authIdentities\" rel=\"Ext.Azure-cfg-authIdentities\" class=\"docClass\">authIdentities</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>authIdentities</span> : Array<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div><div id='method-setProtocol' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-protocol' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-setProtocol' class='name expandable'>setProtocol</a>( <span class='pre'>protocol</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of protocol. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/Ext.Azure-cfg-protocol\" rel=\"Ext.Azure-cfg-protocol\" class=\"docClass\">protocol</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>protocol</span> : String<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div><div id='method-setPushConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-cfg-pushConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-method-setPushConfig' class='name expandable'>setPushConfig</a>( <span class='pre'>pushConfig</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of pushConfig. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/Ext.Azure-cfg-pushConfig\" rel=\"Ext.Azure-cfg-pushConfig\" class=\"docClass\">pushConfig</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pushConfig</span> : Object<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-authenticationfailure' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-event-authenticationfailure' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-event-authenticationfailure' class='name expandable'>authenticationfailure</a>( <span class='pre'>error, eOpts</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>error</span> : Object<div class='sub-desc'><p>Fired when login has not been successful. An error object is returned from Azure.</p>\n</div></li><li><span class='pre'>eOpts</span> : Object<div class='sub-desc'><p>The options object passed to Ext.util.Observable.addListener.</p>\n\n\n\n</div></li></ul></div></div></div><div id='event-authenticationlogout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-event-authenticationlogout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-event-authenticationlogout' class='name expandable'>authenticationlogout</a>( <span class='pre'>eOpts</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the user's credentials have been removed from the application. ...</div><div class='long'><p>Fired when the user's credentials have been removed from the application. Note: nothing has been sent to the server ending the user's session.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>eOpts</span> : Object<div class='sub-desc'><p>The options object passed to Ext.util.Observable.addListener.</p>\n\n\n\n</div></li></ul></div></div></div><div id='event-authenticationsuccess' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-event-authenticationsuccess' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-event-authenticationsuccess' class='name expandable'>authenticationsuccess</a>( <span class='pre'>eOpts</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when successful login has occurred or when the user's credentials have been retreived from localStorage ...</div><div class='long'><p>Fired when successful login has occurred or when the user's credentials have been retreived from localStorage</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>eOpts</span> : Object<div class='sub-desc'><p>The options object passed to Ext.util.Observable.addListener.</p>\n\n\n\n</div></li></ul></div></div></div><div id='event-pushnotification' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-event-pushnotification' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-event-pushnotification' class='name expandable'>pushnotification</a>( <span class='pre'>event, eOpts</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>event</span> : Object<div class='sub-desc'><p>Fired when a notification has been received from <a href=\"#!/api/Ext.azure.Push\" rel=\"Ext.azure.Push\" class=\"docClass\">Ext.azure.Push</a></p>\n</div></li><li><span class='pre'>eOpts</span> : Object<div class='sub-desc'><p>The options object passed to Ext.util.Observable.addListener.</p>\n\n\n\n</div></li></ul></div></div></div><div id='event-pushregistrationfailure' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-event-pushregistrationfailure' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-event-pushregistrationfailure' class='name expandable'>pushregistrationfailure</a>( <span class='pre'>event, eOpts</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>event</span> : Object<div class='sub-desc'><p>Fired when PushPlugin fails to register with Cordova</p>\n</div></li><li><span class='pre'>eOpts</span> : Object<div class='sub-desc'><p>The options object passed to Ext.util.Observable.addListener.</p>\n\n\n\n</div></li></ul></div></div></div><div id='event-pushregistrationsuccess' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.Azure'>Ext.Azure</span><br/><a href='source/Azure.html#Ext-Azure-event-pushregistrationsuccess' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.Azure-event-pushregistrationsuccess' class='name expandable'>pushregistrationsuccess</a>( <span class='pre'>event, eOpts</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>event</span> : Object<div class='sub-desc'><p>Fired when PushPlugin successfully registers with Cordova</p>\n</div></li><li><span class='pre'>eOpts</span> : Object<div class='sub-desc'><p>The options object passed to Ext.util.Observable.addListener.</p>\n\n\n\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});