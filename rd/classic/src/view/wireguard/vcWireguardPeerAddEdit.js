Ext.define('Rd.view.wireguard.vcWireguardPeerAddEdit', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcWireguardPeerAddEdit',
    init    : function() {
    
    },
    config: {
        urlAdd          : '/cake4/rd_cake/wireguard-peers/add.json',
        urlEdit         : '/cake4/rd_cake/wireguard-peers/edit.json',
        urlView         : '/cake4/rd_cake/wireguard-peers/view.json'
    },
    control: {
        'pnlWireguardPeerAddEdit': {  
            activate        : 'pnlActive'
        },
        'pnlWireguardPeerAddEdit #chkGenKeys' : {
            change      : 'onChkGenKeysChange'
        },
        'pnlWireguardPeerAddEdit #chkIpv4' : {
            change      : 'onChkIpv4Change'
        },
        'pnlWireguardPeerAddEdit #chkIpv6' : {
            change      : 'onChkIpv6Change'
        },
       'pnlWireguardPeerAddEdit #save': {
            click   : 'btnSave'
        },
    },
    pnlActive   : function(form){
        var me          = this; 
        var instance_id = me.getView().instance_id;
        var peer_id     = me.getView().peer_id;
        if(peer_id == 0){
            return; //no need to load view for new ones
        }
        form.load({
            url         : me.getUrlView(), 
            method      : 'GET',
            params      : { peer_id : peer_id, id : instance_id},
            success     : function(a,b,c){  
                    
            }
        });          
    },
    onChkGenKeysChange : function(chk){
        var me = this;
        var txtPrivateKey   = me.getView().down('#txtPrivateKey');
        var txtPublicKey    = me.getView().down('#txtPublicKey');
        
        if(chk.getValue()){
        
            txtPrivateKey.hide();
            txtPublicKey.hide();         
            txtPrivateKey.disable();
            txtPublicKey.disable();
            
        }else{
        
            txtPublicKey.show();
            txtPublicKey.enable();
            txtPrivateKey.show();
            txtPrivateKey.enable();           
        }     
    },
    onChkIpv4Change : function(chk){
        var me = this;
        var chkIpv4NextSubnet    = me.getView().down('#chkIpv4NextSubnet');     
        if(chk.getValue()){
            chkIpv4NextSubnet.enable(); 
    
        }else{
            chkIpv4NextSubnet.disable();          
        }    
    },
    onChkIpv6Change : function(chk){
        var me = this;
        var chkIpv6NextSubnet    = me.getView().down('#chkIpv6NextSubnet');     
        if(chk.getValue()){
            chkIpv6NextSubnet.enable(); 
    
        }else{
            chkIpv6NextSubnet.disable();          
        }    
    },
    btnSave:function(button){
        var me          = this;
        var formPanel   = this.getView();   
        var url         = me.getUrlEdit();
        if(me.getView().peer_id == 0){
            url = me.getUrlAdd();   
        }
        var multi = me.getView().down('#chkMultiple').getValue();           
        //Checks passed fine...      
        formPanel.submit({
            clientValidation    : true,
            url                 : url,
            submitEmptyText     : false, // Set this in the form config
            success             : function(form, action) {          
                if (!multi) {
                    formPanel.close();
                }
                Ext.ux.Toaster.msg(
                    i18n('sItems_modified'),
                    i18n('sItems_modified_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure             : Ext.ux.formFail
        });
    }
});
