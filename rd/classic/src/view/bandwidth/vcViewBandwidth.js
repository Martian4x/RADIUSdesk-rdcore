Ext.define('Rd.view.bandwidth.vcViewBandwidth', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcViewBandwidth',
    config: {
        span        : 'hour',
        urlIndex    : '/cake4/rd_cake/bandwidth-reports/index.json',
        mac         : false,
        macAddressId: false,
        macProtocol : false,
        
        protocol        : false,
        protocolMacId   : false
    },
    control: {
        'pnlViewBandwidth': {
            activate   : 'genChange'
        },
        'pnlViewBandwidth cmbBandwidthInterfaces' : {
            change  : 'genChange'        
        },
        'pnlViewBandwidth #reload' : {
            click  : 'genChange'        
        },
        'pnlViewBandwidth #btnBack' : {
            click    : 'btnBack'
        },
        'pnlViewBandwidth #gridTraffic' : {
            rowclick    : 'rowClickTraffic'
        },
        '#gridClientProtocol #toolClearFilterClientProtocol' : {
            click   : 'clearFilterClientProtocol'
        },
        '#gridClientProtocol' : {
            rowclick    : 'rowClickClientProtocol'
        },
        
        'pnlViewBandwidth #gridProtocol' : {
            rowclick    : 'rowClickProtocol'
        },
        '#gridProtocolClient #toolClearFilterProtocolClient' : {
            click   : 'clearFilterProtocolClient'
        },
        '#gridProtocolClient' : {
            rowclick    : 'rowClickProtocolClient'
        }
    },
    genChange: function(cmb){
        var me = this;
        me.fetchReport();
    },
    onClickHourButton: function(){
        var me = this;
        me.setSpan('hour');
        me.fetchReport();
    },
    onClickDayButton: function(){
        var me = this;
        me.setSpan('day');
        me.fetchReport();
    },
    onClickWeekButton: function(button){
        var me = this;
        me.setSpan('week');
        me.fetchReport();
    },    
    onClickTrafficButton: function(b){
        var me          = this;
        me.getView().down('#gridProtocol').hide();
        me.getView().down('#gridTraffic').show();
        me.getView().down('#plrProtocol').hide();
        me.getView().down('#plrTraffic').show();      
    },
    onClickProtocolsButton: function(b){
        var me          = this;
        me.getView().down('#gridProtocol').show();
        me.getView().down('#gridTraffic').hide();
        me.getView().down('#plrProtocol').show();
        me.getView().down('#plrTraffic').hide(); 
    },
    rowClickTraffic : function(grid,record){
        var me   = this;    
        var mac_address_id  = record.get('mac_address_id');
        var mac =  record.get('mac');       
        me.getView().down('#btnBack').show();
        me.getView().down('#sepBack').show();
        me.getView().down('#gridClientProtocol').show();
        me.getView().down('cmbBandwidthInterfaces').setDisabled(true);
        me.getView().down('#btnTraffic').setDisabled(true);
        me.getView().down('#btnProtocols').setDisabled(true);
        me.getView().down('buttongroup').updateLayout();
        me.setMacAddressId(mac_address_id);
        me.setMac(mac);                 
        me.genChange();   
    }, 
    btnBack : function(btn){
        var me   = this;        
        me.getView().down('#btnBack').hide();
        me.getView().down('#sepBack').hide();
        me.getView().down('#gridClientProtocol').hide();
        me.getView().down('#gridProtocolClient').hide();      
        me.getView().down('cmbBandwidthInterfaces').setDisabled(false);
        me.getView().down('#btnTraffic').setDisabled(false);
        me.getView().down('#btnProtocols').setDisabled(false);
        me.setMacAddressId(false);
        me.setMac(false);
        me.setProtocol(false);
        me.setProtocolMacId(false);
        
        //--Traffic--
        me.getView().down('#toolClearFilterClientProtocol').hide();
        me.setMacProtocol(false);
        
        //--Protocols--
        me.getView().down('#toolClearFilterProtocolClient').hide();
        me.setProtocolMacId(false); 
                                     
        me.genChange();   
    },    
    fetchReport : function(){  
        var me      = this;    
        me.getView().setLoading(true);
        var exit_id = me.getView().down('cmbBandwidthInterfaces').getValue();
        var tz_id   = me.getView().timezone_id;  
        Ext.Ajax.request({
            url: me.getUrlIndex(),
            params: {
                span        : me.getSpan(),
                dev_mode    : me.getView().dev_mode,
                dev_id      : me.getView().dev_id,
                timezone_id : tz_id,
                exit_id     : exit_id,
                mac         : me.getMac(),
                mac_address_id  : me.getMacAddressId(),
                mac_protocol    : me.getMacProtocol(),
                protocol        : me.getProtocol(),
                protocol_mac_id : me.getProtocolMacId() 
            },  
            method: 'GET',
            success: function(response){
                var jsonData = Ext.JSON.decode(response.responseText);
                me.getView().setLoading(false);                
                if(jsonData.success){
                    //Here we'll paintScreen()    
                    me.paintScreen(jsonData.data);
                }
            }
        });
    },
    paintScreen : function(data){
        var me = this;
        me.getView().down('#barTraffic').getStore().setData(data.graph.items);
        me.getView().down('#plrTraffic').getStore().setData(data.top_traffic);
        me.getView().down('#plrProtocol').getStore().setData(data.top_protocol);
        me.getView().down('#gridClientProtocol').getStore().setData(data.top_protocol);
        me.getView().down('#gridProtocolClient').getStore().setData(data.top_traffic);
        me.getView().down('#pnlSummary').setData(data.summary);  
    },
    rowClickClientProtocol : function(grid,record){
        var me = this;
        me.setMacProtocol(record.get('layer7'));
        me.getView().down('#toolClearFilterClientProtocol').show();
        me.genChange();
    },
    clearFilterClientProtocol : function(tool){
        var me = this;
        me.getView().down('#toolClearFilterClientProtocol').hide();
        me.setMacProtocol(false);
        me.genChange(); 
    },  
    rowClickProtocol : function(grid,record){
        var me   = this;    
        var mac_address_id  = record.get('mac_address_id');
        var layer7 =  record.get('layer7');       
        me.getView().down('#btnBack').show();
        me.getView().down('#sepBack').show();
        me.getView().down('#gridProtocolClient').show();
        me.getView().down('cmbBandwidthInterfaces').setDisabled(true);
        me.getView().down('#btnTraffic').setDisabled(true);
        me.getView().down('#btnProtocols').setDisabled(true);
        me.getView().down('buttongroup').updateLayout();
        me.setProtocol(layer7);               
        me.genChange();   
    },     
    rowClickProtocolClient : function(grid,record){
        var me = this;
        me.setProtocolMacId(record.get('mac_address_id'));
        me.getView().down('#toolClearFilterProtocolClient').show();
        me.genChange();
    },
    clearFilterProtocolClient : function(tool){
        var me = this;
        me.getView().down('#toolClearFilterProtocolClient').hide();
        me.setProtocolMacId(false);
        me.genChange(); 
    }
});
