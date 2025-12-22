Ext.define('Rd.view.wireguard.pnlWireguard', {
    extend	: 'Ext.tab.Panel',
    alias	: 'widget.pnlWireguard',
    border	: false,
    plain	: true,
    cls     : 'subSubTab',
    padding : 0,
    margin  : 0,
    tabBar: {
        items: [
            { 
                xtype   : 'btnOtherBack'
            }              
       ]
    },
    requires: [
        'Rd.view.wireguard.gridWireguardServers',
    //    'Rd.view.accel.gridAccelClients',
        'Rd.view.wireguard.gridWireguardArrivals'
    ],
    initComponent: function(){
        var me      = this;
        me.items = [
        {   
            title   : 'Servers',
            xtype   : 'gridWireguardServers'
        },
       /* { 
            title   : 'Profiles',
            xtype   : 'gridAccelProfiles'
        },*/
        { 
            title   : 'New Arrivals',
            xtype   : 'gridWireguardArrivals'
        }         
    ]; 
        me.callParent(arguments);
    }
});
