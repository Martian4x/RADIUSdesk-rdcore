Ext.define('Rd.view.passpoint.gridPasspoint' ,{
    extend      : 'Ext.grid.Panel',
    alias       : 'widget.gridPasspoint',
    store       : 'sPasspoint',
    stateful    : true,
    multiSelect : true,
    stateId     : 'StateGridPasspoint',
    stateEvents : ['groupclick','columnhide'],
    viewConfig  : {
        preserveScrollOnRefresh: true
    },
    border      : false,
    urlMenu     : '/cake4/rd_cake/passpoint-profiles/menu-for-grid.json',
    plugins     : 'gridfilters',
    requires    : [
        'Rd.view.components.ajaxToolbar',
        'Rd.view.passpoint.pnlPasspointAddEdit',
        'Rd.view.passpoint.vcPasspoint' 
    ],
    listeners       : {
        activate  : 'onViewActivate'
    },
    controller  : 'vcPasspoint',
    initComponent: function(){
        var me      = this;         
         me.bbar    =  [
            {
                 xtype       : 'pagingtoolbar',
                 store       : me.store,
                 dock        : 'bottom',
                 displayInfo : true
            }  
        ];

        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});     
        me.columns  = [
            { text: i18n('sName'),          dataIndex: 'name',    tdCls: 'gridMain', flex: 1, filter: {type: 'string'},stateId: 'StateGridPasspoint1'},
            { 
                text        : 'System Wide',  
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                                "<tpl if='for_system == true'><div class=\"fieldBlue\">"+i18n("sYes")+"</div></tpl>",
                                "<tpl if='for_system == false'><div class=\"fieldGrey\">"+i18n("sNo")+"</div></tpl>"
                            ),
                dataIndex   : 'for_system',
                filter      : {
                        type            : 'boolean',
                        defaultValue    : false,
                        yesText         : 'Yes',
                        noText          : 'No'
                }, stateId: 'StateGridPasspoint2'
            },
            {
                xtype       : 'actioncolumn',
                text        : 'Actions',
                width       : 70,
                stateId     : 'StateGridPasspoint3',
                items       : [				
					 { 
						iconCls : 'txtRed x-fa fa-trash',
						tooltip : 'Delete',
						isDisabled: function (grid, rowIndex, colIndex, items, record) {
                                if (record.get('delete') == true) {
                                     return false;
                                } else {
                                    return true;
                                }
                        },
                        handler: function(view, rowIndex, colIndex, item, e, record, row) {
                            this.fireEvent('itemClick', view, rowIndex, colIndex, item, e, record, row, 'delete');
                        }
                    },
                    {  
                        iconCls : 'txtBlue x-fa fa-pen',
                        tooltip : 'Edit',
                        isDisabled: function (grid, rowIndex, colIndex, items, record) {
                                if (record.get('update') == true) {
                                     return false;
                                } else {
                                    return true;
                                }
                        },
						handler: function(view, rowIndex, colIndex, item, e, record, row) {
                            this.fireEvent('itemClick', view, rowIndex, colIndex, item, e, record, row, 'update');
                        }
					}
				]
            }   
        ];
        me.callParent(arguments);
    }
});
