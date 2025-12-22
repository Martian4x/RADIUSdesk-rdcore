Ext.define('Rd.view.iperfTests.vcIperfTests', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcIperfTests',
    config: {
        span        : 'hour',
        urlIndex    : '/cake4/rd_cake/bandwidth-reports/index.json',
        urlDefaults : '/cake4/rd_cake/iperf-tests/iperf-defaults.json',
        urlBusy     : '/cake4/rd_cake/iperf-tests/busy-check.json',
        urlStartTest: '/cake4/rd_cake/iperf-tests/start-test.json', 
        urlDelete   : '/cake4/rd_cake/iperf-tests/delete.json',     
        maxRetries  : 100,
        retryCount  : 0,
        retryTask   : undefined,
        failTask    : undefined
    },

    // local property to hold the active Ajax request reference
    busyRequest: null,

    control: {
        'pnlIperfTests': {
            activate   : 'pnlActive'
        },
        'pnlIperfTests #btnStart' : {
            click   : 'btnClickTest'
        },
        'pnlIperfTests #toolDelete' : {
            click   : 'toolDelete'
        },
        'pnlIperfTests #toolRefresh' : {
            click   : 'toolRefresh'
        }
    },
    reload      : function(){
        var me = this;
        me.getView().down('gridIperfTests').getStore().reload();
    },
    toolRefresh: function(tool){
        var me = this;
        me.reload();
    },
    toolDelete:   function(){
        var me      = this;     
        //Find out if there was something selected
        if(me.getView().down('gridIperfTests').getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    var selected    = me.getView().down('gridIperfTests').getSelectionModel().getSelection();
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

    // helper to cancel a deferred task id (works with Ext.Function.cancel or clearTimeout)
    cancelTask: function(taskId){
        if(!taskId) return;
        if (Ext.Function && Ext.Function.cancel) {
            try {
                Ext.Function.cancel(taskId);
            } catch (e) {
                // fallback
                clearTimeout(taskId);
            }
        } else {
            clearTimeout(taskId);
        }
    },

    pnlActive  : function(pnl){
        var me = this;

        // reset counter
        me.setRetryCount(0);

        // cancel any pending timers (both paths)
        me.cancelTask(me.retryTask);
        me.cancelTask(me.failTask);
        me.setRetryTask(undefined);
        me.setFailTask(undefined);

        // abort any outstanding Ajax request so its callback won't re-arm retries
        if (me.busyRequest && me.busyRequest.abort) {
            try {
                me.busyRequest.abort();
            } catch (e) {
                // ignore
            }
            me.busyRequest = null;
        }

        var form = me.getView().down('#frmSettings');
        form.setLoading(true);
        form.load({
            url     : me.getUrlDefaults(),
            method  :'GET',
            success : function(f, action) {
                form.setLoading(false);
                me.checkForBusy();
            },
            failure: function() {
                form.setLoading(false);
                // optionally still call checkForBusy() or show an error
            }
        });
    },

    btnClickTest : function(btn){
        var me = this;
        var form = me.getView().down('#frmSettings');
        form.setLoading(true);
        form.submit({
            clientValidation    : true,
            url     : me.getUrlStartTest(),
            params  : {
                dev_id  : me.getView().dev_id,
                dev_mode: me.getView().dev_mode
            },
            success : function(f, action) {
                form.setLoading(false);
                me.checkForBusy();
            },
            failure : Ext.ux.formFail
        });
    },

    checkForBusy : function(){
        var me = this;

        if (me.getRetryCount() >= me.getMaxRetries()) {
            console.log("Maximum retries reached");
            return;
        }

        // If there's an outstanding request, abort it before making a new one
        if (me.busyRequest && me.busyRequest.abort) {
            try { me.busyRequest.abort(); } catch (e) {}
            me.busyRequest = null;
        }

        // Make the request and keep its reference
        me.busyRequest = Ext.Ajax.request({
            url: me.getUrlBusy(),
            params: {
                dev_id: me.getView().dev_id,
                dev_mode: me.getView().dev_mode
            },
            method: 'GET',
            success: function(response) {
                // clear stored request ref since it's completed
                me.busyRequest = null;

                var jsonData = Ext.JSON.decode(response.responseText);
                if (jsonData.success) {
                    me.getView().down('#btnStart').enable();
                    me.getView().down('#pnlStatus').hide();
                    me.reload();
                } else {
                    me.getView().down('#btnStart').disable();
                    me.getView().down('#pnlStatus').show();
                    var s = jsonData.data.status;
                    me.getView().down('#pnlStatus').setData({counter:me.getRetryCount(), status : s});

                    // cancel previous retryTask if any (defensive)
                    me.cancelTask(me.retryTask);

                    // schedule next retry and store it (use setter if you like)
                    var id = Ext.defer(function() {
                        me.setRetryCount(me.getRetryCount()+1);
                        me.checkForBusy();
                    }, 4000, me);

                    me.retryTask = id;
                    // or me.setRetryTask(id);
                }
            },
            failure: function() {
                // clear stored request ref
                me.busyRequest = null;

                console.log("Could not get info on AP with ID "+me.getView().dev_id);

                // cancel previous failTask if any (defensive)
                me.cancelTask(me.failTask);

                var id = Ext.defer(function() {
                    me.setRetryCount(me.getRetryCount()+1);
                    me.checkForBusy();
                }, 6000, me);

                me.failTask = id;
                // or me.setFailTask(id);
            }
        });

    }
});

