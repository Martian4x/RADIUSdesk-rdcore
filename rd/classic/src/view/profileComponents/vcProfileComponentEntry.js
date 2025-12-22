Ext.define('Rd.view.profileComponents.vcProfileComponentEntry', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcProfileComponentEntry',
    control: {
    	'cmbVendor': {
            change	: 'cmbVendorChange'
        },
        'cmbAttribute': {
            change	: 'cmbAttributeChange'
        }
    },
    init    : function() {
    
    },
    cmbVendorChange: function(cmb){
        var me 		= this;
        var value   = cmb.getValue();
        var attr    = me.getView().down('cmbAttribute');
        attr.getStore().getProxy().setExtraParam('vendor',value);
        attr.getStore().load();   
    },
    cmbAttributeChange: function(cmb){
        var me 		= this;
        var record  = cmb.getSelection();
        var tag     = me.getView().down('cmbAttributeTag');
        if(record.get('has_tag')== undefined){    //This is for edit ... when edit load the record this value is undefined    
            if(me.getView().showTag){
                tag.show();
                tag.enable();            
            }        
        }else{
                
            if(record.get('has_tag')){
                tag.show();
                tag.enable();
            }else{
                tag.hide();
                tag.disable();
            }
            
        }  
    }  
    
});
