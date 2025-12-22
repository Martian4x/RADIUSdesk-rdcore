Ext.define('Rd.view.clouds.winCloudRealmEditAdmin', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winCloudRealmEditAdmin',
    closable    : true,
    draggable   : true,
    resizable   : true,
    border      : false,
    layout      : 'fit',
    autoShow    : false,
    width       : 550,
    height      : 520,
    glyph       : Rd.config.icnGears,
    requires: [
        'Rd.view.clouds.tagAccessProviders',
        'Rd.view.clouds.vcCloudRealmEditAdmin'
    ],
    controller  : 'vcCloudRealmEditAdmin',
    initComponent: function() {
        var me      = this;       
        var level   = me.record.get('tree_level');
        var name    = me.record.get('name');
        var cloud_id= me.record.get('cloud_id');
        if(level == 'Realms'){
            name = me.record.get('cloud_name');                       
        }
        me.cloud_id = cloud_id;
        me.title    = 'Components to show on ' +name;          
        var store   = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            proxy: {
                    type            : 'ajax',
                    format          : 'json',
                    batchActions    : true,
                    extraParams     : { 'c_id' : cloud_id},
                    url             : '/cake4/rd_cake/cloud-realms/index-cloud-admin-components.json',
                    reader: {
                        type            : 'json',
                        rootProperty    : 'items',
                        messageProperty : 'message'
                    }
            },
            autoLoad: true
        });
        
               	     
        me.items = [
            {
                xtype           : 'form',  
                scrollable      : true,             
                fieldDefaults   : {
                    msgTarget       : 'under',
                    labelClsExtra   : 'lblRd',
                    labelAlign      : 'left',
                    labelSeparator  : '',
                    margin          : 10,
                    labelWidth		: 190
                },
                defaults    : {
                    anchor          : '100%'
                },
                defaultType : 'textfield',
                items       : [
                     {
                        xtype   : 'hiddenfield',
                        name    : 'id',
                        hidden  : true
                    },
                    {
                        xtype       : 'combobox',
                        fieldLabel  : 'For Admin',
                        itemId      : 'cmbAdmin',
                        store       : store,
                        name        : 'user_id',
                        displayField: 'name',
                        valueField  : 'id',
                        value       : 0
                    },
				    {
                        xtype   : 'checkboxgroup',
                        userCls : 'divGroup',
                        columns: 2,
                        vertical: true,
                        items: [
                            {    
						        fieldLabel  : '<i class=\"fa fa-user\"></i> Permanent Users',
						        name        : 'cmp_permanent_users'
						        
					        },
					        {
						        fieldLabel  : '<span style="font-family:FontAwesome;font-size:18px;">&#xf145</span> Vouchers',
						        name        : 'cmp_vouchers'
					        }
                        ]
                    },
				    {
                        xtype: 'checkboxgroup',
                        cls     : 'divGroup',
                        columns : 2,
                        vertical: false,
                        items   : [
                            { 
                                fieldLabel  : '<i class=\"fa fa-circle-o-notch\"></i> RADIUS Clients',
                                name        : 'cmp_dynamic_clients'
                            },
                            { 
                                fieldLabel  : '<i class=\"fa fa-cube\"></i> NAS',
                                name        : 'cmp_nas'
                            },
                            { 
                                fieldLabel  : '<i class=\"fa fa-cubes\"></i> Profiles',
                                name        : 'cmp_profiles'
                            },
                            { 
                                fieldLabel  : '<i class=\"fa fa-leaf\"></i> Realms',
                                name        : 'cmp_realms'
                            },
                        ]
                    },
                    {
                        xtype   : 'checkboxgroup',
                        userCls : 'divGroup',
                        columns: 2,
                        vertical: true,
                        items: [
                            {    
						        fieldLabel  : '<span style="font-family:FontAwesome;font-size:18px;">&#xf20e</span> Mesh Networks',
						        name        : 'cmp_meshes'
					        },
					        {
						        fieldLabel  : '<i class=\"fa fa-cubes\"></i>  AP Profiles',
						        name        : 'cmp_ap_profiles'
					        }
                        ]
                    },
                     {
                        xtype   : 'checkboxgroup',
                        userCls : 'divGroup',
                        columns: 2,
                        vertical: true,
                        items: [
                            {    
						        fieldLabel  : '<i class=\"fa fa-gears\"></i> Other',
						        name        : 'cmp_other'
					        }
                        ]
                    },
                   ],
                buttons: [
                    {
                        itemId  : 'save',
                        text    : i18n('sSave'),
                        scale   : 'large',
                        glyph   : Rd.config.icnNext,
                        margin  : '0 20 40 0'
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});
