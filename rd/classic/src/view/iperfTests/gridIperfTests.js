Ext.define('Rd.view.iperfTests.gridIperfTests' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridIperfTests',
    multiSelect : true,
    requires: [
        'Ext.data.Store',
        'Ext.toolbar.Paging'
    ],    
    tools: [
        {
            type    : 'help',
            glyph   : 'xf014@FontAwesome',     // the "home" icon
            tooltip : 'Delete Test',
            itemId  : 'toolDelete'
        }, 
        {
            type    : 'refresh',
            tooltip : 'Reload data',
            itemId  : 'toolRefresh'
        }
    ],
    hideHeaders: true, // removes the column header row so it looks like a DataView
    border: false,
    columns: [
        {
            xtype   : 'templatecolumn',
            flex    : 1,
            tpl     : new Ext.XTemplate(
                '<div class="speedtest-item">',
                    '<div class="meta">',
                    '<span class="time">{created:date("Y-m-d H:i:s")}</span>',
                    '<br>',
                    '<span class="device">{ip} : {port} - <i>{protocol}</i></span>',
                    '</div>',
                    '<div class="speeds">',
                    '<div class="upload">Upload: {[this.formatSpeed(values.upload_bps)]}</div>',
                    '<div class="download">Download: {[this.formatSpeed(values.download_bps)]}</div>',
                    '</div>',
                '</div>'
                , {
                    // Helper function for the template
                    formatSpeed: function(bps) {
                        if (!bps) return 'N/A';
                        var mbps = (bps / 1000000).toFixed(2);
                        return mbps + ' Mbps';
                    }
                }
            )
        }  
    ],
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    }, 
    initComponent   : function(){
        var me = this;
        me.store = {
            type: 'store',
            autoLoad: true,
            pageSize: 25,
            proxy: {
                type: 'ajax',
                url: '/cake4/rd_cake/iperf-tests/iperf-index.json', // adjust to your CakePHP endpoint that returns paged JSON
                reader: {
                    type: 'json',
                    rootProperty: 'items',
                    totalProperty: 'total'
                },
                extraParams: {   
                    dev_mode    : me.dev_mode,       
                    dev_id      : me.dev_id            
                }
            },
            fields: [
                {name: 'id', type: 'int'},
                {name: 'ap_id', type: 'int'},
                {name: 'node_id', type: 'int'},
                {name: 'mac', type: 'string'},
                {name: 'ip', type: 'string'},
                {name: 'port', type: 'int'},
                {name: 'protocol', type: 'string'},
                {name: 'timestamp_utc', type: 'string'},
                {name: 'upload_bps', type: 'number'},
                {name: 'upload_bytes', type: 'number'},
                {name: 'upload_retransmits', type: 'int'},
                {name: 'upload_mean_rtt_us', type: 'int'},
                {name: 'download_bps', type: 'number'},
                {name: 'download_bytes', type: 'number'},
                {name: 'download_retransmits', type: 'int'},
                {name: 'download_mean_rtt_us', type: 'int'},
                {name: 'meta_json', type: 'auto'}
            ]
        };    
        me.callParent(arguments);
    }
});
