# Push Example - Read Me

To issue a build, run the following command from the TouchApp directory:

    sencha app build

This will copy over a 'production' build to the appropriate www folder of each Platform.  When testing you may want to
specify 'testing' as your build option so that a non-minified version of the JavaScript is copied over to each platforms
www folders.

    sencha app build testing