Ext.define('Rd.view.aps.pnlApViewWanLte', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlApViewWanLte',
    border  : false,
    layout  : {
        type    : 'vbox',         
        align   : 'stretch'
    },
    requires    : [
        'Rd.view.components.pnlLteSignal',
        'Ext.chart.*'
    ],
    initComponent: function(){
    
        var me      = this; 
        var m       = 5;
        var p       = 5;        
        var sLine = Ext.create('Ext.data.Store', {
            fields: [
                { name: 'rsrp',type: 'int' },
                { name: 'rsrq',type: 'int' },
                { name: 'rssi',type: 'int' },
                { name: 'snr', type: 'int' }
            ],
            data: [{
                
            }]
        });
        
        var crtLte = Ext.create('Ext.chart.CartesianChart',{
            itemId  : 'crtLte',
            margin  : m,
            padding : p,

            flex    :  1,
            store   : sLine,
            legend  : {
                docked      : 'bottom'
            },         
            axes    : [
                {
                    type        : 'numeric',
                    position    : 'left',
                    adjustByMajorUnit: true,
                    grid        : true,
                    fields      : ['rsrp', 'rsrq', 'rssi', 'snr'],
                    label       : Rd.config.rdGraphLabel
                }, 
                {
                    type        : 'category',
                    position    : 'bottom',
                    grid        : false,
                    fields      : ['time_unit'],
                    label       : Rd.config.rdGraphLabel
                }
            ],
            series: [                                 
                {
                    type    : 'line', //should be 'line' but we have some issues when building optimised code
                    xField  : 'time_unit',
                    yField  : 'rsrp',
                    title   : 'RSRP',
                    marker: {
                        type: 'cross',
                        size: 4
                    },
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) {
                            tooltip.setHtml('RSRP '+record.get('time_unit') + ': ' + record.get('rsrp'));
                        }
                    }
                }, 
                {
                    type    : 'line',  //should be 'line' but we have some issues when building optimised code
                    xField  : 'time_unit',
                    yField  : 'rsrq',
                    title   : 'RSRQ',
                    marker: {
                        type: 'circle',
                        size: 4
                    },
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) {
                            tooltip.setHtml('RSRQ '+ record.get('time_unit') + ': ' + record.get('rsrq'));
                        }
                    }
                },
                {
                    type    : 'line',  //should be 'line' but we have some issues when building optimised code
                    xField  : 'time_unit',
                    yField  : 'rssi',
                    title   : 'RSSI',
                    marker: {
                        type: 'circle',
                        size: 4
                    },
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) {
                            tooltip.setHtml('RSSI '+ record.get('time_unit') + ': ' + record.get('rssi'));
                        }
                    }
                },
                {
                    type    : 'line',  //should be 'line' but we have some issues when building optimised code
                    xField  : 'time_unit',
                    yField  : 'snr',
                    title   : 'SNR',
                    marker: {
                        type: 'circle',
                        size: 4
                    },
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) {
                            tooltip.setHtml('SNR '+ record.get('time_unit') + ': ' + record.get('snr'));
                        }
                    }
                }
            ],
            listeners: {
              itemclick: function(chart, item, event, eOpts) { 
                var me = this;
                var guiData = item.record.get('gui');
                if(guiData){
                    me.up('pnlApViewWanLte').down('pnlLteSignal').updateGui(guiData); 
                    me.up('pnlApViewWanLte').down('pnlLteSignal').setTitle(item.record.get('time_unit'));  
                }                
              }
            },
            plugins: {
               ptype: 'chartitemevents',
               moveEvents: true
            },
        });
                          
        me.items = [
           {
                xtype   : 'panel',
                height  : 400,
                border  : false,
                layout: {
                    type    : 'hbox',
                    align   : 'stretch'
                },
                items : [
                    {
                        xtype   : 'pnlLteSignal'                      
                    },
                    crtLte                      
                ]
            }
        ];       
        
        me.callParent(arguments);
    }
});
