Ext.define('Rd.view.aps.pnlApViewWanGraph', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlApViewWanGraph',
    border  : false,
    layout  : {
        type    : 'vbox',         
        align   : 'stretch'
    },
    initComponent: function(){
    
        var me      = this; 
        var m       = 5;
        var p       = 5;        
        var sLine = Ext.create('Ext.data.Store', {
            fields: [
                { name: 'delta_tx_bytes',   type: 'int' },
                { name: 'delta_rx_bytes',   type: 'int' },
                { name: 'delta_tx_packets', type: 'int' },
                { name: 'delta_rx_packets', type: 'int' }
            ],
            data: [{
                
            }]
        });
        
        var crtTraffic = {
            xtype   : 'cartesian',
            itemId  : 'crtTraffic',
            width   : '100%',
            flex    :   1,
            store   : sLine,
            legend  : false,
            axes    : [
                {
                    type        : 'numeric',
                    position    : 'left',
                    adjustByMajorUnit: true,
                    grid        : true,
                    fields      : ['delta_tx_bytes', 'delta_rx_bytes'],
                    renderer    : function(axis, label, layoutContext) {
                        return Ext.ux.bytesToHuman(label);
                    },
                    minimum: 0,
                    label       : Rd.config.rdGraphLabel
                }, {
                    type        : 'category',
                    position    : 'bottom',
                    grid        : false,
                    fields      : ['time_unit'],
                    label       : Rd.config.rdGraphLabel
                }
            ],
            series: [{
                type    : 'bar',
                title   : [ 'Data In', 'Data out' ],
                xField  : 'time_unit',
                yField  : ['delta_tx_bytes', 'delta_rx_bytes'],
                stacked : true,
                colors  : Rd.config.rdGraphBarColors, // Custom color set
                style   : {
                    opacity: 0.80,
                    minGapWidth: 30
                },
                highlight: {
                    fillStyle: 'yellow'
                },
                style: {
                    opacity: 0.80,
                    minGapWidth: 30
                },
                tooltip: {
                    renderer: function (tooltip, record, item) {
                        var di = Ext.ux.bytesToHuman(record.get("delta_rx_bytes"));
                        var dout = Ext.ux.bytesToHuman(record.get("delta_rx_bytes"));
                        tooltip.setHtml("Data in <b>"+di+"</b><br>Data out <b>"+dout+"</b>");                          
                    }
                }
            }],

            plugins: {
                ptype: 'chartitemevents',
                moveEvents: true
            }
        };
                          
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
                        itemId  : 'pnlTraffic',
                        margin  : m,
                        padding : p,
                        flex    : 1,
                        ui      : 'light',
                        tpl     : new Ext.XTemplate(                       
                            '<div class="sub-div-2" style="text-align: center;">',                                
                                '<p style="font-size:250%;font-weight:bolder;color:#29465b;"><i class="fa fa-database"></i> {[Ext.ux.bytesToHuman(values.data_total)]}</p>',
                                    '<p style="font-size:130%;color:#808080;font-weight:bolder;">',
                                    '<i class="fa fa-arrow-circle-down"></i> {[Ext.ux.bytesToHuman(values.data_in)]}',
                                    '&nbsp;&nbsp;&nbsp;&nbsp;',
                                    '<i class="fa fa-arrow-circle-up"></i> {[Ext.ux.bytesToHuman(values.data_out)]}',
                                '</p>',
                                '<p style="font-size:200%;font-weight:bolder;color:grey"><i class="fa fa-clock-o"></i> {span} minutes</p>',
                            '</div>'
                        ),  
                        data    : {
                        }
                    },
                    {
                        flex    : 2,  
                        xtype   : 'cartesian',
                        store: sLine,
                        axes: [{
                            type: 'numeric',
                            position: 'left',
                            title: {
                                text    : 'Packets',
                                fontSize: 15,
                                fill    : Rd.config.rdTextColor
                            },
                            label       : Rd.config.rdGraphLabel
                        }, 
                        {
                            type    : 'category',
                            position: 'bottom',
                            fields  : ['time_unit'],
                            label   : Rd.config.rdGraphLabel
                        }],
                        series: [                        
                            {
                                type    : 'line', //should be 'line' but we have some issues when building optimised code
                                xField  : 'time_unit',
                                yField  : 'delta_tx_packets',
                                title   : 'TX Packets',
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
                                        tooltip.setHtml('TX '+record.get('time_unit') + ': ' + record.get('delta_tx_packets'));
                                    }
                                }
                            }, 
                            {
                                type    : 'line',  //should be 'line' but we have some issues when building optimised code
                                xField  : 'time_unit',
                                yField  : 'delta_rx_packets',
                                title   : 'RX Packets',
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
                                        tooltip.setHtml('RX '+ record.get('time_unit') + ': ' + record.get('delta_rx_packets'));
                                    }
                                }
                            }
                        ]
                    }                                  
                ]
            },
            crtTraffic
        ];       
        
        me.callParent(arguments);
    }
});
