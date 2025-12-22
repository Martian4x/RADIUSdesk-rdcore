Ext.define('Rd.view.aps.vcApViewVpn', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcApViewVpn',
    init    : function() {
    	var me = this;   
    	var dd = Rd.getApplication().getDashboardData();
    	//Set root to use later in the app in order to set 'for_system' (root)
        me.root    = false;
        if(dd.isRootUser){
            me.root = true;   
        }  
    },
    config: {
        span            : 'hour', //hour, day, week
        selectedId      : null,
    }, 
    control: {
        'pnlApViewVpn' : {
            activate : 'onActivate'
        },
    	'pnlApViewVpn #reload': {
            click   : 'reload'
        },
        'pnlApViewVpn #hour':{
            click: 'onClickHourButton'
        },
        'pnlApViewVpn #day':{
            click: 'onClickDayButton'
        },
        'pnlApViewVpn #week':{
            click: 'onClickWeekButton'
        },
        'pnlApViewVpn #dvApViewVpn' : {
        //	itemclick	: 'itemSelected',
        	select	    : 'itemSelected'
        }       
    },
    itemSelected: function(dv,record){
    	var me = this;
    	console.log("Item Selected");
    	me.setSelectedId(record.get('id'));
    	me.updateGraph(record);	
    },
    onActivate: function(){
        var me = this;
        me.reload();
    },
    reload: function(){
        var me = this;
        var dd      = Ext.getApplication().getDashboardData();
        var tz_id   = dd.user.timezone_id; 
        var store   = me.getView().down('#dvApViewVpn').getStore();
        store.getProxy().setExtraParams({ap_id: me.getView().apId, span : me.getSpan(), timezone_id:tz_id });
        store.reload({
            callback: function(records, operation, success) {
                if (success) {
                    console.log('Store reloaded successfully');
                    // Your callback code here
                    if(me.getSelectedId()){
                        console.log("Select EXISTING record "+me.getSelectedId());
                        var record = store.findRecord('id', me.getSelectedId());
                        me.updateGraph(record);
                       // me.getView().down('#dvApViewVpn').getSelectionModel().select(record);
                    }else{
                        console.log("Select FIRST record "+me.getSelectedId());
                        me.getView().down('#dvApViewVpn').getSelectionModel().select(0);
                    }                   
                } else {
                    console.log('Store reload failed');
                    // Error handling code here
                }
            }
        });

    },
    onClickHourButton: function(button){
        var me = this;
        me.setSpan('hour');
        me.reload();
    },
    onClickDayButton: function(button){
        var me = this;
        me.setSpan('day');
        me.reload();
    },
    onClickWeekButton: function(button){
        var me = this;
        me.setSpan('week');
        me.reload();
    },
    updateGraph: function(record){
        var me = this;
        console.log("Update Graph")
        var totals  = record.get('totals');
        var graph   = record.get('graph_items');
        var s       = record.get('sessions');
        me.getView().down('#plrPackets').getStore().setData([
                { category: 'Tx '+Ext.ux.bytesToHuman(totals.tx_bytes),  count: totals.rx_bytes },
                { category: 'Rx '+Ext.ux.bytesToHuman(totals.rx_bytes),  count: totals.tx_bytes }
        ]);
        if(graph){
           me.getView().down('#crtPackets').getStore().setData(graph);        
        }
        if(s){
            me.getView().down('#gridSessions').getStore().setData(s);    
        }
    }   
});
