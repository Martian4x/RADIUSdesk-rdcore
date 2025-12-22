Ext.define('Rd.view.wireguard.vcWireguardInstanceAddEdit', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcWireguardInstanceAddEdit',
    init    : function() {
    
    },
    config: {
        urlAdd          : '/cake4/rd_cake/wireguard-instances/add.json',
        urlEdit         : '/cake4/rd_cake/wireguard-instances/edit.json',
        urlView         : '/cake4/rd_cake/wireguard-instances/view.json'
    },
    control: {
        'pnlWireguardInstanceAddEdit': {  
            activate        : 'pnlActive'
        },
        'pnlWireguardInstanceAddEdit #chkNextPort' : {
            change      : 'onChkNextPortChange'
        },
        'pnlWireguardInstanceAddEdit #chkGenKeys' : {
            change      : 'onChkGenKeysChange'
        },
        'pnlWireguardInstanceAddEdit #chkNatEnabled' : {
            change      : 'onChkNatEnabledChange'
        },
        'pnlWireguardInstanceAddEdit #chkSqmEnabled' : {
            change      : 'onChkSqmEnabledChange'
        },
        'pnlWireguardInstanceAddEdit #chkIpv4' : {
            change      : 'onChkIpv4Change'
        },
        'pnlWireguardInstanceAddEdit #chkIpv6' : {
            change      : 'onChkIpv6Change'
        },
       'pnlWireguardInstanceAddEdit #save': {
            click   : 'btnSave'
        },
    },
    pnlActive   : function(form){
        var me          = this; 
        var instance_id  = me.getView().wireguard_instance_id;
        var server_id    = me.getView().wireguard_server_id;
        if(instance_id == 0){
            return; //no need to load view for new ones
        }
        form.load({
            url         : me.getUrlView(), 
            method      : 'GET',
            params      : { wireguard_server_id : server_id, id : instance_id},
            success     : function(a,b,c){  
                    
            }
        });          
    },
    onChkNextPortChange : function(chk){
        var me = this;
        var nrPort = me.getView().down('#nrPort');
        if(chk.getValue()){
            nrPort.hide();
            nrPort.disable();
        }else{
            nrPort.show();
            nrPort.enable();
        }  
    },
    onChkGenKeysChange : function(chk){
        var me = this;
        var txtPrivateKey   = me.getView().down('#txtPrivateKey');
        var txtPublicKey    = me.getView().down('#txtPublicKey');
        var txtPresharedKey = me.getView().down('#txtPresharedKey');
        var chkPreshared    = me.getView().down('#chkIncludePresharedKey');
        
        if(chk.getValue()){
        
            txtPrivateKey.hide();
            txtPublicKey.hide();
            txtPresharedKey.hide();
            
            txtPrivateKey.disable();
            txtPublicKey.disable();
            txtPresharedKey.disable();
            
            chkPreshared.show();
            chkPreshared.enable();
            
        }else{
        
            txtPublicKey.show();
            txtPublicKey.enable();
            txtPrivateKey.show();
            txtPrivateKey.enable();
            txtPresharedKey.show();
            txtPresharedKey.enable();
            
            chkPreshared.hide();
            chkPreshared.disable();
            
        }     
    },
    onChkNatEnabledChange : function(chk){
        var me = this;
        var chkSqm    = me.getView().down('#chkSqmEnabled');
        var sldrUp    = me.getView().down('#sldrUpload');
        var sldrDown  = me.getView().down('#sldrDownload');
        
        if(chk.getValue()){
            chkSqm.enable();
            if(chkSqm.getValue()){
                sldrUp.enable(); 
                sldrDown.enable(); 
            }else{
                sldrUp.disable(); 
                sldrDown.disable();            
            }          
        }else{
            sldrUp.disable(); 
            sldrDown.disable(); 
            chkSqm.disable();            
        }     
    },
    onChkSqmEnabledChange : function(chk){
        var me = this;
        var sldrUp    = me.getView().down('#sldrUpload');
        var sldrDown  = me.getView().down('#sldrDownload');
        
        if(chk.getValue()){
            sldrUp.enable(); 
            sldrDown.enable();     
        }else{
            sldrUp.disable(); 
            sldrDown.disable();             
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
        if(me.getView().wireguard_instance_id == 0){
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
