/**
 * The Ext.azure.Filter class offers functionality for filtering your remote data in the Azure cloud.
 *
 *         store.filter([
 *             Ext.create('Ext.azure.Filter', {
 *                 property : "text",
 *                 value    : "'aaa'"
 *             }),
 *             Ext.create('Ext.azure.Filter', {
 *                 property      : "complete",
 *                 value         : true,
 *                 operator      :'eq',
 *                 chainOperator :'or'
 *             })
 *         ]);
 *
 */
Ext.define('Ext.azure.Filter', {
    extend : 'Ext.util.Filter',
    config : {

        /**
         * @cfg {String} operator
         *
         * Sets type of the operator to use for predicate
         * Possible values:
         * eq     Equal
         * ne     Not equal
         * gt     Greater than
         * ge     Greater than or equal
         * lt     Less than
         * le     Less than or equal
         *
         * Default: 'eq'
         */
        operator : 'eq',

        /**
         * @cfg {String} chainOperator
         *
         * Sets chaining operator between two or more predicates, e.g $filter=Price le 200 and Price gt 3.5
         * Possible values:
         * and     Logical and
         * or     Logical or
         * not     Logical negation
         *
         * Default: ''
         */
        chainOperator : ''
    }
});