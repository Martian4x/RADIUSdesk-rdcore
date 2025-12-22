Ext.define('Rd.view.wireguard.pnlWireguardInstanceAddEdit', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.pnlWireguardInstanceAddEdit',
    autoScroll	: true,
    plain       : true,
    frame       : false,
    layout      : {
      type  : 'vbox',
      align : 'start',
      pack  : 'start'
    },
    bodyPadding : 10,
    fieldDefaults: {
        msgTarget       : 'under',
        labelAlign      : 'left',
        labelSeparator  : '',
        labelWidth      : Rd.config.labelWidth+20,
        margin          : Rd.config.fieldMargin,
        labelClsExtra   : 'lblRdReq'
    },
    buttons : [
        {
            itemId  : 'save',
            text    : 'SAVE',
            scale   : 'large',
            formBind: true,
            glyph   : Rd.config.icnYes,
            margin  : Rd.config.buttonMargin,
            ui      : 'button-teal'
        }
    ],
    requires    : [
        'Rd.view.wireguard.vcWireguardInstanceAddEdit'
    ],
    controller  : 'vcWireguardInstanceAddEdit',
    customFields : [
        'pnlNetwork',
        'pnlSignup',
        'idHessid',
        'idVenueName',
        'idVenueUrl'
    ], 
    initComponent: function(){
        var me          = this;
        var w_prim      = 550; 
        
        var hide_multi = true;
        var hide_next_port  = true;
        var hide_subnet_check = true;
        var hide_gen_new_keys = true;
               
        if(me.mode == 'add'){
            hide_multi = false;
            hide_next_port = false;
            hide_subnet_check = false;
            hide_gen_new_keys = false;
        }
        
        var cntWrapper  = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items       : [
                {
                    xtype       : 'textfield',
                    name        : 'id',
                    hidden      : true,
                    value	    : me.wireguard_instance_id
                },
                {
                    xtype       : 'textfield',
                    name        : 'wireguard_server_id',
                    hidden      : true,
                    value	    : me.wireguard_server_id
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'Add Multiple',
                    name        : 'add_multiple',
                    itemId      : 'chkMultiple',
                    checked     : false,
                    boxLabelCls	: 'boxLabelRd',
                    hidden      : hide_multi
                }, 
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Name',
                    name        : 'name',
                    allowBlank  : false
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'Next available port',
                    name        : 'next_port',
                    itemId      : 'chkNextPort',
                    checked     : !hide_next_port,
                    boxLabelCls	: 'boxLabelRd',
                    hidden      : hide_next_port
                },
                {
                    xtype       : 'numberfield',
                    itemId      : 'nrPort',
                    name        : 'port',
                    fieldLabel  : 'Port',
                    allowBlank  : false,
                    maxValue    : 64000,
                    minValue    : 1,
                    value       : 51820,
                    hideTrigger : true,
                    keyNavEnabled  : false,
                    hidden      : !hide_next_port,
                    disabled    : !hide_next_port,
                    mouseWheelEnabled	: false
                },
                {
                    xtype       : 'component',
                    html        : 'Key management',
                    cls         : 'heading'
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'Generate new keys',
                    name        : 'gen_keys',
                    itemId      : 'chkGenKeys',
                    checked     : !hide_gen_new_keys,
                    boxLabelCls	: 'boxLabelRd',
                    hidden      : hide_gen_new_keys
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'Generate Preshared Key',
                    name        : 'gen_preshared_key',
                    itemId      : 'chkIncludePresharedKey',
                    checked     : hide_gen_new_keys,
                    boxLabelCls	: 'boxLabelRd',
                    hidden      : hide_gen_new_keys,
                    disabled    : hide_gen_new_keys
                },
                {
                    xtype       : 'textfield',
                    itemId      : 'txtPrivateKey',
                    fieldLabel  : 'Private Key',
                    name        : 'private_key',
                    allowBlank  : false,
                    hidden      : !hide_gen_new_keys,
                    disabled    : !hide_gen_new_keys
                },  
                {
                    xtype       : 'textfield',
                    itemId      : 'txtPublicKey',
                    fieldLabel  : 'Public Key',
                    name        : 'public_key',
                    allowBlank  : false,
                    hidden      : !hide_gen_new_keys,
                    disabled    : !hide_gen_new_keys
                },
                {
                    xtype       : 'textfield',
                    itemId      : 'txtPresharedKey',
                    fieldLabel  : 'Preshared Key (Optional)',
                    name        : 'preshared_key',
                    labelClsExtra: 'lblRd',
                    hidden      : !hide_gen_new_keys,
                    disabled    : !hide_gen_new_keys
                },             
                {
                    xtype       : 'component',
                    html        : 'Address and Subnet',
                    cls         : 'heading'
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel  	: 'IPv4',
                    boxLabelCls	: 'boxLabelRd',
                    name        : 'ipv4_enabled',
                    checked     : true,
                    itemId      : 'chkIpv4', 
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel  	: 'Next available IPv4 subnet',
                    boxLabelCls	: 'boxLabelRd',
                    name        : 'ipv4_next_subnet',
                    itemId      : 'chkIpv4NextSubnet',
                    checked     : true          
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel  	: 'IPv6',
                    boxLabelCls	: 'boxLabelRd',
                    name        : 'ipv6_enabled',
                    checked     : true,
                    itemId      : 'chkIpv6',          
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel  	: 'Next available IPv6 subnet',
                    boxLabelCls	: 'boxLabelRd',
                    name        : 'ipv6_next_subnet',
                    itemId      : 'chkIpv6NextSubnet',
                    checked     : true           
                },
                {
                    xtype       : 'component',
                    html        : 'Network settings',
                    cls         : 'heading'
                },                
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'NAT Enabled',
                    name        : 'nat_enabled',
                    itemId      : 'chkNatEnabled',
                    checked     : true,
                    boxLabelCls	: 'boxLabelRd'
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'SQM (Smart Queue Management) with speed limit',
                    name        : 'sqm_enabled',
                    itemId      : 'chkSqmEnabled',                  
                    checked     : true,
                    boxLabelCls	: 'boxLabelRd'
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
        };
                                           
        me.items = [cntWrapper];         
        me.callParent(arguments);
    }
});
