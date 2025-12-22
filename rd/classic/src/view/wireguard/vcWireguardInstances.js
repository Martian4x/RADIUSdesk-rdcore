Ext.define('Rd.view.wireguard.vcWireguardInstances', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcWireguardInstances',
    init    : function() {
    
    },
    config: {
        urlDelete   : '/cake4/rd_cake/wireguard-instances/delete.json',
        urlRestart  : '/cake4/rd_cake/wireguard-instances/restart.json'
    },
    control: {
        'gridWireguardInstances #reload': {
            click   : 'reload'
        },
        'gridWireguardInstances #reload menuitem[group=refresh]'   : {
            click   : 'reloadOptionClick'
        },
        'gridWireguardInstances #online': {
            click   : 'reload'
        },  
        'gridWireguardInstances #add': {
            click   : 'add'
        },     
        'gridWireguardInstances #delete': {
            click   : 'del'
        },
        'gridWireguardInstances #edit': {
            click   : 'edit'
        }, 
        'gridWireguardInstances #btnPeers': {
            click   : 'peers'
        },   
        'gridWireguardInstances #restart': {
            click   : 'restart'
        },
        'gridWireguardInstances actioncolumn': { 
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
               btn.setTooltip('Show ALL instances');
            }else{
               btn.setGlyph(Rd.config.icnTime);
               btn.setTooltip('Show only online instances');
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
        var server_id  = me.getView().wireguard_server_id
        var t_id       = 0;
        var instance_id = 0;
        var t_tab_id   = 'instanceTab_'+t_id;
        var nt         = tp.down('#'+t_tab_id);
        if(nt){
            tp.setActiveTab(t_tab_id); //Set focus on  Tab
            return;
        }

        var t_tab_name = 'Add Wireguard Instance';
        //Tab not there - add one
        tp.add({ 
            title   : t_tab_name,
            itemId  : t_tab_id,
            wireguard_server_id : server_id,
            wireguard_instance_id : instance_id,
            mode    : 'add', //Add or Dedit Mode
            closable: true,
            glyph   : Rd.config.icnAdd,
            xtype   : 'pnlWireguardInstanceAddEdit'
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
                var server_id   = me.getView().wireguard_server_id
                var tp          = me.getView().up('tabpanel');               
                var t_tab_name  = 'Edit Wireguard Instance';
                var t_id        = sr.get('id');
                var t_tab_id    = 'instanceTab_'+t_id;
                //Tab not there - add one
                tp.add({ 
                    title   : t_tab_name,
                    itemId  : t_tab_id,
                    wireguard_server_id : server_id,
                    wireguard_instance_id : t_id,
                    mode    : 'edit', //Add or edit Mode
                    closable: true,
                    glyph   : Rd.config.icnEdit,
                    xtype   : 'pnlWireguardInstanceAddEdit',
                    sr      : sr
                });
                tp.setActiveTab(t_tab_id); //Set focus on Add Tab
            }
        }
    }, 
    peers : function(){
        // console.log("Edit node");  
        var me = this;
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getView().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
        
            var selected    =  me.getView().getSelectionModel().getSelection();
            var count       = selected.length;         
            Ext.each(me.getView().getSelectionModel().getSelection(), function(sr,index){
            
                //Check if the node is not already open; else open the node:
                var tp         = me.getView().up('tabpanel');
                var t_id       = sr.getId();
                var t_tab_id   = 'wgPeerTab_'+t_id;
                var nt         = tp.down('#'+t_tab_id);
                if(nt){
                    tp.setActiveTab(t_tab_id); //Set focus on  Tab
                    return;
                }

                var t_tab_name = sr.get('name');
                //Tab not there - add one
                tp.add({ 
                    title   : 'Peers for '+t_tab_name,
                    itemId  : t_tab_id,
                    closable: true,
                    glyph   : Rd.config.icnExchange,
                    layout  : 'fit',
                    instance_id  : t_id,
                    xtype   : 'gridWireguardPeers'
                });
                tp.setActiveTab(t_tab_id); //Set focus on Add Tab
            });
        }   
    },
    restart : function(){
         // console.log("Edit node");  
        var me = this;
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getView().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
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
                        url     : me.getUrlRestart(),
                        method  : 'POST',          
                        jsonData: list,
                        success : function(batch,options){console.log('success');
                            Ext.ux.Toaster.msg(
                                'Restart Initiated',
                                'Restart Initiated',
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
        
        if(action == 'restart'){
            me.restart();
        }     
    }
});
