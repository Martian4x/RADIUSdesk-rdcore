Ext.define('Rd.view.wireguard.winWireguardInstanceEdit', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winWireguardInstanceEdit',
    closable    : true,
    draggable   : true,
    resizable   : true,
    title       : 'Edit Wireguard Instance',
    width       : 500,
    height      : 350,
    plain       : true,
    border      : false,
    layout      : 'fit',
    glyph       : Rd.config.icnEdit,
    autoShow    :   false,
    defaults: {
            border: false
    },
    requires: [
    ],
    initComponent: function() {
        var me      = this;	    
	           
        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            autoScroll: true,
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget       : 'under',
                labelClsExtra   : 'lblRd',
                labelAlign      : 'left',
                labelSeparator  : '',
                labelClsExtra   : 'lblRd',
                margin          : Rd.config.fieldMargin,
                labelWidth		: 150
            },
            defaultType: 'textfield',
            buttons: [
                {
                    itemId      : 'save',
                    formBind    : true,
                    text        : 'SAVE',
                    scale       : 'large',
                    glyph       : Rd.config.icnYes,
                    margin      : Rd.config.buttonMargin,
                    ui          : 'button-teal'
                }
            ],
            items: [
                {
                    name        : 'name',
                    xtype       : 'textfield',
                    fieldLabel  : 'Name',
                    allowBlank  : false,
                    blankText   : 'Specify A Name',
                    margin      : Rd.config.fieldMargin +5,
                    labelClsExtra   : 'lblRdReq'
                }, 
                {
                    name        : 'id',
                    xtype       : 'textfield',
                    hidden      : true
                },                         	
				{
                    name        : 'mac',
                    xtype       : 'textfield',
                    fieldLabel  : i18n("sMAC_address"),
                    allowBlank  : false,
                    blankText   : 'Specify A MAC Address',
					vtype       : 'MacAddress',
					fieldStyle  : 'text-transform:uppercase',
                    itemId      : 'txtMac',
                    margin      : Rd.config.fieldMargin +5,
                    labelClsExtra   : 'lblRdReq'
                },
                {
                    name        : 'interface',
                    xtype       : 'textfield',
                    fieldLabel  : 'Uplink Interface',
                    allowBlank  : false,
                    margin      : Rd.config.fieldMargin +5,
                    labelClsExtra   : 'lblRdReq'
                }              
            ]
        });
        me.items = frmData;    
        me.callParent(arguments);
        
        frmData.loadRecord(me.sr);
    }
});
