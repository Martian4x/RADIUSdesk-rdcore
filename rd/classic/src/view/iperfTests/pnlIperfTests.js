Ext.define('Rd.view.iperfTests.pnlIperfTests', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlIperfTests',
    plain       : true,
    frame       : false,
    layout  : {
        type    : 'hbox',         
        align   : 'stretch'
    },
    requires    : [
        'Rd.view.iperfTests.vcIperfTests',
        'Rd.view.iperfTests.cmbIperfServers',
        'Rd.view.iperfTests.gridIperfTests'       
    ],
    dev_mode    : false,
    dev_id      : false,
    controller  : 'vcIperfTests',   
    initComponent   : function(){
    
        var me 	    = this;
        var scale   = 'large';
        var dd      = Ext.getApplication().getDashboardData();
        var m       = 5;
        var p       = 5;
        
        me.timezone_id = dd.user.timezone_id;
        
        var pnlStatus = {
            xtype       : 'panel',
            itemId      : 'pnlStatus',
            bodyStyle   : 'background: linear-gradient(90deg, #f8f8f8 0%, #f0f0f0 100%); border-radius: 10px;',
            margin      : 10,
            tpl         : new Ext.XTemplate(                       
                '<div class="sub-div-2" style="text-align: center;">',                                
                    '<p style="font-size:200%;font-weight:bolder;color:grey"><i class="fa fa-clock-o"></i> Please Wait {counter}</p>',
                    '<p style="font-size:120%;color:blue"> Status: {status}</p>',
                '</div>'
            ),  
            data    : {
            },
            hidden  : true     
        }
        
        var frmSettings = {
            xtype       : 'form',
            height      : '100%', 
            width       :  450,
            ui          : 'panel-blue',
            border      : true,
            margin      : 0,
            title       : 'IPERF TESTS SETTINGS',
            layout      : 'anchor',
            itemId      : 'frmSettings',
            autoScroll  : true,
            defaults    : {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget       : 'under',
                labelClsExtra   : 'lblRd',
                labelAlign      : 'left',
                labelSeparator  : '',
                labelWidth      : Rd.config.labelWidth,
                maxWidth        : Rd.config.maxWidth, 
                margin          : Rd.config.fieldMargin
            },
            defaultType: 'textfield',
            items       : [
                pnlStatus,
                {
                    xtype   : 'cmbIperfServers'
                },
                {
                    xtype           : 'numberfield',
                    name            : 'port',
                    fieldLabel      : 'Port',
                    maxValue        : 65535,
                    minValue        : 1024,
                    labelClsExtra   : 'lblRdReq',
                    hideTrigger     : true,
                    keyNavEnabled  : false,
                    mouseWheelEnabled	: false
                },
                {
                    xtype       : 'radiogroup',
                    columns     : 1,
                    vertical    : false,
                     columns    : 2, // Set to number of radio buttons
                    fieldLabel  : 'Protocol',
                    items: [
                        { boxLabel: 'TCP',    name: 'protocol',    inputValue: 'tcp',   boxLabelCls	: 'boxLabelRd', checked: true   , margin: 0},
                        { boxLabel: 'UDP',    name: 'protocol',    inputValue: 'udp' ,  boxLabelCls	: 'boxLabelRd' , margin: 0},
                    ]
                },
                {
                    xtype       : 'fieldcontainer',
                    fieldLabel  : 'Duration (seconds)',
                    layout      : 'hbox',
                    items: [{
                        xtype       : 'slider',
                        itemId      : 'durationSlider',
                        value       : 1,
                        increment   : 1,
                        minValue    : 1,
                        maxValue    : 60,
                        flex        : 1,
                        name        : 'duration',
                        margin      : 0,
                        listeners   : {
                            change: function(slider, newValue) {
                                slider.up('fieldcontainer').down('#durationValue').setValue(newValue);
                            }
                        }
                    }, {
                        xtype       : 'displayfield',
                        itemId      : 'durationValue',
                        margin      : '0 0 0 10',
                        value       : '1',
                        width       : 30
                    }]
                },
                {
                    xtype       : 'fieldcontainer',
                    fieldLabel  : 'Number of streams',
                    layout      : 'hbox',
                    items: [{
                        xtype       : 'slider',
                        itemId      : 'streamsSlider',
                        value       : 1,
                        increment   : 1,
                        minValue    : 1,
                        maxValue    : 16,
                        flex        : 1,
                        name        : 'streams',
                        margin      : 0,
                        listeners   : {
                            change: function(slider, newValue) {
                                slider.up('fieldcontainer').down('#streamsValue').setValue(newValue);
                            }
                        }
                    }, {
                        xtype       : 'displayfield',
                        itemId      : 'streamsValue',
                        margin      : '0 0 0 10',
                        value       : '1',
                        width       : 30
                    }]
                },
                {
                    xtype       : 'checkbox',
                    name        : 'ping',
                    boxLabel    : 'Ping test',
                    checked     : true,
                    boxLabelCls : 'boxLabelRd',
                }       
            ],
            buttons     : [
                {
                    itemId  : 'btnStart',
                    text    : 'Start Test',
                    scale   : 'large',
                    formBind: true,
                    glyph   : Rd.config.icnYes,
                    margin  : Rd.config.buttonMargin,
                    ui      : 'button-teal',
                    disabled: true
                }
            ],
        };
        
        var pnlResults = {
            xtype       : 'gridIperfTests',
            dev_mode    : me.dev_mode,
            dev_id      : me.dev_id,
            ui          : 'panel-green',
            border      : true,
            margin      : 0,
            title       : 'TEST RESULTS',
            flex        : 1     
        }
            
        me.items = [
            frmSettings,
            pnlResults
        ];                                                     
        me.callParent(arguments);
    }
    
});

