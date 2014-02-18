Adding Filters to Mobile Services Data
====
This guide explains how to add filtering functionality to your data service proxy. If you have not already done so, it is advised that you are familiar with configuring Azure data services within your Touch application. More information about this is available in the [Getting Started with Data in Azure Mobile Services](#!/guide/mobile_services_data) guide.

You may also refer to the [Basic TODO List with Filters example](#!/example/Filters).

Preamble
----
When used with a list, dataview or grid, the records in a Touch store are displayed pretty much in the same order in which they were added. This may be fine for most applications, but there may be times you wish to change the order in which records are displayed (sorting), or show only a subset of the records in the table (filtering).

Luckily, Sencha Touch allows you to filter and/or sort the records in a store. It can apply these filtering and sorting rules one of two ways - locally or remotely.

By default, filtering or sorting is done at the store level, in that it applies the filters and sorting *only* on the records that currently exist in the store. For smaller data sets, this is actually very advantageous and can be quite quick.

However, if your remote data source has hundreds, thousands or even more records, it becomes very impractical to read in the entire table and sort it on the client. This is where the use of remote filtering and sorting comes into play.

Remote filtering and sorting tells the store that it will not attempt to filter or sort the records in the store, but instead, send the filter and sort parameters to the remote data service with every request. The Azure service will then return the appropriate set of records matching the sorting or filtering parameters. The result is that your store will contain only the records which match your filters and that the records are sorted in the order specified.


Add Filters to your Store
----

Adding filters to a store configured with Ext.azure.Proxy is very easy and can be accomplished in one of two ways.

1. You can choose to filter a store by a single field:

        store.filter('text', /\.com$/);

2. You can choose to filter a store by one or more fields as shown with this example of providing multiple Azure filters together in an array:

        store.filter([
            Ext.create('Ext.azure.Filter', {
                property : "text",
                value    : "'Foo'"
            }),
            Ext.create('Ext.azure.Filter', {
                property      : "complete",
                value         : true,
                operator      :'eq',
                chainOperator :'or'
            })
        ]);


As mentioned in the preamble above, by default, filtering is performed only on the records found in the store. To trigger filtering on the server side you must configure the store for remote filtering using the **remoteFilter** property as shown below: 

    Ext.define('myApp.store.ToDoItems', {
        extend: 'Ext.data.Store',

        config: {
            ...
            remoteFilter: true
        }
    });


Add Sorting to your Store
----
Sorting data in a store works the same way you would expect in any Sencha Touch application. You make a call to the store's **sort** method, providing it with the name of the field to sort, and the direction to sort. This will set the sort parameters for the store.

    store.sort('text', 'ASC');
    // or...
    store.sort('text', 'DESC');

As mentioned in the preamble above, by default, sorting is performed only on the records found in the store. To trigger sorting of records on the Azure mobile service table before records are retrieved, you must configure the store for remote sorting using the **remoteSort** property as shown below: 

    Ext.define('myApp.store.ToDoItems', {
        extend: 'Ext.data.Store',

        config: {
            ...
            remoteSort: true
        }
    });


Add Paging to your Store
----

Paging is also available for any Azure mobile service table and is utilized in the same manner as any other Touch store. By default, paging is enabled and the page size is 20. This means that any request for data will return a maximum of 20 records starting at page 0. The pagesize can be adjusted using the **pageSize** property in the store configuration.


    Ext.define('Basic.store.TodoItems', {
        extend: 'Ext.data.Store',

        ...

        config: {
            pageSize: 8
            ....
        }
    });

If you wish to receive all records returned from a search of the Azure mobile service table, you must disable paging in the store proxy by setting the **enablePagingParams** property to false:

    Ext.define('Basic.store.TodoItems', {
        extend : 'Ext.data.Store',

        ...

        config : {

            ...

            proxy : {
                type               : 'azure',
                tableName          : 'TodoItem',
                enablePagingParams : false
            }
        }

    });
