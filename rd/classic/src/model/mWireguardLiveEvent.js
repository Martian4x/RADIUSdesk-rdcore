// app/model/mWireguardLiveEvent.js
Ext.define('Rd.model.mWireguardLiveEvent', {
    extend  : 'Ext.data.Model',
    fields  : [
        {name:'id',          type:'string'},
        {name:'server_id',   type:'int'},
        {name:'ts',          type:'date'},          // Date instance (important for your renderer)
        {name:'event',       type:'string'},        // connected | disconnected | appeared | updated
        {name:'iface',       type:'string'},        // wg0, wg1, ...
        {name:'public_key',  type:'string'},
        {name:'endpoint',    type:'string'}         // ip:port
    ],
    idProperty : 'id'
});

