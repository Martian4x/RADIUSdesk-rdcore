Ext.define('Rd.view.wireguard.gridWireguardInstances' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridWireguardInstances',
    multiSelect : true,
    store       : 'sWireguardInstances',
    stateful    : true,
    stateId     : 'StateGridWireguardInstances',
    stateEvents :['groupclick','columnhide'],
    border      : false,
    padding     : 0,
    wireguard_server_id : null, //We have to specify this
    viewConfig  : {
        loadMask    :true
    },
    listeners       : {
        activate  : 'onViewActivate'
    },
    plugins     : [
        'gridfilters',
        {
            ptype       : 'rowexpander',
            rowBodyTpl  : new Ext.XTemplate(
                '<div class="plain-wrap">',                 
            		'<tpl if="accel_stat">',
            		    '<div class="main" style="color:#145218;background:#e6e6e6">',
                			'Health',
                		'</div>',
            		    '<div class="sub" style="background:#ffff">',
			    			'<div style="font-size:16px;color:#282852;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
			    				'<span style="color:#515152;font-weight:100;display: inline-block; width: 100px;">Uptime</span>{accel_stat.uptime}',
			    			'</div>',
			    			'<div style="font-size:16px;color:#282852;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
			    				'<span style="color:#515152;font-weight:100;display: inline-block; width: 100px;">CPU</span>{accel_stat.cpu}',
			    			'</div>',
			    			'<div style="font-size:16px;color:#282852;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
			    				'<span style="color:#515152;font-weight:100;display: inline-block; width: 100px;">Memory</span>{accel_stat.mem}',
			    			'</div>',
    					'</div>',            		    
    					'<div class="main" style="color:#145218;background:#e6e6e6">',
                			'Sessions',
                		'</div>',
            		    '<div class="sub" style="background:#ffff">',
    					    '<tpl for="accel_stat.sessions">',
				    			'<div style="font-size:16px;color:#282852;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
				    				'<span style="color:#a3a3a3;font-weight:100;display: inline-block; width: 100px;">{[Ext.ux.splitCapital(values.name)]}</span>{value}',
				    			'</div>',
				    		'</tpl>',
    					'</div>',
    					'<div class="main" style="color:#145218;background:#e6e6e6">',
                			'PPPoE',
                		'</div>',
            		    '<div class="sub" style="background:#ffff">',
    					    '<tpl for="accel_stat.pppoe">',
				    			'<div style="font-size:16px;color:#282852;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
				    				'<span style="color:#a3a3a3;font-weight:100;display: inline-block; width: 140px;">{[Ext.ux.splitCapital(values.name)]}</span>{value}',
				    			'</div>',
				    		'</tpl>',
    					'</div>',
    					'<div class="main" style="color:#145218;background:#e6e6e6">',
                			'Core',
                		'</div>',
            		    '<div class="sub" style="background:#ffff">',
    					    '<tpl for="accel_stat.core">',
				    			'<div style="font-size:16px;color:#282852;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
				    				'<span style="color:#a3a3a3;font-weight:100;display: inline-block; width: 180px;">{[Ext.ux.splitCapital(values.name)]}</span>{value}',
				    			'</div>',
				    		'</tpl>',
    					'</div>',
    					'<div class="main" style="color:#145218;background:#e6e6e6">',
                			'RADIUS 1',
                		'</div>',
            		    '<div class="sub" style="background:#ffff">',
    					    '<tpl for="accel_stat.radius1">',
				    			'<div style="font-size:16px;color:#282852;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
				    				'<span style="color:#a3a3a3;font-weight:100;display: inline-block; width: 180px;">{[Ext.ux.splitCapital(values.name)]}</span>{value}',
				    			'</div>',
				    		'</tpl>',
    					'</div>',
    					'<div class="main" style="color:#145218;background:#e6e6e6">',
                			'RADIUS 2',
                		'</div>',
            		    '<div class="sub" style="background:#ffff">',
    					    '<tpl for="accel_stat.radius2">',
				    			'<div style="font-size:16px;color:#282852;text-align:left;padding-left:20px;padding-top:3px;padding-bottom:3px;">',
				    				'<span style="color:#a3a3a3;font-weight:100;display: inline-block; width: 180px;">{[Ext.ux.splitCapital(values.name)]}</span>{value}',
				    			'</div>',
				    		'</tpl>',
    					'</div>',
    				'<tpl else>',
    				    '<div class="sub">',
    					    '<div style="font-size:25px;color:#9999c7;text-align:left;padding-left:20px;padding-top:10px;"> No Stats Available</div>',
    					'</div>',
    				'</tpl>',
            	'</div>'
            )
        }
    ],
    requires    : [
        'Rd.view.components.ajaxToolbar',
        'Ext.toolbar.Paging',
        'Ext.ux.ProgressBarPager',
        'Rd.view.wireguard.vcWireguardInstances',
        'Rd.view.wireguard.pnlWireguardInstanceAddEdit',
        'Rd.view.wireguard.gridWireguardPeers'
    ],
    controller  : 'vcWireguardInstances',
    urlMenu     : '/cake4/rd_cake/wireguard-instances/menu-for-grid.json',  
    initComponent: function(){
        var me      = this;
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu}); 
        me.store    = Ext.create('Rd.store.sWireguardInstances');        
        me.store.getProxy().setExtraParam('server_id',me.wireguard_server_id);
        
        var dash    = '<span class="rd-dash">—</span>';
        var chip    = function(cls, iconCls, text){
            var icon = iconCls ? '<i class="' + iconCls + '"></i>' : '';
            return '<span class="rd-chip ' + (cls||'') + '">' + icon + Ext.htmlEncode(text) + '</span>';
        };
      
        me.store.addListener('metachange',  me.onStoreWireguardInstancesMetachange, me);
        me.bbar     =  [
            {
                 xtype       : 'pagingtoolbar',
                 store       : me.store,
                 dock        : 'bottom',
                 displayInfo : true
            }  
        ];
               
        me.columns  = [
            { 
                text        : 'Name',               
                dataIndex   : 'name',
                sortable    : true,
                tdCls       : 'gridMain', 
                flex        : 1,
                filter      : {type: 'string'},
                renderer    : function(value,metaData, record){
                	var flag    = record.get('restart_service_flag');
                	var value   = record.get('name');
                	if(flag == 1){
                	    return "<i class=\"fa fa-gears\" style=\"color:orange;\"></i> "+value;
                	}
                    return value;	             
                }
            },
            { 
                text        : 'Wireguard Interface',               
                dataIndex   : 'interface_number',
                sortable    : true,
                tdCls       : 'gridTree',  
                filter      : {type: 'string'},
                width       : 180,
                renderer    : function(value,metaData, record){
                    return 'wg'+value;	             
                }
            },
            { 
                text        : 'Listen Port',               
                dataIndex   : 'listen_port',
                sortable    : true,
                tdCls       : 'gridTree',  
                filter      : {type: 'string'},
                width       : 180
            },
            { 
                text        : 'Private Key',               
                dataIndex   : 'private_key',
                sortable    : true,
                tdCls       : 'gridTree',  
                filter      : {type: 'string'},
                hidden      : true,
                flex        : 1
            },
            { 
                text        : 'Public Key',               
                dataIndex   : 'public_key',
                sortable    : true,
                tdCls       : 'gridTree',
                hidden      : true,  
                filter      : {type: 'string'},
                flex        : 1
            },
            { 
                text        : 'Preshared Key',               
                dataIndex   : 'preshared_key',
                sortable    : true,
                tdCls       : 'gridTree',
                hidden      : true,  
                filter      : {type: 'string'},
                flex        : 1
            },
            {
                text        : 'IPv4 Address',
                dataIndex   : 'ipv4_enabled',
                sortable    : true,
                width       : 200,
                renderer: function (enabled, m, rec) {
                    if (!enabled) return dash;
                    var ip_v4 = rec.get('ipv4_address')+'/'+rec.get('ipv4_mask');         
                    return chip('rd-chip--green', 'fa fa-network-wired', ip_v4);
                }
            },
            {
                text        : 'IPv6 Address',
                dataIndex   : 'ipv6_enabled',
                sortable    : true,
                width       : 200,
                renderer: function (enabled, m, rec) {
                    if (!enabled) return dash;
                    var ip_v6 = rec.get('ipv6_address')+'/'+rec.get('ipv6_prefix');         
                    return chip('rd-chip--warning', 'fa fa-network-wired', ip_v6);
                }
            },
            {
                text        : 'NAT Enabled',
                dataIndex   : 'nat_enabled',
                sortable    : true,
                width       : 200,
                renderer: function (enabled, m, rec) {
                    if (!enabled) return dash;
                    return chip('rd-chip--gray', 'fa fa-retweet', 'NAT Enabled');
                }
            },
            {
                text        : 'SQM Speed Limit',
                dataIndex   : 'sqm_enabled',
                sortable    : true,
                width       : 250,
                renderer: function (enabled, m, rec) {
                    if (!enabled) return dash;
                    var speed = rec.get('upload_mb')+'Mbps up / '+rec.get('download_mb')+'Mbps down';         
                    return chip('rd-chip--teal', 'fa fa-sliders', speed);
                }
            },
            
            
         /*   { 
                text        : "<i class=\"fa fa-chain \"></i> "+'Active Sessions',   
                dataIndex   : 'sessions_active',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(val,metaData, record){    
                    var heartbeat;
                    var value = record.get('sessions_active');
                    if(value != 0){                    
                        return "<div class=\"fieldGreyWhite\">"+value+"</div>";
                    }else{
                        return "<div class=\"fieldBlue\">0</div>";
                    }                              
                },stateId: 'StateGridAccS5'
            },
            { 
                text        : 'Uptime',   
                dataIndex   : 'uptime',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(val,metaData, record){    
                    var heartbeat;
                    var value = record.get('uptime');
                    if(value != 0){                    
                        return "<div class=\"fieldGrey\">"+value+"</div>";
                    }else{
                        return "<div class=\"fieldBlue\">0</div>";
                    }                              
                },stateId: 'StateGridAccS6'
            },*/
            { 
                text        : 'Created',
                dataIndex   : 'created', 
                tdCls       : 'gridTree', 
                hidden      : true, 
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                    "<div class=\"fieldBlue\">{created_in_words}</div>"
                ),
                stateId     : 'StateGridAccS7',
                format      : 'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},
                width       : 200
            },  
            { 
                text        : 'Modified',
                dataIndex   : 'modified', 
                tdCls       : 'gridTree',
                hidden      : true, 
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                    "<div class=\"fieldBlue\">{modified_in_words}</div>"
                ),
                flex        : 1,
                filter      : {type: 'date',dateFormat: 'Y-m-d'},
                stateId     : 'StateGridAccS8'
            },
            {
                xtype       : 'actioncolumn',
                text        : 'Actions',
                width       : 80,
                stateId     : 'StateGridAccS9',
                items       : [					 
                    { 
						iconCls : 'txtRed x-fa fa-trash',
						tooltip : 'Delete',
                        handler: function(view, rowIndex, colIndex, item, e, record, row) {
                            this.fireEvent('itemClick', view, rowIndex, colIndex, item, e, record, row, 'delete');
                        }
                    },
                    {  
                        iconCls : 'txtBlue x-fa fa-pen',
                        tooltip : 'Edit',
						handler: function(view, rowIndex, colIndex, item, e, record, row) {
                            this.fireEvent('itemClick', view, rowIndex, colIndex, item, e, record, row, 'update');
                        }
					},
					{ 
						iconCls : 'txtRed x-fa fa-gear',
						tooltip : 'Restart Instance',
                        handler: function(view, rowIndex, colIndex, item, e, record, row) {
                            this.fireEvent('itemClick', view, rowIndex, colIndex, item, e, record, row, 'restart');
                        }
                    }
				]
	        }      
        ]; 
        me.callParent(arguments);
    },
    onStoreWireguardInstancesMetachange: function(store,meta_data) {
        var me          = this;
       // me.down('#totals').setData(meta_data);
    }
});
