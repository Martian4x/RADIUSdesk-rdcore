Ext.define('Rd.view.wireguard.winWireguardInstanceAdd', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winWireguardInstanceAdd',
    closable    : true,
    draggable   : true,
    resizable   : true,
    title       : 'Add Wireguard Instance',
    width       : 500,
    height      : 500,
    plain       : true,
    border      : false,
    layout      : 'fit',
    glyph       : Rd.config.icnAdd,
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
                    fieldLabel  : 'Description',
                    allowBlank  : false,
                    blankText   : 'Short Descrition',
                    margin      : Rd.config.fieldMargin +5,
                    labelClsExtra   : 'lblRdReq'
                }, 
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'NAT Enabled',
                    name        : 'nat_enabled',
                    inputValue  : 'nat_enabled',
                    itemId      : 'chkNatEnabled',
                    checked     : false,
                    boxLabelCls	: 'boxLabelRd',                
                    margin      : Rd.config.fieldMargin
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'SQM and speed limit',
                    name        : 'sqm_enabled',
                    inputValue  : 'sqm_enabled',
                    itemId      : 'chkSqmEnabled',
                    checked     : false,
                    boxLabelCls	: 'boxLabelRd',                
                    margin      : Rd.config.fieldMargin
                },                       	
				{
		            xtype       : 'rdSliderSpeed',
		            sliderName  : 'limit_upload',
		            itemId      : 'sldrUpload',
		            fieldLabel  : "<i class='fa fa-arrow-up'></i> Up"
		        },
                {
		            xtype       : 'rdSliderSpeed',
		            sliderName  : 'limit_download',
		            itemId      : 'sldrDownload',
		            fieldLabel  : "<i class='fa fa-arrow-down'></i> Down",
		        }                           
            ]
        });
        me.items = frmData; 
        me.callParent(arguments);
        
        if(me.sr){
            frmData.loadRecord(me.sr);
        }
        
    }
});
