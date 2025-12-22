// SPDX-FileCopyrightText: 2025 Dirk van der Walt <dirkvanderwalt@gmail.com>
//
// SPDX-License-Identifier: GPL-3.0-or-later
Ext.define('Rd.view.aps.pnlApVpnConnections', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.pnlApVpnConnections',
    controller  : 'vcApVpnConnections',
    requires    : [
        'Rd.view.aps.vcApVpnConnections',
        'Rd.view.aps.cntApVpnEntry'
    ],
    margin      : 10,
    layout      : 'fit',
    fieldDefaults: {
        msgTarget       : 'under',
        labelAlign      : 'left',
        labelSeparator  : '',
        labelWidth      : Rd.config.labelWidth,
        margin          : Rd.config.fieldMargin,
        labelClsExtra   : 'lblRdReq'
    },
    buttons     : [
        {
            itemId  : 'save',
            text    : 'SAVE',
            scale   : 'large',
            formBind: true,
            glyph   : Rd.config.icnYes,
            margin  : Rd.config.buttonMargin,
            ui      : 'button-teal'
        }
    ],
    initComponent: function(){    
        var me      = this;
        var pnlVpn  = {
            xtype       : 'panel',
            title       : 'VPN Connections (per AP)',
            itemId      : 'pnlVpn',           
            glyph       : Rd.config.icnShield,
            ui          : 'panel-blue',
            autoScroll	: true,
            items       : [
                {
                    xtype   : 'button',
                    itemId  : 'btnAddVpn',
                    text    : 'New VPN Connection',
                    glyph   : Rd.config.icnAdd
                }           
            ]
        }        
        me.items = pnlVpn; 
        me.callParent(arguments);
    }
});

