# azure/overrides

This folder contains overrides which will automatically be required by package users.

## Note on how these override classes are done

Touch versions less than 2.3 do not call a callback function if you add the 'override' property so instead
we require the class that we want to override and then in the callback we call Ext.override() on that class
so that we can then override the methods we want.

This issue should be fixed in ST 2.3 (https://sencha.jira.com/browse/TOUCH-4537)
