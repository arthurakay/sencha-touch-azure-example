# Walkthrough: Mobile Services "data" - Filter example

The [Filters](#!/example/Filters) sample application is an example building on the simpler [Basic](#!/example/Basic) demo.
You can view the full source code in the download package by opening the /examples/data/Filters folder.

Be sure you have read and fully understand the [Basic walkthrough](#!/guide/data_basic) before continuing with this guide.

## Adding Filters

Because the Filters example simply builds on the functionality of the Basic sample app, we'll dive directly into how we apply filters to our READ requests.

## app/store/TodoItems.js

First, we need to configure our store with remote sorting and remote filtering:

    Ext.define('Filters.store.TodoItems', {
        extend : 'Ext.data.Store',

        requires : [
            'Filters.model.TodoItem'
        ],

        config : {
            model        : 'Filters.model.TodoItem',
            pageSize     : 8,
            remoteSort   : true,
            remoteFilter : true,
            autoSync     : true
        }
    });

## app/controller/Main.js

### Sorting

The Filters example contains two additional buttons on the bottom toolbar - for sorting the list in ASC/DESC order.
Our controller handles the logic:

    sortDesc : function (btn) {
        var store = Ext.getStore('TodoItems');
        btn.up().getPressedButtons().length === 0 ? store.sort([]) : store.sort('text', 'DESC');
        store.loadPage(1);
    },

    sortAsc : function (btn) {
        var store = Ext.getStore('TodoItems');
        btn.up().getPressedButtons().length === 0 ? store.sort([]) : store.sort('text', 'ASC');
        store.loadPage(1);
    },

Because our data store was configured with *remoteSort*, the proxy automatically handles the request for us.

### Filtering

The same concept happens with filtering. In the top toolbar, there's a new button for "filter completed".
When pushed, our controller handles the logic:

    onFilter : function (btn) {
        var store = Ext.getStore('TodoItems');

        if (!btn._filtered) {
            btn.element.down('.icon-circle-check').dom.style.backgroundColor = '#008D00';

            store.filter([
                Ext.create('Ext.azure.Filter', {
                    property : "complete",
                    value    : "false"
                })
            ]);
        }
        else {
            btn.element.down('.icon-circle-check').dom.style.backgroundColor = '';
            store.clearFilter();
        }

        if (btn._filtered === undefined) {
            btn._filtered = true;
        }
        else {
            btn._filtered = !btn._filtered;
        }

        store.loadPage(1);
    },

Here you can see how we build a series of filters using Ext.azure.Filter.

Again, because our Store is setup with *remoteFilter* the request is handled automatically!

## Custom Theme

We have also added a custom theme to our application. First, you should familiarize yourself with the
[Sencha Touch Theming Guide](http://docs.sencha.com/touch/2.3.1/#!/guide/theming) so you understand
the basic concepts of our theming package.

Next, you can take a look at our SASS files:

    ~/resources/sass/app.scss

We include a few modifications to the "default" Sencha Touch and some extra classes/icons. By running
*sencha ant sass* in Sencha Cmd, we can manually rebuild the theme CSS.