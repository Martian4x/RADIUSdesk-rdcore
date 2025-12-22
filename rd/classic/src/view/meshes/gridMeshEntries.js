Ext.define('Rd.view.meshes.gridMeshEntries' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridMeshEntries',
    multiSelect: true,
    stateful: true,
    stateId: 'StateGridMeshEntries',
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
    ui              : 'light',
    columnLines     : false,
    rowLines        : false,
    stripeRows      : true,
    trackMouseOver  : false,    
    urlMenu         : '/cake4/rd_cake/meshes/menu_for_entries_grid.json',   
    initComponent   : function () {
        var me = this;

        // store + listeners (unchanged)
        me.store = Ext.create('Rd.store.sMeshEntries', {
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

        // paging bar (unchanged)
        me.bbar = [{
            xtype: 'pagingtoolbar',
            store: me.store,
            displayInfo: true,
            plugins: { 'ux-progressbarpager': true }
        }];

        // toolbar (unchanged)
        me.tbar = Ext.create('Rd.view.components.ajaxToolbar', { url: me.urlMenu });

        // helpers (same as other grids)
        var dash = '<span class="rd-dash">—</span>';
        var chip = function (cls, iconCls, text) {
            var icon = iconCls ? '<i class="' + iconCls + '"></i>' : '';
            return '<span class="rd-chip ' + (cls || '') + '">' + icon + Ext.htmlEncode(text) + '</span>';
        };

        me.columns  = [
            {
                text: i18n('sSSID'),
                dataIndex: 'name',
                stateId: 'StateGridMeshEntries2',
                flex: 1,
                tdCls       : 'gridTree',
                renderer: function (v, m, rec) {
                    var out = Ext.htmlEncode(v || '');
                    if (rec.get('chk_schedule')) {
                        out += ' ' + chip('rd-chip--muted', 'fa fa-calendar', 'Scheduled');
                    }
                    return out;
                }
            },
            {
                text: i18n('sEncryption'),
                dataIndex: 'encryption',
                stateId: 'StateGridMeshEntries3',
                width: 200,
                renderer: function (v) {
                    switch (v) {
                        case 'none': return chip('rd-chip--gray', 'fa fa-unlock', i18n('sNone'));
                        case 'wep':  return chip('rd-chip--gray', 'fa fa-lock',  i18n('sWEP'));
                        case 'psk':  return chip('',               'fa fa-lock',  i18n('sWPA_Personal'));
                        case 'psk2': return chip('',               'fa fa-lock',  i18n('sWPA2_Personal'));
                        case 'wpa':  return chip('rd-chip--blue', 'fa fa-lock',  i18n('sWPA_Enterprise'));
                        case 'wpa2': return chip('rd-chip--blue', 'fa fa-lock',  i18n('sWPA2_Enterprise'));
                        case 'ppsk': return chip('rd-chip--blue', 'fa fa-key',   'PPSK + RADIUS');
                        case 'ppsk_no_radius': return chip('',     'fa fa-key',   'PPSK (local)');
                        default:     return dash;
                    }
                }
            },
            {
                text: 'Frequency',
                dataIndex: 'frequency_band',
                stateId: 'sgMEnt4',
                width: 200,
                renderer: function (v) {
                    switch (v) {
                        case 'both':       return chip('rd-chip--muted', 'fa fa-wifi', '2.4G & 5G');
                        case 'two':        return chip('rd-chip--muted', 'fa fa-wifi', '2.4G');
                        case 'five':       return chip('rd-chip--muted', 'fa fa-wifi', '5G');
                        case 'five_lower': return chip('rd-chip--muted', 'fa fa-wifi', '5G Lower');
                        case 'five_upper': return chip('rd-chip--muted', 'fa fa-wifi', '5G Upper');
                        default:           return dash;
                    }
                }
            },
            {
                text: i18n('sHidden'),
                dataIndex: 'hidden',
                stateId: 'StateGridMeshEntries4',
                width: 120,
                renderer: function (v) {
                    return v ? chip('rd-chip--muted', 'fa fa-eye-slash', 'Hidden') : dash;
                }
            },
            {
                text: i18n('sClient_isolation'),
                dataIndex: 'isolate',
                stateId: 'StateGridMeshEntries5',
                width: 160,
                renderer: function (v) {
                    return v ? chip('rd-chip--muted', 'fa fa-user-times', 'Isolation') : dash;
                }
            },
            {
                text: i18n('sApply_to_all_nodes'),
                dataIndex: 'apply_to_all',
                stateId: 'StateGridMeshEntries6',
                width: 190,
                renderer: function (v) {
                    return v ? chip('rd-chip--green', 'fa fa-check-circle', 'All Nodes') : dash;
                }
            },
            {
                text: i18n('sConnected_to_Exit'),
                dataIndex: 'connected_to_exit',
                stateId: 'StateGridMeshEntries7',
                width: 190,
                renderer: function (v, m) {
                    if (v === true) {
                        return chip('rd-chip--green', 'fa fa-link', 'Connected');
                    }
                    m.tdAttr = 'data-qtip="<div><label class=\'lblTipItem\'>Go to Exit Points and connect this SSID to an Exit Point</label></div>"';
                    return chip('rd-chip--danger', 'fa fa-exclamation-circle', 'Not connected');
                }
            }
        ];
        
        me.callParent(arguments);
    }

    /*   
    initComponent: function(){
        var me      = this;
        me.store    = Ext.create('Rd.store.sMeshEntries',{
            listeners: {
                load: function(store, records, successful) {
                    if(!successful){
                        Ext.ux.Toaster.msg(
                            'Error encountered',
                            store.getProxy().getReader().rawData.message.message,
                            Ext.ux.Constants.clsWarn,
                            Ext.ux.Constants.msgWarn
                        );
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
           // {xtype: 'rownumberer', stateId: 'StateGridMeshEntries1'},
            { 
            	text		: i18n("sSSID"),
            	dataIndex	: 'name',
            	tdCls		: 'gridTree',
            	flex		: 1, 
            	stateId		: 'StateGridMeshEntries2',
            	xtype       :  'templatecolumn',
            	tpl        	:  new Ext.XTemplate(
            		'<tpl if="chk_schedule">',
            			'<div>{name} <i class="fa  fa-calendar" style="color:#1272c7"></i></div>',
            		'<tpl else>',
            			'<div>{name}</div>',
            		'</tpl>'
            	)          	
            },
            { 
                text        : i18n("sEncryption"),   
                dataIndex   : 'encryption',  
                tdCls       : 'gridTree', 
                flex        : 1,
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<tpl if="encryption==\'none\'"><div class="fieldGreyWhite"><i class="fa fa-unlock"></i> '+' '+i18n('sNone')+'</div></tpl>',
                    '<tpl if="encryption==\'wep\'"><div class="fieldGreyWhite"><i class="fa fa-lock"></i> '+' '+i18n('sWEP')+'</div></tpl>', 
                    '<tpl if="encryption==\'psk\'"><div class="fieldGreyWhite"><i class="fa fa-lock"></i> '+' '+i18n('sWPA_Personal')+'</div></tpl>',
                    '<tpl if="encryption==\'psk2\'"><div class="fieldGreyWhite"><i class="fa fa-lock"></i> '+' '+i18n('sWPA2_Personal')+'</div></tpl>',
                    '<tpl if="encryption==\'wpa\'"><div class="fieldGreyWhite"><i class="fa fa-lock"></i> '+' '+i18n('sWPA_Enterprise')+'</div></tpl>',
                    '<tpl if="encryption==\'wpa2\'"><div class="fieldGreyWhite"><i class="fa fa-lock"></i> '+' '+i18n('sWPA2_Enterprise')+'</div></tpl>',
                    '<tpl if="encryption==\'ppsk\'"><div class="fieldGreyWhite"><i class="fa fa-lock"></i> '+' '+'PPSK with RADIUS'+'</div></tpl>',
                    '<tpl if="encryption==\'ppsk_no_radius\'"><div class="fieldGreyWhite"><i class="fa fa-lock"></i> '+' '+'PPSK without RADIUS'+'</div></tpl>'
                ),   
                stateId: 'StateGridMeshEntries3'
            },
            { text: 'Frequency',   dataIndex: 'frequency_band', tdCls: 'gridTree', flex: 1, stateId: 'sgMEnt4',
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<tpl if="frequency_band==\'both\'"><div class=\"fieldGreyWhite\"> 2.4G & 5.8G </div></tpl>',
                    '<tpl if="frequency_band==\'two\'"><div class=\"fieldGreyWhite\"> 2.4G </div></tpl>',
                    '<tpl if="frequency_band==\'five\'"><div class=\"fieldGreyWhite\"> 5.8G </div></tpl>',
                    '<tpl if="frequency_band==\'five_lower\'"><div class=\"fieldGreyWhite\"> 5G Lower Band </div></tpl>',
                    '<tpl if="frequency_band==\'five_upper\'"><div class=\"fieldGreyWhite\"> 5G Upper Band </div></tpl>',
                )     
            },
            { text: i18n("sHidden"),               dataIndex: 'hidden',        tdCls: 'gridTree', flex: 1, stateId: 'StateGridMeshEntries4',
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<tpl if="hidden"><div class=\"fieldGreen\"><i class="fa fa-check-circle"></i> Yes</div>',
                    '<tpl else>',
                    '<div class=\"fieldRed\"><i class="fa fa-times-circle"></i> No</div>',
                    "</tpl>"   
                )     
            },
            { text: i18n("sClient_isolation"),     dataIndex: 'isolate',       tdCls: 'gridTree', flex: 1, stateId: 'StateGridMeshEntries5',
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<tpl if="isolate"><div class=\"fieldGreen\"><i class="fa fa-check-circle"></i> Yes</div>',
                    '<tpl else>',
                    '<div class=\"fieldRed\"><i class="fa fa-times-circle"></i> No</div>',
                    "</tpl>"   
                )   
            },
            { text: i18n("sApply_to_all_nodes"),   dataIndex: 'apply_to_all',  tdCls: 'gridTree', flex: 1, stateId: 'StateGridMeshEntries6',
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<tpl if="apply_to_all"><div class=\"fieldGreen\"><i class="fa fa-check-circle"></i> Yes</div>',
                    '<tpl else>',
                    '<div class=\"fieldRed\"><i class="fa fa-times-circle"></i> No</div>',
                    "</tpl>"   
                )   
            },
            { 
                text        : i18n("sConnected_to_Exit"),   
                dataIndex   : 'connected_to_exit',  
                tdCls       : 'gridTree', 
                flex        : 1, 
                stateId     : 'StateGridMeshEntries7',
                renderer    : function (v, m, r) {
                    if(v == true){
                        return '<div class=\"fieldGreen\"><i class="fa fa-check-circle"></i> Yes</div>';
                    }
                    if(v == false){
                        m.tdAttr = 'data-qtip="<div><label class=\'lblTipItem\'>Go to Exit Points and connect this SSID to an Exit Point</label></div>"';
                        return '<div class=\"fieldRedWhite\"><i class="fa  fa-exclamation-circle"></i> No</div>';
                    }
                 
                }
            }
        ];
        me.callParent(arguments);
    }*/
});
