Ext.define('Rd.view.dataUsage.pnlDataUsage', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlDataUsage',
    plain       : true,
    frame       : false,
    layout      : {
        type    : 'vbox',
        pack    : 'start',
        align   : 'stretch'
    },
    requires: [
        'Rd.view.dataUsage.vcPnlDataUsage',
        'Rd.view.dataUsage.pnlDataUsageRealm',
        'Rd.view.dataUsage.pnlDataUsageUserDetail',
        'Rd.view.components.cmbRealm'
    ],
    controller : 'vcPnlDataUsage',
      
    initComponent: function() {
        var me      = this;
        var scale   = 'small';
        var m       = 5;
        var p       = 5;       
        me.dockedItems= [
            {
                xtype   : 'toolbar',
                dock    : 'top',
                items   : [
                    {  
                        glyph   : Rd.config.icnReload,    
                        scale   : scale, 
                        itemId  : 'reload',
                        ui      : 'button-orange',   
                        tooltip: i18n('sReload')
                    },
                    {
                        xtype       : 'cmbRealm',
                        allOption   : true,
                        width       : 250,
                        labelWidth  : 50,
                        itemId      : 'duCmbRealm',
                        value       : 0 
                    },
                    '|',
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnLeft,
                        reference   : 'btnTimeBack',
                        tooltip     : 'Go Back 1Day',
                        listeners   : {
                            click: 'onClickTimeBack'
                        }
                    },  
                    {
                        xtype       : 'datefield',
                        itemId      : 'dtDate',
                        reference   : 'dtDate',
                        name        : 'date',
                        format      : "d/m/Y",
                        value       : new Date(),
                        width       : 120
                    },
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnRight,
                        reference   : 'btnTimeForward',
                        tooltip     : 'Go Forward 1Day',
                        disabled    : true,
                        listeners   : {
                            click: 'onClickTimeForward'
                        }
                    }, 
                    '|',
                    {
                        text        : 'Day',
                        glyph       : Rd.config.icnHourStart,
                        scale       : scale,
                        enableToggle: true,
                        toggleGroup : 'range',
                        allowDepress: false,
                        value       : 'day',
                        pressed     : true,
                        listeners   : {
                            click: 'onClickTodayButton'
                        }
                    }, 
                    {
                        text        : 'Week',
                        glyph       : Rd.config.icnHourHalf,
                        scale       : scale,
                        enableToggle: true,
                        toggleGroup: 'range',
                        allowDepress: false,
                        value       : 'week',
                        listeners   : {
                           click: 'onClickThisWeekButton'
                        }
                    }, 
                    {
                        text        : 'Month',
                        glyph       : Rd.config.icnHourEnd,
                        scale       : scale,
                        enableToggle: true,
                        toggleGroup: 'range',
                        allowDepress: false,
                        value       : 'month',
                        listeners   : {
                            click: 'onClickThisMonthButton'
                        }
                    },          
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnTime,
                        tooltip     : 'Timezone',
                        ui          : 'button-metal',   
                        menu        : [
                        {
                            xtype         : 'cmbTimezones', 
                            width         : 300, 
                            itemId        : 'cmbTimezone',
                            name          : 'timezone_id', 
                            labelClsExtra : 'lblRdReq',
                            labelWidth    : 100, 
                            padding       : 10,
                            margin        : 10,
                            value         : me.timezone_id,
                            listeners     : {
                                change  : function(cmb){
                                    var btn = cmb.up('button');
                                    btn.getMenu().hide();
                                }
                            }
                        }]
                    },
                    '|',
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnWifi,
                        text        : 'RADIUS Clients',
                        ui          : 'button-metal',
                        listeners   : {
                             click: 'onClickRadiusClientsButton'
                        }
                    },
                    '|',
                    { 
                        scale   : 'small',
                        itemId  : 'btnShowRealm',
                        glyph   : Rd.config.icnBack,  
                        text    : 'Back',
                        hidden  : true,
                        ui      : 'button-pink'
                    }
                ]
            }
        ];
        
        me.items = [
            {
                xtype   : 'pnlDataUsageRealm',
                flex    : 1
            }
        ];
           
        me.callParent(arguments);
    }
});
