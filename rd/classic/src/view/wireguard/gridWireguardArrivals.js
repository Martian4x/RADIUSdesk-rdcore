Ext.define('Rd.view.wireguard.gridWireguardArrivals' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridWireguardArrivals',
    multiSelect : true,
    store       : 'sWireguardArrivals',
    stateful    : true,
    stateId     : 'StateGridWireguardArrivals',
    stateEvents :['groupclick','columnhide'],
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
        'Rd.view.wireguard.vcWireguardArrivals',
    ],
    controller  : 'vcWireguardArrivals',
    urlMenu     : '/cake4/rd_cake/wireguard-arrivals/menu-for-grid.json',  
    initComponent: function(){
        var me     = this;
        me.tbar    = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu}); 
        me.store   = Ext.create('Rd.store.sWireguardArrivals');
        me.bbar    =  [
            {
                 xtype       : 'pagingtoolbar',
                 store       : me.store,
                 dock        : 'bottom',
                 displayInfo : true
            }  
        ];
               
        me.columns  = [
            { 
                text        : 'MAC Address',               
                dataIndex   : 'mac',
                tdCls       : 'gridMain', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridWgaA1'
            },   
            { 
                text        : 'Last Contact',   
                dataIndex   : 'last_contact',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(v,metaData, record){
                    if(record.get('last_contact') == null){
                        return '<span class="rd-chip rd-chip--blue">Never</span>';
                    }
                    var last_contact_human  = record.get('last_contact_human');
                    var green_flag          = false; //We show contact from the last seconds and minutes as geeen
                    if(
                        (last_contact_human.match(/just now/g))||
                        (last_contact_human.match(/minute/g))||
                        (last_contact_human.match(/second/g))
                    ){
                        green_flag = true;
                    }
                    if(green_flag){
                        return '<span class="rd-chip rd-chip--green">' + last_contact_human + '</span>';
                    }else{
                        return '<span class="rd-chip rd-chip--purple">' + last_contact_human + '</span>';
                    }        
                },stateId: 'StateGridWgaA2'
            },
			{ 

                text        : 'From IP', 
                dataIndex   : 'last_contact_from_ip',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false, 
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
                filter		: {type: 'string'},stateId: 'StateGridWgaA3'
            },
            {
                xtype       : 'actioncolumn',
                text        : 'Actions',
                width       : 80,
                stateId     : 'StateGridWgaA4',
                items       : [					 
                    { 
						iconCls : 'txtRed x-fa fa-trash',
						tooltip : 'Delete',
                        handler: function(view, rowIndex, colIndex, item, e, record, row) {
                            this.fireEvent('itemClick', view, rowIndex, colIndex, item, e, record, row, 'delete');
                        }
                    },
                    {  
                        iconCls : 'txtBlue x-fa fa-paperclip',
                        tooltip : 'Edit',
						handler: function(view, rowIndex, colIndex, item, e, record, row) {
                            this.fireEvent('itemClick', view, rowIndex, colIndex, item, e, record, row, 'attach');
                        }
					}
				]
	        }      
        ]; 
        me.callParent(arguments);
    }
});
