Ext.define('Rd.view.components.btnUsersBack', {
    extend      : 'Ext.button.Button',
    xtype       : 'btnUsersBack',
    glyph       : Rd.config.icnBack,  
    text        : 'Back',
    ui          : 'button-pink',
    handler     : function(){
        Ext.getApplication().runAction('cMainUsers','BackButton');
    }
});
