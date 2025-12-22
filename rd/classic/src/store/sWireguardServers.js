Ext.define('Rd.store.sWireguardServers', {
    extend      : 'Ext.data.Store',
    model       : 'Rd.model.mWireguardServer',
    proxy       : {
        type    : 'ajax',
        format  : 'json',
        batchActions: true, 
        url     : '/cake4/rd_cake/wireguard-servers/index.json',
        reader: {
            type            : 'json',
            rootProperty    : 'items',
            messageProperty : 'message',
            totalProperty   : 'totalCount' //Required for dynamic paging
        },
        simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    },
    autoLoad    : true,
    groupField  : 'name'
});
