Ext.define('Rd.view.aps.tagApVpnExits', {
    extend          : 'Ext.form.field.Tag',
    alias           : 'widget.tagApVpnExits',
    fieldLabel      : 'Gateway For Exit',
    queryMode       : 'local',
    emptyText       : 'Select Exit Points To Route',
    displayField    : 'name',
    valueField      : 'id',
    labelClsExtra   : 'lblRd',
    itemId          : 'ap_vpn_exits',
    name            : 'ap_vpn_exits[]',
    initComponent: function(){
        var me      = this;
        var s       = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            proxy: {
                type    : 'ajax',
                format  : 'json',
                batchActions: true,
                extraParams : {ap_id:me.ap_id}, 
                url     : '/cake4/rd_cake/vpn-connections/ap-vpn-exits.json',
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
