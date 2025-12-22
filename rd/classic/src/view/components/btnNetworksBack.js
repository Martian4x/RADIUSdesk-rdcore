Ext.define('Rd.view.components.btnNetworksBack', {
    extend      : 'Ext.button.Button',
    xtype       : 'btnNetworksBack',
    glyph       : Rd.config.icnBack,  
    text        : 'Back',
    ui          : 'button-pink',
    handler     : function(){
        Ext.getApplication().runAction('cMainNetworks','BackButton');
    }
});
