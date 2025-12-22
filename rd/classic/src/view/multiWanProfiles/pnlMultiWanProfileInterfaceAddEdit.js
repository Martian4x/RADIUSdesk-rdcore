Ext.define('Rd.view.multiWanProfiles.pnlMultiWanProfileInterfaceAddEdit', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.pnlMultiWanProfileInterfaceAddEdit',
    closable    : true,
    autoScroll	: true,
    plain       : true,
    frame       : false,
    layout      : {
        type    : 'vbox',
        pack    : 'start',
        align   : 'stretch'
    },
    margin      : 5,  
    multi_wan_profile_id : '',
    multi_wan_profile_name : '',
    submitEmptyText: false, // Set this in the form config
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
    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Rd.view.multiWanProfiles.vcMultiWanProfileInterface',
        'Rd.view.components.cmbSqmProfile',
        'Rd.view.components.cmbQmiDevice'
    ],
    controller  : 'vcMultiWanProfileInterface',
    initComponent: function() {
        var me 		= this;
        if(me.interface_id == 0){
            me.setTitle('Add Interface To '+me.multi_wan_profile_name);
        }else{
            me.setTitle('Edit Interface '+me.interface_name);
        }
        
        var w_prim  = 600;
        
        var oneToTen = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data : [
                {"id":1, "name":1},
                {"id":2, "name":2},
                {"id":3, "name":3},
                {"id":4, "name":4},
                {"id":5, "name":5},
                {"id":6, "name":6},
                {"id":7, "name":7},
                {"id":8, "name":8},
                {"id":9, "name":9},
                {"id":10, "name":10}
            ]
        });
        
        var pingSize = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data : [
                {"id":56, "name":56},
                {"id":120, "name":120},
                {"id":248, "name":248},
                {"id":504, "name":504},
                {"id":1016, "name":1016},
                {"id":1472, "name":1472},
                {"id":2040, "name":2040}
            ]
        });
        
        var pingTtl = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data : [
                {"id":10, "name":10},
                {"id":20, "name":20},
                {"id":30, "name":30},
                {"id":40, "name":40},
                {"id":50, "name":50},
                {"id":60, "name":60},
                {"id":70, "name":70}
            ]
        });
        
         var oneToTenSeconds = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data : [
                {"id":1, "name":'1 second'},
                {"id":2, "name":'2 seconds'},
                {"id":3, "name":'3 seconds'},
                {"id":4, "name":'4 seconds'},
                {"id":5, "name":'5 seconds'},
                {"id":6, "name":'6 seconds'},
                {"id":7, "name":'7 seconds'},
                {"id":8, "name":'8 seconds'},
                {"id":9, "name":'9 seconds'},
                {"id":10, "name":'10 seconds'}
            ]
        });
        
        var interval = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data : [
                {"id":1, "name":'1 second'},
                {"id":3, "name":'3 seconds'},
                {"id":5, "name":'5 seconds'},
                {"id":10,"name":'10 seconds'},
                {"id":20,"name":'20 seconds'},
                {"id":30,"name":'30 seconds'},
                {"id":60,"name":'1 minute'},
                {"id":300,  "name":'5 minutes'},
                {"id":600,  "name":'10 minutes'},
                {"id":900,  "name":'15 minutes'},
                {"id":1800, "name":'30 minutes'},
                {"id":3600, "name":'1 hour'},
            ]
        });
        
        var conntrack = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data : [
                {"id":'ifup',        "name":'ifup (netifd)'},
                {"id":'ifdown',      "name":'ifdown (netifd)'},
                {"id":'connected',   "name":'connected (mwan3)'},
                {"id":'disconnected',"name":'disconnected (mwan3)'}
            ]
        });   
    
        var pnlStatic = {
            xtype       : 'panel',
            itemId      : 'pnlStatic',
            hidden      : true,
            disabled    : true,
            bodyStyle   : 'background: #e0ebeb',
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items   : [
                {
                    xtype       : 'textfield',
                    fieldLabel  : i18n('sIP_Address'),
                    name        : 'static_ipaddr',
                    allowBlank  : false,
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRdReq',
                    vtype       : 'IPAddress'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Netmask',
                    name        : 'static_netmask',
                    allowBlank  : false,
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRdReq',
                    vtype       : 'IPAddress'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Gateway',
                    name        : 'static_gateway',
                    allowBlank  : false,
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRdReq',
                    vtype       : 'IPAddress'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'DNS Primary',
                    name        : 'static_dns_1',
                    allowBlank  : true,
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRd',
                    vtype       : 'IPAddress'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'DNS Secondary',
                    name        : 'static_dns_2',
                    allowBlank  : true,
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRd',
                    vtype       : 'IPAddress'
                }
            ]
        };
        
        var pnPppoe = {
            xtype       : 'panel',
            itemId      : 'pnlPppoe',
            hidden      : true,
            disabled    : true,
            bodyStyle   : 'background: #e0ebeb',
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items   : [
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Username',
                    name        : 'pppoe_username',
                    allowBlank  : false,
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'rdPasswordfield',
                    rdName      : 'pppoe_password',
                    rdLabel     : 'Password',
                    enabled     : true
                }, 
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'DNS Primary',
                    name        : 'pppoe_dns_1',
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRd',
                    vtype       : 'IPAddress'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'DNS Secondary',
                    name        : 'pppoe_dns_2',
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRd',
                    vtype       : 'IPAddress'
                },
                {
			        xtype       : 'textfield',
			        fieldLabel  : 'My Own MAC',
			        name        : 'pppoe_mac',
			        blankText   : i18n("sSupply_a_value"),
			        vtype       : 'MacAddress',
			        labelClsExtra: 'lblRd',
			        fieldStyle  : 'text-transform:uppercase'
		        },
                {
			        xtype       : 'textfield',
			        fieldLabel  : 'MTU',
			        name        : 'pppoe_mtu',
			        blankText   : i18n("sSupply_a_value"),
			        vtype       : 'Numeric',
			        labelClsExtra: 'lblRd'
		        }       
            ]
        };
        
        var pnlQmi = {
            xtype       : 'panel',
            itemId      : 'pnlQmi',
            hidden      : true,
            disabled    : true,
            bodyStyle   : 'background: #e0ebeb',
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items   : [ 
                {
                    xtype       : 'cmbQmiDevice'
                },              
                { 
                    xtype       : 'cmbQmiAuth',
                    allowBlank  : false,
                    name        : 'qmi_auth',
                    listeners       : {
						    change : 'onCmbQmiOptionsChange'
				    }  
                },
                       
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Username',
                    name        : 'qmi_username',
                    itemId      : 'qmi_username',
                    hidden      : true,
                    disabled    : true,
                    allowBlank  : false,
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Password',
                    name        : 'qmi_password',
                    itemId      : 'qmi_password',
                    hidden      : true,
                    disabled    : true,
                    allowBlank  : false,
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'APN',
                    name        : 'qmi_apn',
                    labelClsExtra: 'lblRd'
                }, 
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Pincode',
                    name        : 'qmi_pincode',
                    labelClsExtra: 'lblRd'
                }
            ]
        };
        
        var pnlWifi = {
            xtype       : 'panel',
            itemId      : 'pnlWifi',
            hidden      : true,
            disabled    : true,
            bodyStyle   : 'background: #e0ebeb',
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items   : [         
                {
                    fieldLabel  : 'SSID',
                    name        : 'wbw_ssid',
                    maxLength   : 31,
                    allowBlank  : false,
                    regex       : /^[\w\-\s]+$/,
                    regexText   : "Only words allowed",
                    emptyText   : 'Specify a value to continue',
                    width       : w_prim,
                    xtype       : 'textfield'
                }, 
                { 
                    xtype       : 'cmbEncryptionOptionsSimple',
                    allowBlank  : false,
                    name        : 'wbw_encryption',
                    width       : w_prim,
                    listeners       : {
						    change : 'onCmbEncryptionOptionsChangeWbw'
				    }  
                },
                {
                    fieldLabel  : 'Passphrase',
                    name        : 'wbw_key',
                    itemId      : 'wbw_key',
                    allowBlank  : false,
                    xtype       : 'textfield',
                    width       : w_prim,
                    minLength   : 8,
                    hidden      : true,
                    disabled    : true
                },
                {
                    xtype       : 'radiogroup',
                    fieldLabel  : 'Radio',
                    itemId      : 'rgrpWbWradio',
                    columns     : 3,
                    vertical    : false,
                    items       : [                        
                        {
                            boxLabel  : 'Radio0',
                            name      : 'wbw_device',
                            inputValue: 'radio0',
                            itemId    : 'wbw_radio_0',
                            margin    : '0 15 0 0',
                            checked   : true
                        }, 
                        {
                            boxLabel  : 'Radio1',
                            name      : 'wbw_device',
                            inputValue: 'radio1',
                            itemId    : 'wbw_radio_1',
                            margin    : '0 0 0 15'
                        },
                        { 
                            boxLabel  : 'Radio2',
                            name      : 'wbw_device',
                            inputValue: 'radio2',
                            itemId    : 'wbw_radio_2',
                            margin    : '0 0 0 15'
                        }    
                    ]
                }
            ]
        };
        
        var pnlPingHosts = {
            xtype       : 'panel',
            itemId      : 'pnlPingHosts',
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items   : [
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Host / IP 1',
                    name        : 'mon_track_ip_1',
                    itemId      : 'mon_track_ip_1',
                    allowBlank  : false,
                    blankText   : i18n("sSupply_a_value"),
                    labelClsExtra: 'lblRdReq'
                }
            ]
        };
        
        var cntGeneral = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items       : [
                {
                    xtype   : 'textfield',
                    name    : 'multi_wan_profile_id',
                    value   : me.multi_wan_profile_id,
                    hidden  : true
                },
                {
                    xtype       : 'textfield',
                    name        : 'id',
                    hidden      : true,
                    value	    : me.interface_id
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Name',
                    name        : 'name',
                    allowBlank  : false,
                    labelClsExtra: 'lblRdReq'
                }
            ]
        }
        
        var cntConnection = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items       : [
                {
                    xtype   : 'textfield',
                    name    : 'type',
                    itemId	: 'txtType',
                    hidden  : true,
                    value	: 'ethernet'
                },
                {
                    xtype       : 'radiogroup',
                    fieldLabel  : 'Type',
                    labelClsExtra: 'lblRd',
                    layout: {
				        type	: 'hbox',
				        align	: 'middle',
				        pack	: 'stretchmax',
				        padding	: 0,
				        margin	: 0
			        },
                    defaultType: 'button',
    				defaults: {
				        enableToggle: true,
				        toggleGroup: 'type',
				        allowDepress: false,					
			        },             
                    items: [
				        { text: 'Ethernet', 	itemId: 'btnEthernet',  glyph: Rd.config.icnSitemap,    flex:1, ui : 'default-toolbar', 'margin' : '0 5 0 0', pressed: true },
				        { text: 'LTE', 		    itemId: 'btnLte',       glyph: Rd.config.icnWifi,       flex:1, ui : 'default-toolbar', 'margin' : '0 5 0 5' },
				        { text: 'WiFi', 	    itemId: 'btnWifi',      glyph: Rd.config.icnSsid,       flex:1, ui : 'default-toolbar', 'margin' : '0 0 0 5' }
			        ]
                },
                pnlQmi,
                pnlWifi,
                {
                    xtype   : 'textfield',
                    name    : 'protocol',
                    itemId	: 'txtProtocol',
                    hidden  : true,
                    value	: 'ipv4'
                },
                {
                    xtype       : 'radiogroup',
                    fieldLabel  : 'Protocol',
                    labelClsExtra: 'lblRd',
                    layout: {
				        type	: 'hbox',
				        align	: 'middle',
				        pack	: 'stretchmax',
				        padding	: 0,
				        margin	: 0
			        },
                    defaultType: 'button',
    				defaults: {
				        enableToggle: true,
				        toggleGroup: 'protocol',
				        allowDepress: false,					
			        },             
                    items: [
				        { text: 'IPv4', 	itemId: 'btnIpv4',    flex:1, ui : 'default-toolbar', 'margin' : '0 5 0 0', pressed: true  },
				        { text: 'IPv6',     itemId: 'btnIPv6',    flex:1, ui : 'default-toolbar', 'margin' : '0 0 0 5', disabled: true }
			        ]
                },
                 {
                    xtype   : 'textfield',
                    name    : 'method_protocol',
                    itemId	: 'txtMethod',
                    hidden  : true,
                    value	: 'dhcp'
                },
                {
                    xtype       : 'radiogroup',
                    fieldLabel  : 'Method',
                    itemId      : 'rgrpMethod',
                    labelClsExtra: 'lblRd',
                    layout: {
				        type	: 'hbox',
				        align	: 'middle',
				        pack	: 'stretchmax',
				        padding	: 0,
				        margin	: 0
			        },
                    defaultType: 'button',
    				defaults: {
				        enableToggle: true,
				        toggleGroup: 'method',
				        allowDepress: false,					
			        },             
                    items: [ //dhcp,static,pppoe
				        { text: 'DHCP', 	itemId: 'btnDhcp',  flex:1, ui : 'default-toolbar', 'margin' : '0 5 0 0', pressed: true },
				        { text: 'Static IP Address', itemId: 'btnStatic', flex:1, ui : 'default-toolbar', 'margin' : '0 5 0 5' },
				        { text: 'PPPoE', 	itemId: 'btnPppoe',  flex:1, ui : 'default-toolbar', 'margin' : '0 0 0 5' }
			        ]
                },
                pnlStatic,
                pnPppoe,
                {
                    xtype       : 'numberfield',
                    name        : 'ethernet_vlan',
                    itemId      : 'nrVlan',
                    fieldLabel  : 'VLAN',
                    allowBlank  : true,
                    maxValue    : 4094,
                    minValue    : 1,
                    labelClsExtra : 'lblRd',
                    hideTrigger : true,
                    keyNavEnabled  : false,
                    mouseWheelEnabled	: false
                }, 
                {
                    xtype       : 'textfield',
                    itemId      : 'txtHardwarePort',
                    fieldLabel  : 'Hardware Port',
                    name        : 'ethernet_port',
                    allowBlank  : false,
                    labelClsExtra: 'lblRdReq'
                },                        
                {
                    itemId      : 'chkApplySqmProfile',
                    xtype       : 'checkbox',      
                    boxLabel  	: 'Apply SQM Profile',
                    boxLabelCls	: 'boxLabelRd',
                    name        : 'apply_sqm_profile',
                    listeners   : {
			            change  : 'onChkApplySqmProfileChange'
			        }
                },
                {
                	xtype		: 'cmbSqmProfile',
                	fieldLabel	: 'SQM Profile',
                	include_all_option : false,
                	disabled	: true,
                	labelClsExtra: 'lblRd'                             	
                }              
            ]
        } 
        
        var cntMonitor = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            itemId      : 'cntMonitor',
            disabled    : true,
            defaults    : {
                anchor  : '100%'
            },
            items       : [
                {
                    xtype       : 'component',
                    html        : 'Hosts to ping',
                    cls         : 'heading'
                },
                pnlPingHosts,
                { 
                    xtype       : 'button',
                    text        : 'ADD HOST / IP ADDRESS',
                    itemId      : 'btnAddHost',
                    flex        : 1, 
                    ui          : 'default-toolbar',
                    margin      : 0 
                },
                {
                    xtype       : 'component',
                    html        : 'Ping test settings',
                    cls         : 'heading',
                    margin      : '25 0 0 0'
                },
                {
                    fieldLabel  : 'Ping count',
                    store       : oneToTen,
                    name        : 'mon_count',
                    queryMode   : 'local',
                    displayField: 'name',
                    valueField  : 'id',
                    xtype       : 'combobox',
                    value       : 1,
                    labelClsExtra : 'lblRd'
                },
                {
                    fieldLabel  : 'Ping size',
                    store       : pingSize,
                    name        : 'mon_size',
                    queryMode   : 'local',
                    displayField: 'name',
                    valueField  : 'id',
                    xtype       : 'combobox',
                    value       : 56,
                    labelClsExtra : 'lblRd'
                },
                {
                    fieldLabel  : 'Max Time to Live',
                    store       : pingTtl,
                    name        : 'mon_max_ttl',
                    queryMode   : 'local',
                    displayField: 'name',
                    valueField  : 'id',
                    xtype       : 'combobox',
                    value       : 60,
                    labelClsExtra : 'lblRd'
                },
                 {
                    fieldLabel  : 'Ping timeout',
                    store       : oneToTenSeconds,
                    name        : 'mon_timeout',
                    queryMode   : 'local',
                    displayField: 'name',
                    valueField  : 'id',
                    xtype       : 'combobox',
                    value       : 4,
                    labelClsExtra : 'lblRd'
                },
                {
                    xtype       : 'component',
                    html        : 'Ping test frequency',
                    cls         : 'heading'
                },
                {
                    fieldLabel  : 'Interval',
                    store       : interval,
                    name        : 'mon_interval',
                    queryMode   : 'local',
                    displayField: 'name',
                    valueField  : 'id',
                    xtype       : 'combobox',
                    value       : 10,
                    labelClsExtra : 'lblRd'
                },
                {
                    xtype       : 'fieldset',
                    title       : 'Advanced',
                    itemId      : 'fsAdvanced', 
                    collapsible : true,
                    collapsed   : true,
                    margin      : 0,
                    padding     : 0,
                    items       : [
                        {
                            fieldLabel  : 'Interval during failure',
                            store       : interval,
                            name        : 'mon_failure_interval',
                            queryMode   : 'local',
                            displayField: 'name',
                            valueField  : 'id',
                            xtype       : 'combobox',
                            labelClsExtra : 'lblRd',
                            width       : w_prim-30,
                        },
                        {
                            xtype       : 'checkbox',      
                            boxLabel  	: 'Keep failure interval',
                            boxLabelCls	: 'boxLabelRd',
                            name        : 'mon_keep_failure_interval',
                            width       : w_prim-30,
                        },
                        {
                            fieldLabel  : 'Recovery interval',
                            store       : interval,
                            name        : 'mon_recovery_interval',
                            queryMode   : 'local',
                            displayField: 'name',
                            valueField  : 'id',
                            xtype       : 'combobox',
                            labelClsExtra : 'lblRd',
                            width       : w_prim-30,
                        } 
                    ]
                },            
                {
                    xtype       : 'component',
                    html        : 'Uptime requirements',
                    cls         : 'heading',
                    margin      : '10 0 0 0'
                },
                {
                    xtype   : 'container',
                    layout  : 'hbox',
                    items   : [
                        {
                            fieldLabel  : 'A minimum of',
                            store       : oneToTen,
                            name        : 'mon_reliability',
                            queryMode   : 'local',
                            displayField: 'name',
                            valueField  : 'id',
                            xtype       : 'combobox',
                            value       : 1,
                            labelClsExtra : 'lblRd',
                            flex        : 1
                        },      
                        {
                            xtype       : 'label',
                            text        : 'hosts must pass the ping test',
                            userCls     : 'lblRd',
                            cls         : 'lblRd',
                            flex        : 1,
                            margin      : '25 0 0 0'
                        }
                    ]
                },  
                {
                    xtype   : 'container',
                    layout  : 'hbox',
                    items   : [
                        {
                            fieldLabel  : 'Interface up after',
                            store       : oneToTen,
                            name        : 'mon_up',
                            queryMode   : 'local',
                            displayField: 'name',
                            valueField  : 'id',
                            xtype       : 'combobox',
                            value       : 5,
                            labelClsExtra : 'lblRd',
                            flex        : 1
                        },
                        {
                            xtype   : 'label',
                            html    : 'ping test <span style="font-size:18px;color:green;">passes</span>',
                            userCls : 'lblRd',
                            cls     : 'lblRd',
                            flex    : 1,
                            margin  : '25 0 0 0'
                        }
                    ]
                },
                {
                    xtype   : 'container',
                    layout  : 'hbox',
                    items   : [
                         {
                            fieldLabel  : 'Interface down after',
                            store       : oneToTen,
                            name        : 'mon_down',
                            queryMode   : 'local',
                            displayField: 'name',
                            valueField  : 'id',
                            xtype       : 'combobox',
                            value       : 5,
                            labelClsExtra : 'lblRd',
                            flex        : 1
                        },
                        {
                            xtype       : 'label',
                            html        : 'ping test <span style="font-size:18px;color:red;">fails</span>',
                            userCls     : 'lblRd',
                            cls         : 'lblRd',
                            flex        : 1,
                            margin      : '25 0 0 0'
                        }
                    ]
                },
                {
                    xtype       : 'component',
                    html        : 'Conntrack Options',
                    cls         : 'heading',
                    margin      : '10 0 0 0'
                },
                {
                    xtype       : 'tagfield',
                    fieldLabel  : 'Flash table',
                    store       : conntrack,
                    name        : 'mon_flush_conntrack[]',
                    displayField: 'name',
                    valueField  : 'id',
                    queryMode   : 'local',
                    filterPickList: true,
                    labelClsExtra : 'lblRd',
                    emptyText   : 'Leave empty by default'
                }  
            ]
        }            
       
        me.items = [
            {
                xtype       : 'panel',
                title       : "General",
                glyph       : Rd.config.icnGears, 
                ui          : 'panel-blue',
                layout      : {
                  type  : 'vbox',
                  align : 'start',
                  pack  : 'start'
                },
                bodyPadding : 10,
                items       : cntGeneral			
            },
            {
                xtype       : 'panel',
                title       : 'Connection',
                glyph       : Rd.config.icnPlug, 
                ui          : 'panel-green',
                layout      : {
                  type      : 'vbox',
                  align     : 'start',
                  pack      : 'start'
                },
                bodyPadding : 10,
                items       : cntConnection				
            },
            {
                xtype       : 'panel',
                title       : 'Monitor',
                glyph       : Rd.config.icnHeartbeat, 
                ui          : 'panel-green',
                layout      : {
                  type      : 'vbox',
                  align     : 'start',
                  pack      : 'start'
                },
                bodyPadding : 10,
                items       : [
                    {
                        xtype       : 'checkbox',      
                        boxLabel  	: 'Enable Monitor',
                        boxLabelCls	: 'boxLabelRd',
                        name        : 'enable_monitor',
                        listeners   : {
			                change  : 'onChkEnableMonitorChange'
			            }
                    },
                    cntMonitor
                ]				
            }
        ];      
               
        me.callParent(arguments);
    }
});
