# azure/examples

This folder contains example applications demonstrating this package.

However, some setup is involved in actually running them locally.


===
Step 1: Create a new Sencha Workspace
===

    sencha generate workspace

Then, add the touch-azure package to {workspace}/packages/


===
Step 2: Add a Sencha Touch directory OUTSIDE the workspace
===

This is highly unusual, but necessary for the way in which Sencha packages are deployed.

It MUST be named "touch".

Your folder structure should look like this:

    /touch/
    /{workspace}/
        /packages/
            /touch-azure/


===
Step 3: Modify /{workspace}/.sencha/workspace/sencha.cfg
===

At the very bottom of that file, add this line:

    touch.dir=${workspace.dir}/../touch

This line tells the workspace where Sencha Touch is located.


===
Step 4: Get your Windows Azure credentials ready
===

None of the examples ship with appKey/appUrl or accountName/accessKey pairs - you will need to insert your own.



===
Step 5: Finished!
===

You should now be able to run the examples locally!