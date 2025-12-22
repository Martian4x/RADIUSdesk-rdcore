Ext.define('Rd.view.passpoint.cntNaiRealms', {
    extend      : 'Ext.container.Container',
    alias       : 'widget.cntNaiRealms',
    layout      : 'hbox',
    margin      : 0,
    mode        : 'add',
    count       : 1,
    nai_name    : '',
    eap_methods : [],
    initComponent: function(){
        var me      = this;
        var name    = 'nai_realm_'+me.mode+'_'+me.count;
        me.items = [
            {
                xtype       : 'textfield',
                emptyText   : 'Realm',
                name        : name,
                value       : me.nai_name,
                margin      : 10,
            },  
            {
                xtype       : 'tagEapMethods',
                width       : 290,
                name        : 'eap_methods_'+name+'[]',
                value       : me.eap_methods,
                margin      : 10,
            },
            {   
                xtype       : 'button',
                margin      : '10 0 0 0',
                tooltip     : 'Delete Domain',
                glyph       : Rd.config.icnDelete,
                listeners   : {
                    click  : 'btnDelNaiRealm'
                }
            } 
        ];

        me.callParent(arguments);
    }
});

