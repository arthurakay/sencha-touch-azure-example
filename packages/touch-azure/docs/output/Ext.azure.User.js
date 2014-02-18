Ext.data.JsonP.Ext_azure_User({"tagname":"class","name":"Ext.azure.User","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"User.js","href":"User.html#Ext-azure-User"}],"private":true,"aliases":{},"alternateClassNames":[],"extends":"Ext.data.Model","mixins":[],"requires":["Ext.data.proxy.LocalStorage"],"uses":[],"members":[{"name":"fields","tagname":"cfg","owner":"Ext.azure.User","id":"cfg-fields","meta":{"private":true}},{"name":"proxy","tagname":"cfg","owner":"Ext.azure.User","id":"cfg-proxy","meta":{"private":true}},{"name":"getFields","tagname":"method","owner":"Ext.azure.User","id":"method-getFields","meta":{}},{"name":"getProxy","tagname":"method","owner":"Ext.azure.User","id":"method-getProxy","meta":{}},{"name":"setFields","tagname":"method","owner":"Ext.azure.User","id":"method-setFields","meta":{}},{"name":"setProxy","tagname":"method","owner":"Ext.azure.User","id":"method-setProxy","meta":{}}],"code_type":"ext_define","id":"class-Ext.azure.User","component":false,"superclasses":["Ext.data.Model"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.data.Model<div class='subclass '><strong>Ext.azure.User</strong></div></div><h4>Requires</h4><div class='dependency'>Ext.data.proxy.LocalStorage</div><h4>Files</h4><div class='dependency'><a href='source/User.html#Ext-azure-User' target='_blank'>User.js</a></div></pre><div class='doc-contents'><div class='rounded-box private-box'><p><strong>NOTE:</strong> This is a private utility class for internal use by the framework. Don't rely on its existence.</p></div><p>Model defintion for authenticated user</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-fields' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.User'>Ext.azure.User</span><br/><a href='source/User.html#Ext-azure-User-cfg-fields' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.User-cfg-fields' class='name expandable'>fields</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>[{name: 'id', type: 'string'}, {name: 'token', type: 'string'}, {name: 'authMethod', type: 'string'}]</code></p></div></div></div><div id='cfg-proxy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.User'>Ext.azure.User</span><br/><a href='source/User.html#Ext-azure-User-cfg-proxy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.User-cfg-proxy' class='name expandable'>proxy</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{type: 'localstorage', id: 'azure-user'}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-getFields' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.User'>Ext.azure.User</span><br/><a href='source/User.html#Ext-azure-User-cfg-fields' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.User-method-getFields' class='name expandable'>getFields</a>( <span class='pre'></span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of fields. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/Ext.azure.User-cfg-fields\" rel=\"Ext.azure.User-cfg-fields\" class=\"docClass\">fields</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getProxy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.User'>Ext.azure.User</span><br/><a href='source/User.html#Ext-azure-User-cfg-proxy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.User-method-getProxy' class='name expandable'>getProxy</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of proxy. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/Ext.azure.User-cfg-proxy\" rel=\"Ext.azure.User-cfg-proxy\" class=\"docClass\">proxy</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setFields' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.User'>Ext.azure.User</span><br/><a href='source/User.html#Ext-azure-User-cfg-fields' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.User-method-setFields' class='name expandable'>setFields</a>( <span class='pre'>fields</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of fields. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/Ext.azure.User-cfg-fields\" rel=\"Ext.azure.User-cfg-fields\" class=\"docClass\">fields</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fields</span> : Array<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div><div id='method-setProxy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.azure.User'>Ext.azure.User</span><br/><a href='source/User.html#Ext-azure-User-cfg-proxy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.azure.User-method-setProxy' class='name expandable'>setProxy</a>( <span class='pre'>proxy</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of proxy. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/Ext.azure.User-cfg-proxy\" rel=\"Ext.azure.User-cfg-proxy\" class=\"docClass\">proxy</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>proxy</span> : Object<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{"private":true}});