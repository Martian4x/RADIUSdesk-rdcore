Ext.define('Rd.view.clouds.winCloudEdit', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winCloudEdit',
    closable    : true,
    draggable   : true,
    resizable   : true,
    border      : false,
    layout      : 'fit',
    autoShow    : false,
    width       : 450,
    height      : 350,
    glyph       : Rd.config.icnEdit,
    requires: [
        'Rd.view.clouds.tagAccessProviders'
    ],
    initComponent: function() {
        var me = this;
        this.items = [
            {
                xtype   : 'form',
                fieldDefaults   : {
                    msgTarget       : 'under',
                    labelClsExtra   : 'lblRd',
                    labelAlign      : 'left',
                    labelSeparator  : '',
                    labelClsExtra   : 'lblRd',
                    margin          : 15,
                    labelWidth		: 130
                },
                defaults    : {
                    anchor          : '100%'
                },
                defaultType: 'textfield',
                items: [
                     {
                        xtype:  'hiddenfield',
                        name:   'parent_id',
                        hidden: true
                    },
                    {
                        xtype       :  'hiddenfield',
                        name        :   'id',
                        hidden      : true
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : 'Name',
                        name        : 'name',
                        allowBlank  :false,
                        blankText   : i18n('sEnter_a_value'),
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'textfield',
                        grow        : true,
                        name        : 'lat',
                        fieldLabel  : 'Lat'
                    },
                    {
                        xtype       : 'textfield',
                        grow        : true,
                        name        : 'lng',
                        fieldLabel  : 'Lng'
                    }
                   ],
                buttons: [
                    {
                        itemId: 'save',
                        text    : i18n('sSave'),
                        scale: 'large',
                        iconCls: 'b-next',
                        glyph: Rd.config.icnNext,
                        margin: '0 20 40 0'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});
