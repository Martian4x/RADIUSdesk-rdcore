Ext.define('Rd.view.wireguard.gridWireguardServers' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridWireguardServers',
    multiSelect : true,
    store       : 'sWireguardServers',
    stateful    : true,
    stateId     : 'StateGridWireguardServers',
    stateEvents : ['groupclick','columnhide'],
    border      : false,
    padding     : 0,
    ui          : 'light',
    columnLines : false,
    rowLines    : false,
    stripeRows  : true,
    viewConfig  : {
        loadMask    :true
    },
    listeners       : {
        activate  : 'onViewActivate'
    },
    plugins     : [
        'gridfilters'
    ],
    requires    : [
        'Rd.view.components.ajaxToolbar',
        'Ext.toolbar.Paging',
        'Ext.ux.ProgressBarPager',
        'Rd.view.wireguard.vcWireguardServers',
        'Rd.view.wireguard.winWireguardServerAdd',
        'Rd.view.wireguard.winWireguardServerEdit',
        'Rd.view.wireguard.gridWireguardInstances'
    ],
    controller  : 'vcWireguardServers',
    urlMenu     : '/cake4/rd_cake/wireguard-servers/menu-for-grid.json',  
    initComponent: function(){
        var me     = this;
        me.tbar    = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu}); 
        me.store   = Ext.create('Rd.store.sWireguardServers');
        me.store.addListener('metachange',  me.onStoreWireguardServersMetachange, me);
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
                tdCls       : 'gridMain', 
                flex        : 1,
                filter      : {type: 'string'},
                renderer    : function(value,metaData, record){
                	var flag    = record.get('restart_flag');
                	var value   = record.get('name');
                	if(flag == 1){
                	    return "<i class=\"fa fa-gears\" style=\"color:orange;\"></i> "+value;
                	}
                    return value;	             
                }
            },
            
            { 
                text        : 'IP Address',               
                dataIndex   : 'ip_address',
                tdCls       : 'gridTree',  
                flex        : 1,
                filter      : {type: 'string'}
            },
            
            { 
                text        : 'MAC Address',               
                dataIndex   : 'mac',
                tdCls       : 'gridTree',  
                flex        : 1,
                filter      : {type: 'string'}
            },
            { 
                text        : 'Uplink Interface',               
                dataIndex   : 'uplink_interface',
                tdCls       : 'gridTree',  
                flex        : 1,
                filter      : {type: 'string'}
            },
            { 
                text        : "<i class=\"fa fa-gears\"></i> "+'Config Fetched', 
                dataIndex   : 'config_fetched',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(val,metaData, record){
                    var config_fetched_human     = record.get('config_fetched_human');  
                    var config;
                    var value = record.get('config_state');
                    if(value != 'never'){                    
                        if(value == 'up'){
                            config =  "<div class=\"rd-chip rd-chip--green\">"+config_fetched_human+"</div>";
                        }
                        if(value == 'down'){
                            config = "<div class=\"rd-chip rd-chip--grey\">"+config_fetched_human+"</div>";
                        }

                    }else{
                        config = "<div class=\"rd-chip rd-chip--blue\">Never</div>";
                    }
                    return config;
                                 
                },
                hidden: false
            },
            { 
                text        : "<i class=\"fa fa-heartbeat\"></i> "+'Heartbeat Received',   
                dataIndex   : 'last_contact',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(val,metaData, record){    
                    var heartbeat;
                    var value = record.get('state');
                    if(value != 'never'){                    
                        var last_contact     = record.get('last_contact_human');
                        if(value == 'up'){
                            heartbeat =  "<div class=\"rd-chip rd-chip--green\">"+last_contact+"</div>";
                        }
                        if(value == 'down'){
                            heartbeat = "<div class=\"rd-chip rd-chip--red\">"+last_contact+"</div>";
                        }

                    }else{
                        heartbeat = "<div class=\"rd-chip rd-chip--blue\">Never</div>";
                    }
                    return heartbeat;
                                 
                }
            },
            { 

                text        : 'From IP', 
                dataIndex   : 'last_contact_from_ip',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true, 
                xtype       :  'templatecolumn', 
                 tpl: new Ext.XTemplate(
                  '<div class="ip-cell">',
                    '<div class="ip-main"><i class="fa fa-network-wired"></i> {last_contact_from_ip}</div>',

                    '<tpl if="!Ext.isEmpty(city)">',
                      '<div class="ip-meta"><i class="fa fa-city"></i> {city}',
                        '<tpl if="!Ext.isEmpty(postal_code)"> ({postal_code})</tpl>',
                      '</div>',
                    '</tpl>',

                    '<tpl if="!Ext.isEmpty(state_name)">',
                      '<div class="ip-meta"><i class="fa fa-map"></i> {state_name}',
                        '<tpl if="!Ext.isEmpty(state_code)"> ({state_code})</tpl>',
                      '</div>',
                    '</tpl>',

                    '<tpl if="!Ext.isEmpty(country_name)">',
                      '<div class="ip-meta"><i class="fa fa-globe-africa"></i> {country_name}',
                        '<tpl if="!Ext.isEmpty(country_code)"> ({country_code})</tpl>',
                      '</div>',
                    '</tpl>',
                  '</div>'
                ),
                filter		: {type: 'string'}
            },
            { 
                text        : "<i class=\"fa fa-chain \"></i> "+'Active Peers',   
                dataIndex   : 'peers_active',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(val,metaData, record){    
                    var heartbeat;
                    var value = record.get('sessions_active');
                    if(value != 0){                    
                        return "<div class=\"fieldGreyWhite\">"+value+"</div>";
                    }else{
                        return Rd.config.dash;
                    }                              
                }
            },
            { 
                text        : 'Created',
                dataIndex   : 'created', 
                tdCls       : 'gridTree', 
                hidden      : true, 
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                    "<div class=\"rd-chip rd-chip--blue\">{created_in_words}</div>"
                ),
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
                    "<div class=\"rd-chip rd-chip--blue\">{modified_in_words}</div>"
                ),
                flex        : 1,
                filter      : {type: 'date',dateFormat: 'Y-m-d'}
            },
            {
                xtype       : 'actioncolumn',
                text        : 'Actions',
                width       : 80,
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
						tooltip : 'Restart Service',
                        handler: function(view, rowIndex, colIndex, item, e, record, row) {
                            this.fireEvent('itemClick', view, rowIndex, colIndex, item, e, record, row, 'restart');
                        }
                    }
				]
	        }      
        ]; 
        me.callParent(arguments);
    },
    onStoreWireguardServersMetachange: function(store,meta_data) {
        var me          = this;
       // me.down('#totals').setData(meta_data);
    }
});
