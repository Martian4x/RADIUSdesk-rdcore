Ext.define('Rd.view.wireguard.gridWireguardPeers' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridWireguardPeers',
    multiSelect : true,
    store       : 'sWireguardPeers',
    stateful    : true,
    stateId     : 'StateGridWireguardPeers',
    stateEvents :['groupclick','columnhide'],
    border      : false,
    padding     : 0,
    instance_id : null, //we have to specify this
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
        'Rd.view.wireguard.vcWireguardPeers',
        'Rd.view.wireguard.pnlWireguardPeerAddEdit',
        'Rd.view.wireguard.pnlWireguardPeerQrcode'
    ],
    controller  : 'vcWireguardPeers',
    urlMenu     : '/cake4/rd_cake/wireguard-peers/menu-for-grid.json',  
    initComponent: function(){
        var me      = this;
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu}); 
        me.store    = Ext.create('Rd.store.sWireguardPeers');        
        me.store.getProxy().setExtraParam('instance_id',me.instance_id);
        
        var dash    = '<span class="rd-dash">—</span>';
        var chip    = function(cls, iconCls, text){
            var icon = iconCls ? '<i class="' + iconCls + '"></i>' : '';
            return '<span class="rd-chip ' + (cls||'') + '">' + icon + Ext.htmlEncode(text) + '</span>';
        };
      
        me.store.addListener('metachange',  me.onStoreWireguardPeersMetachange, me);
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
                filter      : {type: 'string'}
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
                text        : 'Last handshake',               
                dataIndex   : 'last_handshake_ts',
                sortable    : true,
                tdCls       : 'gridTree', 
                renderer: function (enabled, m, rec) {
                    var last_seen = rec.get('last_seen');
                    if(rec.get('state') == 'never'){
                        return chip('rd-chip--blue','','Never');
                    }
                    if(rec.get('state') == 'up'){
                        return chip('rd-chip--green','',last_seen);
                    }
                    if(rec.get('state') == 'down'){
                        return chip('rd-chip--grey','',last_seen);
                    }
                },
                filter      : {type: 'string'},
                flex        : 1
            },
            { 
                text        : 'RX bytes',               
                dataIndex   : 'rx_human',
                sortable    : true,
                tdCls       : 'gridTree',  
                filter      : {type: 'string'},
                flex        : 1
            },
            { 
                text        : 'TX bytes',               
                dataIndex   : 'tx_human',
                sortable    : true,
                tdCls       : 'gridTree',  
                filter      : {type: 'string'},
                flex        : 1
            },
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
					}
				]
	        }      
        ]; 
        me.callParent(arguments);
    },
    onStoreWireguardPeersMetachange: function(store,meta_data) {
        var me          = this;
       // me.down('#totals').setData(meta_data);
    }
});
