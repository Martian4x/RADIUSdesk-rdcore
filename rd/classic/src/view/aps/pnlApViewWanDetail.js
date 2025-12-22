Ext.define('Rd.view.aps.pnlApViewWanDetail', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlApViewWanDetail',
    border  : false,
    autoScroll  : true,
    initComponent: function(){  
        var me      = this; 
        var m       = 5;
        var p       = 5;
        me.padding  = p;
        me.margin   = m; 
           
        const tpl = new Ext.XTemplate(
            '<div class="container">',
            '<h2>Interfaces</h2>',
            '<tpl foreach="interfaces">',
                '<div class="interface sub">',
                    '<h3>{.}{name}</h3>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">Interface</label><label class="lblValue">{$}</label>',
                    '</div>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">Status</label><label class="lblValue">{.}{status}</label>',
                    '</div>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">Enabled</label><label class="lblValue">{.}{[values.enabled ? "Yes" : "No"]}</label>',
                    '</div>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">Running</label><label class="lblValue">{.}{[values.running ? "Yes" : "No"]}</label>',
                    '</div>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">Score</label><label class="lblValue">{.}{score}</label>',
                    '</div>',                  
                    '<div class="lblContainer">',
                        '<label class="lblItem">Age</label><label class="lblValue">{.}{age}</label>',
                    '</div>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">Uptime</label><label class="lblValue">{.}{[Ext.ux.formatDuration(values.uptime)]}</label>',
                    '</div>',
                    '<div class="lblContainer">',
                        '<label class="lblItem">Online Time</label><label class="lblValue">{.}{[Ext.ux.formatDuration(values.online)]}</label>',
                    '</div>',
                    "<tpl if=\"!Ext.isEmpty(values.track_ip)\">", //HEADS-UP you have to use values.<whatever> in the function
                        '<p><b>Track IP:</b></p>',
                        '<ul>',
                        '<tpl for="track_ip">',
                            '<li>{ip} - Status: {status}, Latency: {latency}, Packet Loss: {packetloss}</li>',
                        '</tpl>',
                        '</ul>',
                    '</tpl>',
                '</div>',
            '</tpl>',
            // Connected Section
            '<h2>Connected IPs</h2>',
                '<h3>IPv6</h3>',
                '<ul>',
                    '<tpl for="connected.ipv6">',
                        '<li>{.}</li>',
                    '</tpl>',
                '</ul>',
                '<h3>IPv4</h3>',
                '<ul>',
                    '<tpl for="connected.ipv4">',
                        '<li>{.}</li>',
                    '</tpl>',
                '</ul>',
            // Policies Section
            '<h2>Policies</h2>',
                '<h3>IPv6</h3>',
                '<tpl if="policies.ipv6.rd_fail_over.length == 0">',
                    '<p>No failover policies defined.</p>',
                '</tpl>',
                '<h3>IPv4</h3>',
                '<tpl if="policies.ipv4.rd_fail_over.length &gt; 0">',
                '<ul>',
                    '<tpl for="policies.ipv4.rd_fail_over">',
                        '<li>Interface: {interface}, Percent: {percent}%</li>',
                    '</tpl>',
                '</ul>',
                '<tpl else>',
                    '<p>No failover policies defined.</p>',
                '</tpl>',                      
            '</div>'
        );           
        me.tpl   =  tpl;
        me.data  = {}       
        me.callParent(arguments);
    }
});
