Ext.define('Rd.view.passpoint.cntPasspointDomains', {
    extend  : 'Ext.container.Container',
    alias   : 'widget.cntPasspointDomains',
    layout  : 'hbox',
    margin  : 0,
    mode    : 'add',
    count   : 1,
    d_name  : '',
    initComponent: function(){
        var me      = this;
        var name    = 'domain_'+me.mode+'_'+me.count;
        me.items = [
            {
                xtype       : 'textfield',
                emptyText   : 'Domain',
                name        : name,
                value       : me.d_name,
                allowBlank  : false,
                margin      : 10,
                width       : 480
            },
            {   
                xtype       : 'button',
                margin      : '10 0 0 0',
                tooltip     : 'Delete Domain',
                glyph       : Rd.config.icnDelete,
                listeners   : {
                    click  : 'btnDelDomain'
                }
            }  
        ];

        me.callParent(arguments);
    }
});

