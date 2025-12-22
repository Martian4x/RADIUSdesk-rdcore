Ext.define('Rd.view.passpoint.tagEapMethods', {
    extend          : 'Ext.form.field.Tag',
    alias           : 'widget.tagEapMethods',
    queryMode       : 'local',
    emptyText       : 'Select EAP Methods (Optional)',
    displayField    : 'name',
    valueField      : 'id',
    labelClsExtra   : 'lblRd',
    itemId          : 'eap_methods',
    name            : 'eap_methods[]',
    submitEmptyText : false, // Prevents submitting when empty
    initComponent: function(){
        var me      = this;
        var s       = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            proxy: {
                type    : 'ajax',
                format  : 'json',
                batchActions: true,
               // extraParams: { 'mesh_id' : me.meshId}, 
                url     : '/cake4/rd_cake/passpoint-profiles/eap-methods.json',
                reader: {
                    type: 'json',
                    rootProperty: 'items',
                    messageProperty: 'message'
                }
            },
            autoLoad: true
        });
        me.store = s;
        me.callParent(arguments);
    }
});
