Ext.define('Rd.view.passpoint.cntCellNetworks', {
    extend      : 'Ext.container.Container',
    alias       : 'widget.cntCellNetworks',
    layout      : 'hbox',
    margin      : 0,
    mode        : 'add',
    count       : 1,
    cell_name : '',
    cell_mcc  : '',
    cell_mnc  : '',
    initComponent: function(){
        var me          = this;
       
        me.items = [
            {
                xtype       : 'textfield',
                emptyText   : 'Mobile Provider',
                allowBlank  : false,
                name        : 'cell_network_name_'+me.mode+'_'+me.count,
                value       : me.cell_name,
                margin      : 10,
            },
            {
                xtype       : 'numberfield',
                name        : 'cell_network_mcc_'+me.mode+'_'+me.count,
                value       : me.cell_mcc,
                allowBlank  : false,
                emptyText   : 'MCC',
                maxValue    : 4094,
                minValue    : 1,
                hideTrigger : true,
                keyNavEnabled  : false,
                mouseWheelEnabled	: false,
                margin      : 10,
                width       : 135,
            },   
            {
                xtype       : 'numberfield',
                name        : 'cell_network_mnc_'+me.mode+'_'+me.count,
                value       : me.cell_mnc,
                allowBlank  : false,
                emptyText   : 'MNC',
                maxValue    : 4094,
                minValue    : 1,
                hideTrigger : true,
                keyNavEnabled  : false,
                mouseWheelEnabled	: false,
                margin      : 10,
                width       : 135,
            },  
            {   
                xtype       : 'button',
                margin      : '10 0 0 0',
                tooltip     : 'Delete Domain',
                glyph       : Rd.config.icnDelete,
                listeners   : {
                    click  : 'btnDelCellNetwork'
                }
            } 
        ];

        me.callParent(arguments);
    }
});

