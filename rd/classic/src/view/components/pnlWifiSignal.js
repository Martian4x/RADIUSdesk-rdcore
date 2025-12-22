Ext.define('Rd.view.components.pnlWifiSignal', {
    extend  : 'Ext.panel.Panel',
    alias   :'widget.pnlWifiSignal',
    margin  : 5,
    padding : 5,
    width   : 300,
    ui      : 'light',
    border  : true,
    listeners : {
        beforerender: function(pnl){
           // pnl.getStore().load();
        }
    },
    initComponent: function() {
       var me = this;
       me.items = [
            {
                xtype   : 'image',
                itemId  : 'imgLogo',
             //   src     : r.get('qmi_provider_logo'),
                padding : 5,
                style: {
                    'display': 'block',
                    'margin': 'auto'
                }
            },
            {
                xtype   : 'container',
                margin  : '0 5 0 5',
                itemId  : 'cntQuality',
                tpl     : new Ext.XTemplate(
                    "<h4 style='text-align: center;margin:10px;'>{ssid}</h4>",
                    '<div class="lblContainer">',                       
                        "<label class='lblItem'>Quality</label><label class='lblValue'>{quality}/70 ({quality_human})</label>",                                            
                    "</div>"
                ),
                data    : {}               
            },
            {
                xtype       : 'rdProgress',
                itemId      : 'pbQuality',
                height      : 10,
                value       : 0.67,
                margin      : '0 5 15 5'       
            },
            {
                xtype   : 'container',
                margin  : '0 5 0 5',
                itemId  : 'cntSignal',
                tpl     : new Ext.XTemplate(
                    '<div class="lblContainer">',
                        "<label class='lblItem'>Signal (dBm)</label><label class='lblValue'>{signal} ({signal_human})</label>",                                            
                    "</div>"
                ),
                data    : {}               
            },
            {
                xtype       : 'rdProgress',
                itemId      : 'pbSignal',
                height      : 10,
                value       : 0,
                margin      : '0 5 15 5'       
            },
            {
                xtype   : 'container',
                margin  : '0 5 0 5',
                itemId  : 'cntNoise',
                tpl     : new Ext.XTemplate(               
                    '<div class="lblContainer">',
                        "<label class='lblItem'>Noise (dBm)</label><label class='lblValue'>{noise} ({noise_human})</label>",                                            
                    "</div>"
                ),
                data    : {}               
            },
            {
                xtype       : 'rdProgress',
                itemId      : 'pbNoise',
                height      : 10,
                value       : 0,
                margin      : '0 5 15 5'       
            },
            {
                xtype   : 'container',
                margin  : '0 5 0 5',
                itemId  : 'cntOther',
                tpl     : new Ext.XTemplate(
                    '<div class="lblContainer">',
                        '<label class="lblItem">Channel</label><label class="lblValue">{channel}</label>',
                    '</div>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">TX Rate</label><label class="lblValue">{tx_rate} Mbps</label>',
                    '</div>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">RX Rate</label><label class="lblValue">{rx_rate} Mbps</label>',
                    '</div>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">TX Packets</label><label class="lblValue">{tx_packets}</label>',
                    '</div>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">RX Packets</label><label class="lblValue">{rx_packets}</label>',
                    '</div>',
                ),
                data    : {}               
            },                                  
        ];
            
        this.callParent(arguments);
    },
    updateGui: function(record){
        var me = this;
        
        //==Quality==
        if(record.get('quality')){
            me.down('#cntQuality').setData(record);
            me.down('#cntOther').setData(record);    
        }  
        
        if(record.get('quality_bar')){
            me.down('#pbQuality').setValue(record.get('quality_bar'));     
        } 
                
        //==Noise==
        if(record.get('noise')){
            me.down('#cntNoise').setData(record);     
        }  
        
        if(record.get('noise_bar')){
            me.down('#pbNoise').setValue(record.get('noise_bar'));     
        }   
        
        //==Signal==
        if(record.get('signal')){
            me.down('#cntSignal').setData(record);     
        }  
        
        if(record.get('signal_bar')){
            me.down('#pbSignal').setValue(record.get('signal_bar'));     
        }          
    },
    updateGuiFromData: function(data){
    
        var me = this;
        
        //==Quality==
        if(data.quality){
            me.down('#cntQuality').setData(data);
            me.down('#cntOther').setData(data);    
        }  
        
        if(data.quality_bar){
            me.down('#pbQuality').setValue(data.quality_bar);     
        } 
                
        //==Noise==
        if(data.noise){
            me.down('#cntNoise').setData(data);     
        }  
        
        if(data.noise_bar){
            me.down('#pbNoise').setValue(data.noise_bar);     
        }   
        
        //==Signal==
        if(data.signal){
            me.down('#cntSignal').setData(data);     
        }  
        
        if(data.signal_bar){
            me.down('#pbSignal').setValue(data.signal_bar);     
        }             
    }
});


