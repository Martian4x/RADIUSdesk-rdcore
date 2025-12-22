Ext.define('Rd.view.components.btnRadiusBack', {
    extend      : 'Ext.button.Button',
    xtype       : 'btnRadiusBack',
    glyph       : Rd.config.icnBack,  
    text        : 'Back',
    ui          : 'button-pink',
    handler     : function(){
        Ext.getApplication().runAction('cMainRadius','BackButton');
    }
});
