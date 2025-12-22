Ext.define('Rd.view.wireguard.pnlWireguardPeerAddEdit', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.pnlWireguardPeerAddEdit',
    autoScroll	: true,
    plain       : true,
    frame       : false,
    layout      : {
      type  : 'vbox',
      align : 'start',
      pack  : 'start'
    },
    bodyPadding : 10,
    instance_id : null, //We have to specify this
    peer_id     : null, //We have to specify this
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
        'Rd.view.wireguard.vcWireguardPeerAddEdit'
    ],
    controller  : 'vcWireguardPeerAddEdit',
    initComponent: function(){
        var me          = this;
        var w_prim      = 550; 
        
        var hide_multi = true;
        var hide_subnet_check = true;
        var hide_gen_new_keys = true;
               
        if(me.mode == 'add'){
            hide_multi = false;
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
                    value	    : me.peer_id
                },
                {
                    xtype       : 'textfield',
                    name        : 'wireguard_instance_id',
                    hidden      : true,
                    value	    : me.instance_id
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
                    boxLabel  	: 'Next available IPv4 Address',
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
                    boxLabel  	: 'Next available IPv6 Address',
                    boxLabelCls	: 'boxLabelRd',
                    name        : 'ipv6_next_subnet',
                    itemId      : 'chkIpv6NextSubnet',
                    checked     : true           
                }
            ]
        };
                                           
        me.items = [cntWrapper];         
        me.callParent(arguments);
    }
});
