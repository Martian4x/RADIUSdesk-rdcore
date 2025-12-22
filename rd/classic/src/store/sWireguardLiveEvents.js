// app/store/sWireguardLiveEvents.js
Ext.define('Rd.store.sWireguardLiveEvents', {
    extend   : 'Ext.data.Store',
    alias    : 'store.sWireguardLiveEvents',
    model    : 'Rd.model.mWireguardLiveEvent',
    autoLoad : true,
    sorters  : [{ property: 'ts', direction: 'DESC' }],
    data     : [] // live entries will be pushed via controller
});

