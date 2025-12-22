Ext.define('Rd.view.aps.pnlApViewWanWifi', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlApViewWanWifi',
    border  : false,
    layout  : {
        type    : 'vbox',         
        align   : 'stretch'
    },
    requires    : [
        'Rd.view.components.pnlWifiSignal',
        'Ext.chart.*'
    ],
    initComponent: function(){
    
        var me      = this; 
        var m       = 5;
        var p       = 5;        
        var sLine = Ext.create('Ext.data.Store', {
            fields: [
                { name: 'signal',   type: 'int' },
                { name: 'bitrate',  type: 'int' },
                { name: 'txpower',  type: 'int' },
                { name: 'tx_rate',  type: 'int' },
                { name: 'channel',  type: 'int' },
                { name: 'quality',  type: 'int' },
                { name: 'rx_rate',  type: 'int' },
                { name: 'noise',    type: 'int' }               
            ],
            data: [{
                
            }]
        });
        
        var crtWifi = Ext.create('Ext.chart.CartesianChart',{
            itemId  : 'crtWifi',
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
                    minimum     : -200, // Minimum value for the y-axis
                    maximum     : 0,  // Maximum value for the y-axis
                    grid        : true,
                    fields      : ['signal', 'noise'],
                  //  label       : Rd.config.rdGraphLabel
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
                    yField  : 'signal',
                    title   : 'Signal',
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
                            tooltip.setHtml('Signal '+record.get('time_unit') + ': ' + record.get('signal'));
                        }
                    }
                },
                {
                    type    : 'line',  //should be 'line' but we have some issues when building optimised code
                    xField  : 'time_unit',
                    yField  : 'noise',
                    title   : 'Noise',
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
                            tooltip.setHtml('Noise '+ record.get('time_unit') + ': ' + record.get('noise'));
                        }
                    }
                }
            ],
            listeners: {
              itemclick: function(chart, item, event, eOpts) { 
                var me = this;
                var record = item.record;
                if(record){
                    me.up('pnlApViewWanWifi').down('pnlWifiSignal').updateGui(record); 
                    me.up('pnlApViewWanWifi').down('pnlWifiSignal').setTitle(record.get('time_unit'));  
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
                        xtype   : 'pnlWifiSignal'                      
                    },
                    crtWifi                      
                ]
            }
        ];       
        
        me.callParent(arguments);
    }
});
