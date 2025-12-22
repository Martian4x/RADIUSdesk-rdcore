Ext.define('Rd.view.dataUsage.vcPnlDataUsage', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcPnlDataUsage',
    config  : {
        span     : 'day',
        urlUsage : '/cake4/rd_cake/data-usages-new/usage-for-realm-new.json',
        usageType: 'realm', // can be client or user i think...
        
        mac      : false,
        username : false
    },
    control: {
        'pnlDataUsage': {
            activate   : 'genChange'
        },
        'pnlDataUsage #reload' : {
            click       : 'genChange'        
        },    
        'pnlDataUsage #duCmbRealm' : {
            change      : 'genChange'        
        },
        'pnlDataUsage cmbTimezones' : {
            change      : 'genChange'
        },
        'pnlDataUsage #dtDate' : {
            change      : 'genChange'
        },
        'pnlDataUsage #toolReload' : {
            click   : 'activeReload'
        },
        'pnlDataUsage grid' : {
            rowclick    : 'rowClickEvent'
        },
        'pnlDataUsage #btnShowRealm' : {
            click       : 'btnShowRealmClick'
        },
    },
    genChange: function(){
        var me = this;
        me.fetchStats();
    }, 
    onClickTodayButton: function(button){
        var me = this;
        me.lookup('btnTimeBack').setTooltip('Go Back 1Day');
        me.lookup('btnTimeForward').setTooltip('Go Forward 1Day');
        me.setSpan('day');
        me.genChange();
    },
    onClickThisWeekButton: function(button){
        var me = this;
        me.lookup('btnTimeBack').setTooltip('Go Back 1Week');
        me.lookup('btnTimeForward').setTooltip('Go Forward 1Week');
        me.setSpan('week');
        me.genChange();
    },
    onClickThisMonthButton: function(button){
        var me = this;
        me.lookup('btnTimeBack').setTooltip('Go Back 1Month');
        me.lookup('btnTimeForward').setTooltip('Go Forward 1Month');
        me.setSpan('month');
        me.genChange();
    },
    onClickRadiusClientsButton: function(button){
    
        var me = this;
        tp = button.up('tabpanel');
        var pnlDataUsage = button.up('pnlDataUsage');
        var tabDataUsageClients  = tp.items.findBy(function (tab){
            return tab.getXType() === 'pnlDataUsageClients';
        });
        
        if (!tabDataUsageClients){
            tabDataUsageClients = tp.insert(1,{ 
                title   : 'RADIUS Clients',  
                xtype   : 'pnlDataUsageClients',   
                glyph   : Rd.config.icnWifi,
                plain	: true,
                closable: true,
                timezone_id: pnlDataUsage.timezone_id, 
                tabConfig: {
                    ui: Rd.config.tabDtaUsageCl
                }
            });
        }     
        tp.setActiveTab(tabDataUsageClients);
    
    },
    onClickTimeBack: function(b){
        var me          = this;
        var picker      = me.lookup('dtDate');
        var step        = -1;
        var unit        = Ext.Date.DAY;
        if(me.getSpan()== 'week'){
            step        = -7;
        }
        if(me.getSpan()== 'month'){
            step        = -1;
            unit        = Ext.Date.MONTH;
        }
        me.lookup('btnTimeForward').setDisabled(false);
        var d_current   = picker.getValue();
        var d_back      = Ext.Date.add(d_current, unit, step);
        picker.setValue(d_back);
        
    },
    onClickTimeForward: function(b){
        var me          = this;
        var picker      = me.lookup('dtDate');
        var step        = 1;
        var unit        = Ext.Date.DAY;
        if(me.getSpan()== 'week'){
            step        = 7;
        }
        if(me.getSpan()== 'month'){
            step        = 1;
            unit        = Ext.Date.MONTH;
        }
        var d_current   = picker.getValue();
        var today       = new Date();
        var d_fwd       = Ext.Date.add(d_current, unit, step);
        if(Ext.Date.format(d_fwd,'timestamp') >= Ext.Date.format(today,'timestamp')){
            me.lookup('btnTimeForward').setDisabled(true);
            d_fwd  = today;
        }
        picker.setValue(d_fwd); 
    },
    fetchStats : function(){  
        var me  = this;    
        me.getView().setLoading(true);
        var day         = me.getView().down('#dtDate').getRawValue();
        var realm_id    =  me.getView().down('#duCmbRealm').getValue();
        var tz_id       = me.getView().down('cmbTimezones').getValue();
        
        if(me.getUsageType() == 'realm'){
            me.setUsername(realm_id);
        }
              
        Ext.Ajax.request({
                url     : me.getUrlUsage(),
                params  : {
                    span        : me.getSpan(),
                    day         : day,
                    timezone_id : tz_id,
                    realm_id    : realm_id,
                    type        : me.getUsageType(),
                    username    : me.getUsername()
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
        
        if(data.query_info.historical){
            me.getView().down('#gridActive').hide();
        }else{
            me.getView().down('#gridActive').show();           
            var store = me.getView().down('#gridActive').getStore();
            store.getProxy().setExtraParams({
                realm_id  : me.getView().down('#duCmbRealm').getValue()
            });           
            store.reload();            
        }
        
        me.getView().down('cartesian').getStore().setData(data.graph.items);
        me.getView().down('#plrTop').getStore().setData(data.top);
        me.getView().down('#gridTop').getStore().setData(data.top);
        me.getView().down('#pnlSummary').setData(data.summary);
        
        if(data.user_detail != undefined){
            me.paintUserDetail(data.user_detail); 
        }else{
            me.hideUserDetail();   
        }
          
    },
    paintUserDetail: function(user_detail){
        var me          = this; 
        me.getView().down('pnlDataUsageUserDetail').paintUserDetail(user_detail);
        me.getView().down('#plrTop').hide();
        me.getView().down('pnlDataUsageUserDetail').show();         
    },
    hideUserDetail: function(){
        var me          = this; 
        me.getView().down('#plrTop').show();
        me.getView().down('pnlDataUsageUserDetail').hide();   
    },
    activeReload : function(){
        var me = this;
        var store = me.getView().down('#gridActive').getStore();
        store.reload();   
    },
    rowClickEvent: function(grid,record){
        var me   = this;
        console.log("Row Click Event");
        if(record.get('type') == 'device'){
            me.setUsageType('device');
            me.setMac(record.get('mac'));
        }else{     
            me.setUsageType('user');
            me.setMac(false); 
        }     
        var username  = record.get('username');        
        me.getView().down('#btnShowRealm').show();
        me.getView().down('cmbRealm').setDisabled(true);
        me.setUsername(username);                 
        me.genChange();   
    },
    btnShowRealmClick: function(btn){
        var me = this;
        if(me.getUsageType()=='device'){ //Back one = user (username us still suppose to be set)
            me.setUsageType('user');
            me.setMac(false);       
        }else{
            me.getView().down('cmbRealm').setDisabled(false);
            btn.hide();
            me.setUsername(me.getView().down('cmbRealm').getValue());
            me.setUsageType('realm');
        }
        me.genChange(); 
    }
});
