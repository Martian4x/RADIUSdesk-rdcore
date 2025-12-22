Ext.define('Rd.view.components.winChangeAdminState', {
    extend  : 'Ext.window.Window',
    alias   : 'widget.winChangeAdminState',
    title   : 'Change admin state to',
    layout  : 'fit',
    autoShow: false,
    width   : 400,
    height  : 350,
    glyph   : Rd.config.icnGears,
    requires: [
        'Rd.view.components.btnCommon'
    ],
    initComponent: function() {
        var me = this;
        this.items = [
            {
                xtype       : 'form',
                border      : false,
                layout      : 'anchor',
                autoScroll  : true,
                defaults    : {
                    anchor: '100%'
                },
                fieldDefaults: {
                    msgTarget       : 'under',
                    labelClsExtra   : 'lblRd',
                    labelAlign      : 'left',
                    labelSeparator  : '',
                    margin          : 15
                },
                items: [
                    {
                        xtype       : 'radiogroup',
                        columns     : 1,
                        vertical    : true,
                        items: [
                            { boxLabel: 'Active',       name: 'admin_state',    inputValue: 'active',      boxLabelCls	: 'boxLabelRd', checked: true ,  },
                            { boxLabel: 'Suspended',    name: 'admin_state',    inputValue: 'suspended' ,  boxLabelCls	: 'boxLabelRd'},
                            { boxLabel: 'Terminated',   name: 'admin_state',    inputValue: 'terminated',  boxLabelCls	: 'boxLabelRd'},
                        ]
                    }
                ],
                buttons: [{xtype: 'btnCommon'}]
            }
        ];
        this.callParent(arguments);
    }
});
