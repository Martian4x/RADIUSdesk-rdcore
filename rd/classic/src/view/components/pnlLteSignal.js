Ext.define('Rd.view.components.pnlLteSignal', {
    extend  : 'Ext.panel.Panel',
    alias   :'widget.pnlLteSignal',
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
                itemId  : 'cntRssi',
                tpl     : new Ext.XTemplate(
                    "<div>",
                        "<h4 style='text-align: center;margin:5px;'>{qmi_type}</h4>",
                        "<label class='lblTipItemL'>RSSI</label><label class='lblTipValueL'>{qmi_rssi} ( {qmi_rssi_human} )</label>",                                            
                    "</div>"
                ),
                data    : {}               
            },
            {
                xtype       : 'rdProgress',
                itemId      : 'pbRssi',
                height      : 10,
                value       : 0,
                margin      : '0 5 15 5'       
            },

            //==Power==
            {
                xtype   : 'container',
                margin  : '0 5 0 5',
                itemId  : 'cntRsrp',
                tpl     : new Ext.XTemplate(
                    "<div>",
                        "<label class='lblTipItemL'>RSRP (dBm)</label><label class='lblTipValueL'>{qmi_rsrp} ( {qmi_rsrp_human} )</label>",                                           
                    "</div>"
                ),
                data    : {}
            },
            {
                xtype       : 'rdProgress',
                itemId      : 'pbRsrp',
                height      : 10,
                value       : 0,
                margin      : '0 5 15 5'       
            },

            //==Quality==
            {
                xtype   : 'container',
                margin  : '0 5 0 5',
                itemId  : 'cntRsrq',
                tpl     : new Ext.XTemplate(
                    "<div>",
                        "<label class='lblTipItemL'>RSRQ (dB)</label><label class='lblTipValueL'>{qmi_rsrq} ( {qmi_rsrq_human} )</label>",                                           
                    "</div>"
                ),
                data    : {}
            },
            {
                xtype       : 'rdProgress',
                itemId      : 'pbRsrq',
                height      : 10,
                value       : 0,
                margin      : '0 5 15 5'       
            },

            //==SNR==
            {
                xtype   : 'container',
                margin  : '0 5 0 5',
                itemId  : 'cntSnr',
                tpl     : new Ext.XTemplate(
                    "<div>",
                        "<label class='lblTipItemL'>SINR (dB)</label><label class='lblTipValueL'>{qmi_snr} ( {qmi_snr_human})</label>",                                        
                    "</div>"
                ),
                data    : {}
            },
            {
                xtype       : 'rdProgress',
                itemId      : 'pbSnr',
                height      : 10,
                value       : 0,
                margin      : '0 5 15 5'        
            }                                     
        ];
            
        this.callParent(arguments);
    },
    updateGui: function(d){
        var me = this;
        
        if(d.qmi_provider_logo){
            me.down('#imgLogo').setSrc(d.qmi_provider_logo);     
        } 
        
        //==RSSI==
        if(d.qmi_rssi && d.qmi_rssi_human ){
            me.down('#cntRssi').setData(d);     
        }  
        
        if(d.qmi_rssi_bar){
            me.down('#pbRssi').setValue(d.qmi_rssi_bar);     
        }
               
        //==Power==
        if(d.qmi_rsrp && d.qmi_rsrp_human ){
            me.down('#cntRsrp').setData(d);     
        }  
        
        if(d.qmi_rsrp_bar){
            me.down('#pbRsrp').setValue(d.qmi_rsrp_bar);     
        }
              
        //==Quality==
        if(d.qmi_rsrq && d.qmi_rsrq_human ){
            me.down('#cntRsrq').setData(d);     
        }  
        
        if(d.qmi_rsrq_bar){
            me.down('#pbRsrq').setValue(d.qmi_rsrq_bar);     
        }
        
        //==SNR==
        if(d.qmi_snr && d.qmi_snr_human ){
            me.down('#cntSnr').setData(d);     
        }  
        
        if(d.qmi_snr_bar){
            me.down('#pbSnr').setValue(d.qmi_snr_bar);     
        }  
        
    }
});


