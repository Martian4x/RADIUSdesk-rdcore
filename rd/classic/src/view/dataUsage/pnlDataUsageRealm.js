Ext.define('Rd.view.dataUsage.pnlDataUsageRealm', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlDataUsageRealm',
    layout  : {
        type    : 'vbox',
        align   : 'stretch'
    },
    initComponent: function() {
        var me      = this; 
        var m       = 5;
        var p       = 5;
        
        Ext.create('Ext.data.Store', {
            storeId : 'strDataUsageRealmPie',
            fields  :[ 
                {name: 'id',            type: 'int'},
                {name: 'username',      type: 'string'},
                {name: 'mac',           type: 'string'},
                {name: 'data_in',       type: 'int'},
                {name: 'data_out',      type: 'int'},
                {name: 'data_total',    type: 'int'}
            ]
        });
        
        Ext.create('Ext.data.BufferedStore', {
            storeId : 'strDataUsageRealmActive',
            fields  :[ 
                {name: 'id',                type: 'int'},
                {name: 'username',          type: 'string'},
                {name: 'callingstationid',  type: 'string'},
                {name: 'online_human',      type: 'string'},
                {name: 'online',            type: 'int' }
            ],
            //To make it load AJAXly from the server specify the follown 3 attributes
            buffered        : true,
            leadingBufferZone: 5, 
            pageSize        : 20,
            remoteSort      : true,
            remoteFilter    : true,
            proxy: {
                    type    : 'ajax',
                    format  : 'json',
                    url     : '/cake4/rd_cake/data-usages-new/active-sessions.json',
                    reader: {
                        type			: 'json',
                        rootProperty    : 'items',
                        messageProperty	: 'message',
                        totalProperty	: 'totalCount' 
                    },
                    simpleSortMode: true,
                    extraParams : {
                        realm_id : -1
                    }
            },
            listeners: {           
                   metachange   : 'activeMetaChange',
                   scope        : me
            },
            autoLoad: false
        });
        
        Ext.create('Ext.data.BufferedStore', {
            storeId : 'dayMacStore',
            extend  : 'Ext.data.Store',
            fields  :[ 
                {name: 'id',            type: 'int'},
                {name: 'username',      type: 'string'},
                {name: 'type',          type: 'string'},
                {name: 'mac',           type: 'string'},
                {name: 'vendor',        type: 'string'},
                {name: 'data_in',       type: 'int'},
                {name: 'data_out',      type: 'int'},
                {name: 'data_total',    type: 'int'}
            ],
            //To make it load AJAXly from the server specify the follown 3 attributes
            buffered        : true,
            leadingBufferZone: 10, 
            pageSize        : 10,
            remoteSort  : true,
            remoteFilter: true,
            proxy: {
                    type    : 'ajax',
                    format  : 'json',
                    url     : '/cake4/rd_cake/data-usages/macs_for_user.json',
                    reader: {
                        type			: 'json',
                        rootProperty    : 'items',
                        messageProperty	: 'message',
                        totalProperty	: 'totalCount' 
                    },
                    simpleSortMode: true 
            },
            listeners: {
                'metachange' : function(store,meta,options) {
                    var title = "Devices";
                    if(meta.totalCount == 1){
                        title = meta.totalCount+" Device"    
                    }
                    
                    if(meta.totalCount > 1){
                        title = meta.totalCount+" Devices"    
                    }
                    me.down('#gridMacs').setTitle(title);
                }
            },
            autoLoad: true
        });
        
        me.items = [
            {
                xtype   : 'panel',
                flex    : 1,
                border  : false,
                layout: {
                    type    : 'hbox',
                    align   : 'stretch'
                },
                items : [
                    {
                        xtype   : 'panel',
                        title   : 'Summary',
                        ui      : 'panel-blue',
                        border  : true,
                        margin  : m,
                        padding : p,
                        flex    : 1,
                        layout  : 'fit',
                        scrollable  : true,
                        itemId  : 'pnlSummary', // keep if you already use it
                        // reference: 'dailyTotal', // uncomment if you prefer lookupReference()
                        bodyPadding: 8,
                        tpl: new Ext.XTemplate( 
                            '<div style="display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:12px;text-align:center;">',
                                '<div style="padding:12px;border-radius:12px;background:rgba(0,0,0,0.06);color:#29465b;">',
                                    '<tpl if="type==\'realm\'">',
                                        '<div style="font-size:22px;font-weight:700;">{realm}</div>',
                                    '</tpl>',
                                    '<tpl if="type==\'user\'">',
                                        '<div style="font-size:22px;font-weight:700;color:#0265cf;"><i class="fa fa-user"></i> {item_name}</div>',
                                    '</tpl>',
                                '</div>',
                            '</div><br>',                         
                            '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;text-align:center;">',
                                '<div style="padding:12px;border-radius:12px;background:rgba(0,0,0,0.03);color:#29465b;">',
                                    '<div style="font-size:12px;text-transform:uppercase;opacity:.7;">Date<br><br></div>',
                                    '<tpl if="historical">',
                                        '<div style="font-size:22px;font-weight:700;">{[this.fmtDate(values.date || values.start)]}</div>',
                                    '<tpl else>',
                                        '<div style="font-size:22px;font-weight:700;color:green">{[this.fmtDate(values.date || values.start)]}</div>',
                                    '</tpl>',
                                    '<div style="font-size:10px;font-weight:700;color:grey">{time}</div>',
                                '</div>',
                                '<div style="padding:12px;border-radius:12px;background:rgba(0,0,0,0.03);color:#29465b;">',
                                    '<div style="font-size:12px;text-transform:uppercase;opacity:.7;">Timespan<br><br></div>',
                                   // '<div style="font-size:22px;font-weight:700;">{[this.fmtSpan(values)]}</div>',
                                     '<div style="font-size:22px;font-weight:700;">{[this.frmtSpanSimple(values)]}</div>',
                                '</div>',
                                '<div style="padding:12px;border-radius:12px;background:rgba(0,0,0,0.03);color:#29465b;">',
                                    '<div style="font-size:12px;text-transform:uppercase;opacity:.7;"><i class="fa fa-database"></i> Data Total<br><br></div>',
                                    '<div style="font-size:24px;font-weight:800;letter-spacing:.3px;">{[Ext.ux.bytesToHuman(values.data_total)]}</div>',
                                '</div>',
                                '<div style="padding:12px;border-radius:12px;background:rgba(0,0,0,0.03);color:#29465b;">',
                                    '<div style="font-size:12px;text-transform:uppercase;opacity:.7;"><i class="fa fa-database"></i> Data In / Data Out<br><br></div>',
                                    '<div style="font-size:24px;font-weight:800;">{[Ext.ux.bytesToHuman(values.data_in)]} / {[Ext.ux.bytesToHuman(values.data_out)]}</div>',
                                '</div>',
                            '</div><br>',
                            // Only render this block when NOT historical
                            '<tpl if="!historical && type==\'realm\'">',
                                '<div style="display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:12px;text-align:center;">',
                                    '<div style="padding:12px;border-radius:12px;background:rgba(0,0,0,0.06);color:#29465b;">',
                                        '<div style="font-size:22px;font-weight:700;">',
                                            "<span style='color:#00e600;'><span class='fa' style='font-family:FontAwesome;'>&#xf10c</span></span> {online} Online",
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</tpl>',                           
                             
                            {
                                fmtDate: function (d) {
                                    // accepts Date or ISO string
                                    if (d) return d;
                                    if (!d) return '—';                                 
                                },
                                fmtNum: function (n) {
                                    n = parseFloat(n || 0);
                                    return Ext.util.Format.number(n, '0,0');
                                }, 
                                frmtSpanSimple: function (v) {
                                     if (v.timespan) return v.timespan;
                                     if (!v.timespan) return '—';
                                }
                            }
                        ),
                        data: {
                            // Example structure; update dynamically (see below)
                             //date: '2025-08-20',
                             //start: '2025-08-20 00:00:00',
                             //end:   '2025-09-20 14:59:59',
                             //requests: 186432,
                             //avg_rtt: 0.00631 // seconds
                        }
                    },
                    {
                        title           : 'Top 20 Users',
                        ui              : 'panel-blue',
                        flex            : 1,
                        margin          : m,
                        padding         : p,
                        border          : true,
                        itemId          : 'plrTop',
                        xtype           : 'polar',
                        innerPadding    : 10,
                        interactions    : ['rotate', 'itemhighlight'],
                        store: Ext.data.StoreManager.lookup('strDataUsageRealmPie'),
                        series: {
                           type         : 'pie',
                          
                           highlight    : true,
                           angleField   : 'data_total',
                           label        : {
                               field    : 'name',
                               display  : 'rotate'
                           },
                           donut        : 20,    
                           tooltip : {
                                trackMouse: true,
                                renderer: function (tooltip, record, item) {
                                    tooltip.setHtml(
                                        "<h2>"+record.get('username')+"</h2><h3>"+Ext.ux.bytesToHuman(record.get('data_total'))+"</h3>"
                                        
                                    
                                    );
                                }
                            }    
                        }
                    },
                    {
                        title   : 'User Detail',
                        ui      : 'panel-blue',
                        xtype   : 'pnlDataUsageUserDetail',
                        margin  : m,
                        padding : p,
                        hidden  : true,
                        flex    : 1  
                    },
                    {
                        xtype   : 'grid',
                        margin  : m,
                        padding : p,
                        title   : 'Top 20 Users',
                        ui      : 'panel-blue',
                        itemId  : 'gridTop',
                        border  : true,       
                        store   : Ext.data.StoreManager.lookup('strDataUsageRealmPie'),
                        emptyText: 'No Users For This Timespan',
                        columns: [
                            { text: 'Username',  dataIndex: 'username', flex: 1},
                            { text: 'Data In',   dataIndex: 'data_in',  hidden: true, renderer: function(value){
                                    return Ext.ux.bytesToHuman(value)              
                                } 
                            },
                            { text: 'Data Out',  dataIndex: 'data_out', hidden: true,renderer: function(value){
                                    return Ext.ux.bytesToHuman(value)              
                                } 
                            },
                            { text: 'Data Total',dataIndex: 'data_total',tdCls: 'gridMain',renderer: function(value){
                                    return Ext.ux.bytesToHuman(value)              
                                } 
                            }
                        ],
                        flex: 1
                    }
                              
                      
                ]
            },
            {
                xtype   : 'panel',
                flex    : 1,
                border  : false,
                layout: {
                    type    : 'hbox',
                    align   : 'stretch'
                },
                items   : [
                    {
                        xtype   : 'pnlDataUsageGraph',
                        flex    : 2,
                        margin  : m,
                        padding : p,
                        layout  : 'fit',
                        border  : false
                        
                    },
                    {
                        xtype   : 'grid',
                        itemId  : 'gridActive',
                        margin  : m,
                        padding : p,
                        ui      : 'panel-blue',
                        title   : 'Active Sessions',
                        border  : true,       
                        store   : Ext.data.StoreManager.lookup('strDataUsageRealmActive'),
                        emptyText: 'No Active Sessions Now',
                        plugins : 'gridfilters',  //*We specify this
                        tools   : [
                             {
                                tooltip : 'Reload',
                                itemId  : 'toolReload',
                                glyph   : Rd.config.icnReload
                            }
                        ],
                        columns: [
                            { text: 'Username',     dataIndex: 'username', flex: 1 ,            filter: {type: 'string'}},
                            { text: 'MAC Address',  dataIndex: 'callingstationid' ,flex  : 1,   filter: {type: 'string'}},
                            { 
                                text        : 'Time Online',   
                                dataIndex   : 'online',  
                                tdCls       : 'gridTree', 
                                flex        : 1,
                                filter      : {type: 'date',dateFormat: 'Y-m-d'},
                                xtype       : 'templatecolumn',
                                tpl         : new Ext.XTemplate(
                                    '<tpl>',
                                    "<span style='color:green;'><i class=\"fa fa-circle\"></i></span>",
                                    ' {online_human}',
                                    '</tpl>'
                                )
                            }
                        ],
                        flex: 1
                    }
                ]
            }               
        ];
        me.callParent(arguments);
    },
    activeMetaChange : function(store,meta,options){
        var me      = this;
        var title   = 'Active Sessions';
        title       = meta.totalCount + '  ' + title;
        me.down('#gridActive').setGlyph(Rd.config.icnFilter);
        if(meta.filterFlag){
            me.down('#gridActive').setGlyph(Rd.config.icnFilter);
            title = '- Filtered Results - ' + title ;
        }else{  
           me.down('#gridActive').setGlyph('');
        }
        me.down('#gridActive').setTitle(title);
    }
    
});
