Ext.define('Rd.view.meshes.gridMeshExits' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridMeshExits',
    multiSelect: true,
    stateful: true,
    stateId: 'StateGridMeshExitsId',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar',
        'Ext.toolbar.Paging',
        'Ext.ux.ProgressBarPager'
    ],
    viewConfig: {
        loadMask:true
    },
    ui          : 'light',
    columnLines : false,
    rowLines    : false,
    stripeRows  : true,
    trackMouseOver: false,
    urlMenu     : '/cake4/rd_cake/meshes/menu_for_exits_grid.json',   
    initComponent: function () {
        var me = this;

        // store + listeners (unchanged)
        me.store = Ext.create('Rd.store.sMeshExits', {
            listeners: {
                load: function (store, records, successful) {
                    if (!successful) {
                        Ext.ux.Toaster.msg(
                            'Error encountered',
                            store.getProxy().getReader().rawData.message.message,
                            Ext.ux.Constants.clsWarn,
                            Ext.ux.Constants.msgWarn
                        );
                    }
                },
                update: function (store) {
                    store.sync({
                        success: function () {
                            Ext.ux.Toaster.msg(
                                i18n('sUpdated_item'),
                                i18n('sItem_has_been_updated'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                        },
                        failure: function () {
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_updating_the_item'),
                                i18n('sItem_could_not_be_updated'),
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                        }
                    });
                },
                scope: this
            },
            autoLoad: false
        });
        me.store.getProxy().setExtraParam('mesh_id', me.meshId);
        me.store.load();

        // paging + toolbar (unchanged)
        me.bbar = [{
            xtype: 'pagingtoolbar',
            store: me.store,
            displayInfo: true,
            plugins: { 'ux-progressbarpager': true }
        }];
        me.tbar = Ext.create('Rd.view.components.ajaxToolbar', { url: me.urlMenu });

        // helpers
        var dash = '<span class="rd-dash">—</span>';
        var chip = function (cls, iconCls, text) {
            var icon = iconCls ? '<i class="' + iconCls + '"></i>' : '';
            return '<span class="rd-chip ' + (cls || '') + '">' + icon + Ext.htmlEncode(text) + '</span>';
        };
        var dot   = function(colorCls){ return '<span class="rd-dot '+(colorCls||'')+'"></span>'; };

        Ext.apply(me, {
           

            viewConfig: {
                getRowClass: function (rec) {
                    var noFw = !rec.get('apply_firewall_profile');
                    var noSqm = !rec.get('apply_sqm_profile');
                    var noNs = !rec.get('collect_network_stats');
                    return (noFw && noSqm && noNs) ? 'rd-row-muted' : '';
                }
            },

            columns: [
                // Type → concise label + optional VLAN pill
                {
                    text        : i18n('sType'),
                    dataIndex   : 'type',
                    stateId     : 'StateGridMeshExitsId1',
                    width       : 220,
                    renderer: function (v, m, rec) {
                        // keep your mapping but show as label w/ status dot
                        switch (v) {
                            case 'bridge':
                                return dot('rd-dot--gray')   + 'Bridge';
                            case 'captive_portal':
                                return dot('rd-dot--purple') + 'Captive Portal';
                            case 'nat':
                                return dot('rd-dot--green')  + 'NAT + DHCP';
                            case 'tagged_bridge':
                                return dot('rd-dot--blue')   + 'L2 Tagged Bridge ' + chip('rd-chip--muted', 'fa fa-hashtag', 'VLAN ' + (rec.get('vlan')||''));
                            case 'openvpn_bridge':
                                return dot('rd-dot--blue')   + 'OpenVPN Bridge';
                            case 'tagged_bridge_l3':
                                return dot('rd-dot--blue')   + 'L3 Tagged Bridge ' + chip('rd-chip--muted', 'fa fa-hashtag', 'VLAN ' + (rec.get('vlan')||''));
                            case 'pppoe_server':
                                return dot('rd-dot--blue')   + 'PPPoE Server (Accel)';
                            default:
                                return Ext.htmlEncode(v || '');
                        }
                    }
                },

                // Connects with → SSID chips; special-case LAN & Dummy-n
                {
                    text: i18n('sConnects_with'),
                    dataIndex: 'connects_with',
                    stateId: 'StateGridMeshExitsId2',
                    flex: 1,
                    renderer: function (v, m, rec) {
                        var html = [];
                        if ((!v || v.length === 0) && rec.get('type') !== 'tagged_bridge_l3') {
                            html.push(dash);
                        }
                        if (Ext.isArray(v)) {
                            Ext.Array.forEach(v, function (item) {
                                var name = item.name || '';
                                if (name === 'LAN (If Hardware Supports It)') {
                                    // wired LAN chip
                                    html.push(chip('rd-chip--gray', 'fa fa-plug', 'LAN'));
                                } else if (/^Dynamic VLAN \d+$/.test(name)) {
                                    // clearly marked “dummy” target
                                    html.push(chip('rd-chip--muted', 'fa fa-sitemap', name));
                                } else {
                                    // regular Wi-Fi SSID
                                    html.push(chip('rd-chip--muted', 'fa fa-wifi', name));
                                }
                            });
                        }
                        return html.join(' ');
                    }
                },

                // Firewall
                {
                    text: 'Firewall',
                    dataIndex: 'apply_firewall_profile',
                    stateId: 'StateGridMeshExitsId3',
                    width: 200,
                    renderer: function (applies, m, rec) {
                        if (!applies) return dash;
                        return chip('rd-chip--gray', 'fa fa-shield-alt', rec.get('firewall_profile_name') || 'Firewall');
                    }
                },

                // SQM  (fixed dataIndex!)
                {
                    text: 'SQM',
                    dataIndex: 'apply_sqm_profile',
                    stateId: 'StateGridMeshExitsId4',
                    width: 200,
                    renderer: function (applies, m, rec) {
                        if (!applies) return dash;
                        return chip('rd-chip--blue', 'fa fa-sliders-h', rec.get('sqm_profile_name') || 'SQM');
                    }
                },

                // Net Stats flag
                {
                    text: 'Net Stats',
                    dataIndex: 'collect_network_stats',
                    stateId: 'StateGridMeshExitsId5',
                    width: 160,
                    renderer: function (flag) {
                        return flag ? chip('rd-chip--teal', 'fa fa-chart-area', 'Collecting') : dash;
                    }
                },

                // Auto-detect (boolean)
                {
                    text: i18n('sAuto_detect'),
                    dataIndex: 'auto_detect',
                    stateId: 'StateGridMeshExitsId6',
                    width: 150,
                    renderer: function (v) {
                        return v ? chip('rd-chip--muted', 'fa fa-magic', 'Auto') : dash;
                    }
                }
            ]
        });

        me.callParent(arguments);
    }
 
/*   
    initComponent: function(){
        var me      = this;
        me.store    = Ext.create('Rd.store.sMeshExits',{
            listeners: {
                load: function(store, records, successful) {
                    if(!successful){
                        Ext.ux.Toaster.msg(
                            'Error encountered',
                            store.getProxy().getReader().rawData.message.message,
                            Ext.ux.Constants.clsWarn,
                            Ext.ux.Constants.msgWarn
                        );
                        //console.log(store.getProxy().getReader().rawData.message.message);
                    } 
                },
                update: function(store, records, success, options) {
                    store.sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sUpdated_item'),
                                i18n('sItem_has_been_updated'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );   
                        },
                        failure: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_updating_the_item'),
                                i18n('sItem_could_not_be_updated'),
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                        }
                    });
                },
                scope: this
            },
            autoLoad: false 
        });
        me.store.getProxy().setExtraParam('mesh_id',me.meshId);
        me.store.load();
        
        me.bbar = [{
            xtype       : 'pagingtoolbar',
            store       : me.store,
            displayInfo : true,
            plugins     : {
                'ux-progressbarpager': true
            }
        }];

        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.columns  = [
            { 
                text    : i18n('sType'),                 
                dataIndex: 'type',          
                tdCls   : 'gridTree', 
                flex    : 1,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                    '<tpl if="type==\'bridge\'"><div class="fieldGreyWhite"><i class="fa fa-bars"></i> '+' '+'Bridge'+'</div></tpl>',
                    '<tpl if="type==\'captive_portal\'"><div class="fieldPurpleWhite"><i class="fa fa-key"></i> '+' '+'Captive Portal'+'</div></tpl>',
                    '<tpl if="type==\'nat\'"><div class="fieldGreenWhite"><i class="fa fa-arrows-alt"></i> '+' '+'NAT+DHCP'+'</div></tpl>',
                    '<tpl if="type==\'tagged_bridge\'"><div class="fieldBlueWhite"><i class="fa fa-tag"></i> '+' '+'Layer 2 Tagged Ethernet Bridge (&#8470; {vlan})'+'</div></tpl>',
                    '<tpl if="type==\'openvpn_bridge\'"><div class="fieldBlueWhite"><i class="fa fa-quote-right"></i> '+' '+'OpenVPN Bridge'+'</div></tpl>',
                    '<tpl if="type==\'tagged_bridge_l3\'"><div class="fieldBlue"><i class="fa fa-tag"></i> '+' '+'Layer 3 Tagged Ethernet Bridge (&#8470; {vlan})'+'</div></tpl>',
                    '<tpl if="type==\'pppoe_server\'"><div class="fieldBlueWhite"><i class="fa fa-link"></i> '+' '+'PPPoE Server (Accel)'+'</div></tpl>'
                ),        
                stateId: 'StateGridMeshExitsId1'
            },
            { 
                text    :   i18n('sConnects_with'),
                sortable: false,
                flex    : 1,  
                tdCls   : 'gridTree',
                xtype   :  'templatecolumn', 
                tpl:    new Ext.XTemplate(
                    '<tpl if="(Ext.isEmpty(connects_with)&&(type!=\'tagged_bridge_l3\'))"><div class=\"fieldRedWhite\"><i class="fa fa-exclamation-circle"></i> '+i18n('sNo_one')+'</div></tpl>', //Warn them when available     to all
                    '<tpl for="connects_with">',     // interrogate the realms property within the data
                        "<tpl><div class=\"fieldGreyWhite\">{name}</div></tpl>",
                    '</tpl>'
                ),
                dataIndex: 'connects_with',stateId: 'StateGridMeshExitsId2'
            },
             { 
                text    	: 'Firewall Profile',
                sortable	: false,
                flex    	: 1, 
                tdCls   	: 'gridTree', 
                xtype   	:  'templatecolumn', 
                tpl			:    new Ext.XTemplate(
                    '<tpl if="apply_firewall_profile">',
                    	"<tpl><div class=\"fieldBlueWhite\"><span style=\"font-family:FontAwesome;\">&#xf06d;</span>  {firewall_profile_name}</div></tpl>",
                    '<tpl else>',
                        "<tpl><div class=\"fieldGreyWhite\">No Active Firewall</div></tpl>",
                    '</tpl>'
                ),
                dataIndex	: 'apply_firewall_profile',
                stateId		: 'StateGridMeshExitsId3'
            },
            { 
                text    : 'SQM Profile',
                sortable: false,
                flex    : 1, 
                tdCls   : 'gridTree', 
                xtype   :  'templatecolumn', 
                tpl:    new Ext.XTemplate(
                    '<tpl if="apply_sqm_profile">',
                    	"<tpl><div class=\"fieldBlueWhite\"><i class=\"fa fa-th\"></i>  {sqm_profile_name}</div></tpl>",
                    '<tpl else>',
                        "<tpl><div class=\"fieldGreyWhite\">SQM Not Enabled</div></tpl>",
                    '</tpl>'
                ),
                dataIndex: 'apply_firewall_profile',stateId: 'StateGridAccessPointExitsId4'
            }, 
            { 
            	text		: i18n('sAuto_detect'),
            	dataIndex	: 'auto_detect',
            	tdCls		: 'gridTree',
            	flex		: 1,
            	stateId 	: 'StateGridMeshExitsId4',
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<tpl if="auto_detect"><div class=\"fieldGreen\"><i class="fa fa-check-circle"></i> Yes</div>',
                    '<tpl else>',
                    '<div class=\"fieldRed\"><i class="fa fa-times-circle"></i> No</div>',
                    "</tpl>"   
                )   
            }          
        ];
        me.callParent(arguments);
    }
    */
});
