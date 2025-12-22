Ext.define('Rd.view.profileComponents.winProfileComponentEntryEdit', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winProfileComponentEntryEdit',
    closable    : true,
    draggable   : true,
    resizable   : true,
    title       : 'Edit Profile Component Entry',
    width       : 550,
    height      : 500,
    plain       : true,
    border      : false,
    layout      : 'fit',
    glyph       : Rd.config.icnEdit,
    autoShow    : false,
    profile_component_id : '',
    profile_component_name : '',
    showTag     : false,
    defaults: {
            border: false
    },
    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Rd.view.components.cmbAttributeTag',
        'Rd.view.profileComponents.vcProfileComponentEntry'
    ],
    controller  : 'vcProfileComponentEntry',
    initComponent: function() {
        var me 		= this; 
        var record  = me.record.clone();
        let attribute = record.get('attribute'); 
        let pattern = /:/;
        
        if(pattern.test(attribute)){
            console.log("Tagged Attribute");          
            var parts = attribute.split(':');
            record.set('attribute',parts[0]);
            record.set('attribute_tag',parts[1])
            me.showTag = true;         
        }
                
        me.setTitle('Edit Profile Component Entry For '+me.profile_component_name);	
		var s = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data : [                            
             	{'id': '=' ,  	'name': '=' },
             	{'id': ':=' ,  	'name': ':=' },
             	{'id': '+=' ,  	'name': '+=' },
             	{'id': '==' ,  	'name': '==' },
             	{'id': '-=' ,  	'name': '-=' },
             	{'id': '<=' ,  	'name': '<=' },
             	{'id': '>=' ,  	'name': '>=' },
             	{'id': '!*' ,  	'name': '!*' },
            ]
        });
        
        
        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            autoScroll: true,
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget       : 'under',
                labelClsExtra   : 'lblRd',
                labelAlign      : 'left',
                labelSeparator  : '',
                labelClsExtra   : 'lblRd',
                labelWidth      : Rd.config.labelWidth,
                margin          : 5,
                padding			: 5
            },
            defaultType: 'textfield',
            buttons : [
                {
                    itemId  :  'save',
                    text    : i18n('sOK'),
                    scale   : 'large',
                    iconCls : 'b-btn_ok',
                    glyph   : Rd.config.icnYes,
                    formBind: true,
                    margin  : Rd.config.buttonMargin
                }
            ],
            items: [
                {
                    xtype   : 'textfield',
                    name    : 'profile_component_id',
                    value   : me.profile_component_id,
                    hidden  : true
                },
                {
                    xtype   : 'textfield',
                    name    : 'id',
                    hidden  : true
                },
                {
                    xtype   : 'textfield',
                    name    : 'groupname',
                    hidden  : true
                },
                {
                    xtype       : 'radiogroup',
                    columns     : 2,
                    vertical    : true,
                    items: [
                        { boxLabel: 'Check',   name: 'type',    inputValue: 'check', boxLabelCls	: 'boxLabelRd' },
                        { boxLabel: 'Reply',   name: 'type',    inputValue: 'reply', boxLabelCls	: 'boxLabelRd' },
                    ]
                },
                {   
                	xtype		: 'cmbVendor',
                	name		: 'vendor',
                	allowBlank  : true, 
                	emptyText	: i18n('sSelect_a_vendor')
               	},
               	{   
               		xtype		: 'cmbAttribute',
               		name		: 'attribute',
               		emptyText	: i18n('sSelect_an_attribute')
               	},
               	{
               	    xtype		: 'cmbAttributeTag',
               	    hidden      : true,
               	    disabled    : true,
               	    name        : 'attribute_tag',
               	    value       : 0
               	},
               	{
               		xtype		: 'combobox',
               		fieldLabel	: 'Operator',
    				store		: s,
					queryMode	: 'local',
					name		: 'op',
					displayField: 'name',
					valueField	: 'id',
					value		: ':='               		
               	},
               	{
                    xtype       : 'textfield',
                    fieldLabel  : 'Value',
                    name        : 'value',
                    allowBlank  : false,
                    blankText   : i18n('sSupply_a_value'),
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Comment',
                    name        : 'comment'
                }
            ]
        });
        
        me.items = frmData;
             
        frmData.loadRecord(record);
        me.callParent(arguments);
    }
});
