// SPDX-FileCopyrightText: 2025 Dirk van der Walt <dirkvanderwalt@gmail.com>
//
// SPDX-License-Identifier: GPL-3.0-or-later
Ext.define('Rd.view.aps.vcApVpnConnections', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcApVpnConnections',   
    config	: {
        urlView    : '/cake4/rd_cake/vpn-connections/ap-index.json',
        urlSave    : '/cake4/rd_cake/vpn-connections/ap-save.json',
        addCount        : 0
    },
    control: {
      	'pnlApVpnConnections'  : {
      	    activate  : 'onViewActivate'
      	},
      	'pnlApVpnConnections #save' : {
            click   : 'save'
        },
      	'#pnlVpn #btnAddVpn' : {
            click : 'btnAddVpnClick',
        }
    },        
    onViewActivate: function(pnl){
        var me      = this;
        var ap_id = me.getView().ap_id;
        Ext.Ajax.request({
            url     : me.getUrlView(),
            params  : {
                ap_id : ap_id   
            },
            method  : 'GET',
            success : function(response){
                var jsonData = Ext.JSON.decode(response.responseText);                
                if(jsonData.success){    
                    me.paintScreen(jsonData.data);                
                }else{
                                 
                }
            }
        });
    },
    paintScreen : function(data){
        const me = this;
        me.clearVpnItems();
        me.addVpnItems(data.connections);
    },
    clearVpnItems  : function(){
	    var me      = this;
	    var pnlVpn  = me.getView().down('#pnlVpn');
	    Ext.each(pnlVpn.query('cntApVpnEntry'), function(entry){
            pnlVpn.remove(entry, true);
        });   
	},
	addVpnItems  : function(vpnItems){
	    var me      = this;
	    me.clearVpnItems();
	    var pnlVpn  = me.getView().down('#pnlVpn');   	
	   	Ext.Array.forEach(vpnItems,function(vpn){  	   	   
	        var item    = {
	            xtype   : 'cntApVpnEntry',
	            vpn_id  : vpn.id,
	            info    : vpn 
	        };
	        pnlVpn.insert(0, item);  // <— insert at index 0 (top)
	    });	
	},
	btnAddVpnClick  : function(){
	    var me      = this;
	    var pnlVpn  = me.getView().down('#pnlVpn');
	    me.setAddCount(me.getAddCount()+1);
	    var item    = {
	        xtype   : 'cntApVpnEntry',
	        vpn_id  : '0'+me.getAddCount(), //Add items starts with '0' (Zero)
	        info    : {
	            vpn_type : 'wg',
	            ap_id    : me.getView().ap_id
	        }
	    };	        	    
	    pnlVpn.insert(0, item);  // <— insert at index 0 (top)	    
	},
	save    : function(button){
	    var me = this;
	    me.getView().submit({
            clientValidation: true,
            params: {
                ap_id: me.getView().ap_id
            },
            url : me.getUrlSave(),
            success: function(form, action) {
                me.onViewActivate();
                Ext.ux.Toaster.msg(
                    'Items stored',
                    'Items stored fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });	
	}        
});
