Ext.define('Rd.view.clouds.vcCloudRealmEditAdmin', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcCloudRealmEditAdmin',
    config: {
        urlView  : '/cake4/rd_cake/cloud-realms/view-cloud-admin-components.json',
        urlSave  : '/cake4/rd_cake/cloud-realms/edit-cloud-admin-components.json'
    }, 
    control: {
        '#save': {
            click   : 'btnSave'
        },
        '#cmbAdmin' : {
            change  : 'cmbAdminChange'
        }
    },
    btnSave:function(button){
        var me      = this;
        var form    = me.getView().down('form');   
        form.submit({
            clientValidation    : true,
            url                 : me.getUrlSave(),
            success             : function(form, action) {
                me.getView().store.reload();                           
                Ext.ux.Toaster.msg(
                    i18n('sItems_modified'),
                    i18n('sItems_modified_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
                me.getView().close();
            },
            failure             : Ext.ux.formFail
        });
    },
    cmbAdminChange: function(cmb){
        var me = this;
        var value = cmb.getValue();
        console.log('The value is now '+value);
        me.loadForm(value);
    },
    loadForm    : function(user_id){
        var me      = this;     
        var form    = me.getView().down('form');
        var c_id    = me.getView().cloud_id; 
        form.setLoading();                   
        form.load({
            url         : me.getUrlView(), 
            method      : 'GET',
            params      : { user_id: user_id, c_id: c_id },
            success : function(a,b){
                const data = b.result.data;
                // Clear the checkboxes in the response data
                for (const key in data) {
                    if (key.startsWith('option')) {
                        data[key] = false; // Uncheck the checkbox
                    }
                }
                // Load the processed data into the form
                form.getForm().setValues(data);           
   		        form.setLoading(false);
            }
        });            
    },  
});
