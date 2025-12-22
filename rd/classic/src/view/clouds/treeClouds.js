Ext.define('Rd.view.clouds.treeClouds' ,{
    extend      :'Ext.tree.Panel',
    useArrows   : true,
    alias       : 'widget.treeClouds',
    rowLines    : true,
    border      : false,
    rootVisible : true,
    emptyText   : "Please Add Some Clouds",
    rootVisible : true,
    columns: [
        {
            xtype       : 'treecolumn', //this is so we know which column will show the tree
            text        : i18n('sName'),
            tdCls       : 'gridMain',
            flex        : 1,
            sortable    : true,
            dataIndex   : 'text'
        },
        {
            text        : i18n('sComment'),
            flex        : 1,
            dataIndex   : 'comment',
            sortable    : false,
            tdCls       : 'gridTree',
            hidden      : true
        },
        { 
            text        : 'Owner',
            dataIndex   : 'owner',
            tdCls       : 'gridTree',
            xtype       :  'templatecolumn',
            flex        : 1,
            tpl         :    new Ext.XTemplate(
                '<tpl if="Ext.isEmpty(owner)">',
                    '<div></div>',
                '<tpl else>',
                    '{owner}',
                '</tpl>'
            )
        },
        { 
            text    : 'Cloud ID',
            sortable: false,
            tdCls   : 'gridTree',
            xtype   : 'templatecolumn', 
            tpl     : new Ext.XTemplate(
                '{cloud_id}',
            ),
            dataIndex: 'cloud_id',
            flex     : 1
        },
        { 
            text        : 'Created',
            dataIndex   : 'created', 
            tdCls       : 'gridTree',
            hidden      : true,  
            xtype       : 'templatecolumn', 
            tpl         : new Ext.XTemplate(
                '{created_in_words}'
            ),
            flex        : 1
        },  
        { 
            text        : 'Modified',
            dataIndex   : 'modified', 
            tdCls       : 'gridTree',
            hidden      : true, 
            xtype       : 'templatecolumn', 
            tpl         : new Ext.XTemplate(
                '{modified_in_words}'
            ),
            flex        : 1
        }
    ],
    tbar: [  
        {
            xtype : 'buttongroup',
            title : null,
            items : [    
                { xtype: 'button',  glyph: Rd.config.icnReload, scale: 'large', itemId: 'reload',tooltip: i18n('sReload'),
                    ui : 'button-orange'
                },              
                { xtype: 'button',  glyph: Rd.config.icnAdd,    scale: 'large', itemId: 'add',tooltip: i18n('sAdd'),
                    ui : 'button-green'
                },
                { xtype: 'button',  glyph: Rd.config.icnDelete, scale: 'large', itemId: 'delete',tooltip: i18n('sDelete'),
                    ui : 'button-red'
                },
                { xtype: 'button',  glyph: Rd.config.icnEdit,   scale: 'large', itemId: 'edit',tooltip: i18n('sEdit'),
                    ui : 'button-blue'
                },
                { xtype: 'button',  glyph: Rd.config.icnExpand, scale: 'large', itemId: 'expand', tooltip: i18n('sExpand')},
                 { 
                    xtype       : 'button',   
                    toggleGroup : 'radius_network', 
                    enableToggle : true, 
                    scale       : 'large', 
                    itemId      : 'network',
                    pressed     : true,
                    ui          : 'button-metal',
                    glyph       : Rd.config.icnSitemap,
                    tooltip     : 'Network'
                },
                { 
                    xtype       : 'button',   
                    toggleGroup : 'radius_network', 
                    enableToggle : true, 
                    scale       : 'large', 
                    itemId      : 'radius',                   
                    ui          : 'button-metal',
                    glyph       : Rd.config.icnKey,
                    tooltip     : 'Cloud and Realm Rights'
                }        
            ]
        },
        {
            xtype   : 'container',
            html    : '<h1>Network grouping</h1>'       
        }
    ],
    initComponent: function(){
        var me = this;     
        //Create a mask and assign is as a property to the window 
        var store = Ext.create('Ext.data.TreeStore', {
            autoLoad    : false,
            root        : {
                expanded    : true,
                text        : "My Clouds",
                name        : "My Clouds",
                owner       : null
               // iconCls: "x-fa fa-cloud txtGreen"

            },
            proxy       : {
                type    : 'ajax',
                url     : '/cake4/rd_cake/clouds/index.json',
                reader  : {
                    type        : 'json',
                    rootProperty: 'items',
                    successProperty: 'success',
                    totalProperty: 'total'
                },
                api: {
                    read    : '/cake4/rd_cake/clouds/index.json',
                    destroy : '/cake4/rd_cake/clouds/delete.json'
                }
            },         
            rootProperty: 'items'
        });       
        me.store = store;
        this.callParent(arguments);
        
    }
});
