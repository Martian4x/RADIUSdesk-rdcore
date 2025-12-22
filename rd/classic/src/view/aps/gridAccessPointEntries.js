Ext.define('Rd.view.aps.gridAccessPointEntries' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridAccessPointEntries',
    multiSelect : true,
    stateful    : true,
    stateId     : 'StateGridAccessPointEntries',
    stateEvents :['groupclick','columnhide'],
    border      : false,
    requires    : [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig  : {
        loadMask:true
    },
    ui              : 'light',
    columnLines     : false,
    rowLines        : false,
    stripeRows      : true,
    trackMouseOver  : false,    
    urlMenu         : '/cake4/rd_cake/ap-profiles/menu_for_entries_grid.json',  
    initComponent   : function () {
        var me = this;

        // store
        me.store = Ext.create('Rd.store.sAccessPointEntries', {});
        me.store.getProxy().setExtraParam('ap_profile_id', me.apProfileId);
        me.store.load();

        // toolbar
        me.tbar = Ext.create('Rd.view.components.ajaxToolbar', { url: me.urlMenu });

        // tiny helpers (same as in Exit Points grid)
        var dash = '<span class="rd-dash">—</span>';
        var chip = function (cls, iconCls, text) {
            var icon = iconCls ? '<i class="' + iconCls + '"></i>' : '';
            return '<span class="rd-chip ' + (cls || '') + '">' + icon + Ext.htmlEncode(text) + '</span>';
        };

        me.columns = [
            // SSID + (optional) schedule badge
            {
                text        : i18n('sSSID'),
                dataIndex   : 'name',
                stateId     : 'StateGridAccessPointEntries2',
                flex        : 1,
                tdCls       : 'gridTree',
                renderer    : function (v, m, rec) {
                    var out = Ext.htmlEncode(v || '');
                    if (rec.get('chk_schedule')) {
                        out += ' ' + chip('rd-chip--muted', 'fa fa-calendar', 'Scheduled');
                    }
                    return out;
                }
            },

            // Encryption as a concise chip
            {
                text: i18n('sEncryption'),
                dataIndex: 'encryption',
                stateId: 'StateGridAccessPointEntries3',
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
            
            // Hidden (boolean)
            {
                text: i18n('sHidden'),
                dataIndex: 'hidden',
                stateId: 'StateGridAccessPointEntries4',
                width: 120,
                renderer: function (v) {
                    return v ? chip('rd-chip--muted', 'fa fa-eye-slash', 'Hidden') : dash;
                }
            },

            // Client isolation (boolean)
            {
                text: i18n('sClient_isolation'),
                dataIndex: 'isolate',
                stateId: 'StateGridAccessPointEntries5',
                width: 160,
                renderer: function (v) {
                    return v ? chip('rd-chip--muted', 'fa fa-user-times', 'Isolation') : dash;
                }
            },

            // Apply to all APs (boolean)
            {
                text: 'Apply to all APs',
                dataIndex: 'apply_to_all',
                stateId: 'StateGridAccessPointEntries6',
                width: 170,
                renderer: function (v) {
                    return v ? chip('rd-chip--green', 'fa fa-check-circle', 'All APs') : dash;
                }
            },

            // Connected to Exit (boolean) + tooltip when false
            {
                text: 'Connected to Exit',
                dataIndex: 'connected_to_exit',
                stateId: 'StateGridAccessPointEntries7',
                width: 180,
                renderer: function (v, m) {
                    if (v === true) {
                        return chip('rd-chip--green', 'fa fa-link', 'Connected');
                    }
                    m.tdAttr = 'data-qtip="<div><label class=\'lblTipItem\'>Go to Exit Points and connect this SSID to an Exit Point</label></div>"';
                    return chip('rd-chip--danger', 'fa fa-exclamation-circle', 'Not connected');
                }
            },

            // Frequency band as chips
            {
                text: 'Frequency',
                dataIndex: 'frequency_band',
                stateId: 'StateGridAccessPointEntries8',
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

            // keep your hidden technical columns
            { text: 'WPA Personal Key', hidden: true, dataIndex: 'special_key', stateId: 'StateGridAccessPointEntries9',  flex: 1 },
            { text: 'RADIUS Server',    hidden: true, dataIndex: 'auth_server', stateId: 'StateGridAccessPointEntries10', flex: 1 },
            { text: 'RADIUS Secret',    hidden: true, dataIndex: 'auth_secret', stateId: 'StateGridAccessPointEntries11', flex: 1 }
        ];
        
        me.callParent(arguments);
    }

/*  
    
    initComponent: function(){
        var me      = this;
        me.store    = Ext.create('Rd.store.sAccessPointEntries',{});
        me.store.getProxy().setExtraParam('ap_profile_id',me.apProfileId);
        me.store.load();
        
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        
        me.columns  = [
         //   {xtype: 'rownumberer', stateId: 'StateGridAccessPointEntries1'},
            { 
            	text		: i18n("sSSID"),
            	dataIndex	: 'name',
            	tdCls		: 'gridTree',
            	flex		: 1, 
            	stateId		: 'StateGridAccessPointEntries2',
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
                stateId: 'StateGridAccessPointEntries3'
            },
            { text: i18n("sHidden"),               dataIndex: 'hidden',            tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries4',
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<tpl if="hidden"><div class=\"fieldGreen\">Yes</div>',
                    '<tpl else>',
                    '<div class=\"fieldRed\">No</div>',
                    "</tpl>"   
                )   
            },
            { text: i18n("sClient_isolation"),     dataIndex: 'isolate',           tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries5',
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<tpl if="isolate"><div class=\"fieldGreen\">Yes</div>',
                    '<tpl else>',
                    '<div class=\"fieldRed\">No</div>',
                    "</tpl>"   
                )
            },
            { text: 'Apply to all APs',   dataIndex: 'apply_to_all',  tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries6',
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<tpl if="apply_to_all"><div class=\"fieldGreen\"><i class="fa fa-check-circle"></i> Yes</div>',
                    '<tpl else>',
                    '<div class=\"fieldRed\"><i class="fa fa-times-circle"></i> No</div>',
                    "</tpl>"   
                )   
            },
            { 
                text        : 'Connected to Exit' ,   
                dataIndex   : 'connected_to_exit',  
                tdCls       : 'gridTree', 
                flex        : 1, 
                stateId     : 'StateGridAccessPointEntries7',
                renderer    : function (v, m, r) {
                    if(v == true){
                        return '<div class=\"fieldGreen\"><i class="fa fa-check-circle"></i> Yes</div>';
                    }
                    if(v == false){
                        m.tdAttr = 'data-qtip="<div><label class=\'lblTipItem\'>Go to Exit Points and connect this SSID to an Exit Point</label></div>"';
                        return '<div class=\"fieldRedWhite\"><i class="fa  fa-exclamation-circle"></i> No</div>';
                    }
                 
                }
            },
            { text: 'Frequency',   dataIndex: 'frequency_band', tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries8',
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<tpl if="frequency_band==\'both\'"><div class=\"fieldGreyWhite\"> 2.4G & 5.8G </div></tpl>',
                    '<tpl if="frequency_band==\'two\'"><div class=\"fieldGreyWhite\"> 2.4G </div></tpl>',
                    '<tpl if="frequency_band==\'five\'"><div class=\"fieldGreyWhite\"> 5.8G </div></tpl>',
                    '<tpl if="frequency_band==\'five_lower\'"><div class=\"fieldGreyWhite\"> 5G Lower Band </div></tpl>',
                    '<tpl if="frequency_band==\'five_upper\'"><div class=\"fieldGreyWhite\"> 5G Upper Band </div></tpl>',
                )     
            },
            { text: 'WPA Personal Key', hidden: true,dataIndex: 'special_key',  tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries9'},
            { text: 'RADIUS Server',    hidden: true,dataIndex: 'auth_server',  tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries10'},
            { text: 'RADIUS Secret',    hidden: true,dataIndex: 'auth_secret',  tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries11'}
            
        ];
        me.callParent(arguments);
    }
    
    */
});
