Ext.define('Rd.view.wireguard.vcWireguardPeers', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcWireguardPeers',
    init    : function() {
    
    },
    config: {
        urlDelete       : '/cake4/rd_cake/wireguard-peers/delete.json',
        UrlPeerConfig   : '/cake4/rd_cake/wireguard-peers/peer-config.json',
        UrlPeerQrCode   : '/cake4/rd_cake/wireguard-peers/qrcode-config.json'
    },
    control: {
        'gridWireguardPeers #reload': {
            click   : 'reload'
        },
        'gridWireguardPeers #reload menuitem[group=refresh]'   : {
            click   : 'reloadOptionClick'
        },
        'gridWireguardPeers #online': {
            click   : 'reload'
        },  
        'gridWireguardPeers #add': {
            click   : 'add'
        },     
        'gridWireguardPeers #delete': {
            click   : 'del'
        },
        'gridWireguardPeers #edit': {
            click   : 'edit'
        },   
        'gridWireguardPeers #btnConfig': {
            click   : 'peerConfig'
        }, 
        'gridWireguardPeers #btnQrCode': {
            click   : 'qrcode'
        },     
        'gridWireguardPeers actioncolumn': { 
             itemClick  : 'onActionColumnItemClick'
        }
    },
    reload: function(){
        var me      = this;
        var btn     = me.getView().down('#online');
        var only_online  = false;
        if(btn){
            only_online = btn.pressed; //Default only active
            if(btn.pressed){
               btn.setGlyph(Rd.config.icnLightbulb);
               btn.setTooltip('Show ALL peers');
            }else{
               btn.setGlyph(Rd.config.icnTime);
               btn.setTooltip('Show only online peers');
            }
        }      
        me.getView().getStore().getProxy().setExtraParam('only_online', only_online);
        me.getView().getSelectionModel().deselectAll(true);
        me.getView().getStore().load();
    },
    reloadOptionClick: function(menu_item){
        var me      = this;
        var n       = menu_item.getItemId();
        var b       = menu_item.up('button'); 
        var interval= 30000; //default
        clearInterval(me.autoReload);   //Always clear
        b.setGlyph(Rd.config.icnTime);

        if(n == 'mnuRefreshCancel'){
            b.setGlyph(Rd.config.icnReload);
            return;
        }
        
        if(n == 'mnuRefresh1m'){
           interval = 60000
        }

        if(n == 'mnuRefresh5m'){
           interval = 360000
        }
        me.autoReload = setInterval(function(){        
            me.reload();
        },  interval);  
    },
    del:   function(){
        var me      = this;     
        //Find out if there was something selected
        if(me.getView().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    var selected    = me.getView().getSelectionModel().getSelection();
                    var list        = [];
                    Ext.Array.forEach(selected,function(item){
                        var id = item.getId();
                        Ext.Array.push(list,{'id' : id});
                    });

                    Ext.Ajax.request({
                        url: me.getUrlDelete(),
                        method: 'POST',          
                        jsonData: list,
                        success: function(batch,options){console.log('success');
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            me.reload(); //Reload from server
                        },                                    
                        failure: function (response, options) {
                            var jsonData = Ext.JSON.decode(response.responseText);
                            Ext.Msg.show({
                                title       : "Error",
                                msg         : response.request.url + '<br>' + response.status + ' ' + response.statusText+"<br>"+jsonData.message,
                                modal       : true,
                                buttons     : Ext.Msg.OK,
                                icon        : Ext.Msg.ERROR,
                                closeAction : 'destroy'
                            });
                            me.reload(); //Reload from server
                        }
                    });
                }
            });
        }
    },
    
    add: function(btn){
    	var me         = this;
        var tp         = me.getView().up('tabpanel');
        var t_id       = 0;
        var instance_id = me.getView().instance_id
        var t_tab_id   = 'peerTab_'+t_id;
        var nt         = tp.down('#'+t_tab_id);
        if(nt){
            tp.setActiveTab(t_tab_id); //Set focus on  Tab
            return;
        }

        var t_tab_name = 'Add Wireguard Peer';
        //Tab not there - add one
        tp.add({ 
            title   : t_tab_name,
            itemId  : t_tab_id,
            instance_id : instance_id,
            peer_id : t_id,
            mode    : 'add', //Add or Dedit Mode
            closable: true,
            glyph   : Rd.config.icnAdd,
            xtype   : 'pnlWireguardPeerAddEdit'
        });
        tp.setActiveTab(t_tab_id); //Set focus on Add Tab
    },
    edit: function(button){
        var me      = this;   
        //Find out if there was something selected
        var selCount = me.getView().getSelectionModel().getCount();
        if(selCount == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(selCount > 1){
                Ext.ux.Toaster.msg(
                        i18n('sLimit_the_selection'),
                        i18n('sSelection_limited_to_one'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{
                var sr          = me.getView().getSelectionModel().getLastSelected();
                var inst_id     = me.getView().instance_id;
                var tp          = me.getView().up('tabpanel');               
                var t_tab_name  = 'Edit Wireguard Peer';
                var t_id        = sr.get('id');
                var t_tab_id    = 'peerTab_'+t_id;
                //Tab not there - add one
                tp.add({ 
                    title   : t_tab_name,
                    itemId  : t_tab_id,
                    peer_id : t_id,
                    instance_id : inst_id,
                    mode    : 'edit', //Add or edit Mode
                    closable: true,
                    glyph   : Rd.config.icnEdit,
                    xtype   : 'pnlWireguardPeerAddEdit',
                    sr      : sr
                });
                tp.setActiveTab(t_tab_id); //Set focus on Add Tab
            }
        }
    }, 
    
    peerConfig: function(){
        var me      = this;   
        //Find out if there was something selected
        var selCount = me.getView().getSelectionModel().getCount();
        if(selCount == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(selCount > 1){
                Ext.ux.Toaster.msg(
                        i18n('sLimit_the_selection'),
                        i18n('sSelection_limited_to_one'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{
                var sr          = me.getView().getSelectionModel().getLastSelected();
                var inst_id     = me.getView().instance_id;
                var tp          = me.getView().up('tabpanel');               
                var t_id        = sr.get('id');                                         
                var extra_params= Ext.Object.toQueryString(Ext.Ajax.getExtraParams());               
                window.open(me.getUrlPeerConfig()+'?'+extra_params+"&peer_id="+t_id);
                
            }
        }
    },
    
    qrcode: function(){
        var me      = this;   
        //Find out if there was something selected
        var selCount = me.getView().getSelectionModel().getCount();
        if(selCount == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(selCount > 1){
                Ext.ux.Toaster.msg(
                        i18n('sLimit_the_selection'),
                        i18n('sSelection_limited_to_one'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{
            
                var sr          = me.getView().getSelectionModel().getLastSelected();
                var inst_id     = me.getView().instance_id;
                var tp          = me.getView().up('tabpanel');               
                var t_tab_name  = 'Peer config QR code';
                var t_id        = sr.get('id');
                var t_tab_id    = 'qrTab_'+t_id;
                
                //If already there focus and return
                var nt         = tp.down('#'+t_tab_id);
                if(nt){
                    tp.setActiveTab(t_tab_id); //Set focus on  Tab
                    return;
                }
                                
                //Tab not there - add one
                tp.add({ 
                    title   : t_tab_name,
                    itemId  : t_tab_id,
                    peer_id : t_id,
                    instance_id : inst_id,
                    closable: true,
                    glyph   : Rd.config.icnEdit,
                    xtype   : 'pnlWireguardPeerQrcode'
                });
                tp.setActiveTab(t_tab_id); //Set focus on Add Tab
                
                //var extra_params= Ext.Object.toQueryString(Ext.Ajax.getExtraParams());               
                //window.open(me.getUrlPeerQrCode()+'?'+extra_params+"&peer_id="+t_id);               
                
            }
        }
    },   
    onViewActivate: function(pnl){
        var me = this;
        me.reload();   
    },
    onActionColumnItemClick: function(view, rowIndex, colIndex, item, e, record, row, action){
        //console.log("Action Item "+action+" Clicked");
        var me = this;
        var grid = view.up('grid');
        grid.setSelection(record);
        if(action == 'update'){
            me.edit()
        }
        if(action == 'delete'){
            me.del();
        }
        if(action == 'view'){
            me.view();
        }     
    }
});
