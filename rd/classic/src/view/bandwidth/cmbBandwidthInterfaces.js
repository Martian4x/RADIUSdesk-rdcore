Ext.define('Rd.view.bandwidth.cmbBandwidthInterfaces', {
    extend          : 'Ext.form.ComboBox',
    alias           : 'widget.cmbBandwidthInterfaces',
    forceSelection  : true,
    queryMode       : 'local',
    valueField      : 'id',
//    displayField    : 'type',
    typeAhead       : true,
    allowBlank      : false,
    mode            : 'local',
    name            : 'ap_id',
   // cls             : 'vlan-list',
 /*   tpl	            : Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<div  class="x-boundlist-item">',
                '<div>',
                    "<tpl if='type == \"special\"'><span style=\"font-weight:bold;font-size:12px;\">{name}</span></tpl>",
                    "<tpl if='type == \"captive_portal\"'><span style=\"font-weight:bold;font-size:12px;\"><i class=\"fa fa-key\"></i> {type}</span></tpl>",
                    "<tpl if='type == \"nat\"'><span style=\"font-weight:bold;font-size:12px;\"><i class=\"fa fa-arrows-alt\"></i> {type}</span></tpl>",
                '</div>',
                '<tpl if="Ext.isEmpty(connects_with)"><div style=\"color:grey;font-size:12px;\">No SSID Connected</div></tpl>', 
                '<tpl for="connects_with">', 
                    '<div style=\"color:#006622;font-size:12px;\"><i class=\"fa fa-wifi\"></i> SSID {name}</div>',
                '</tpl>',
            '</div>',
        '</tpl>'
    ),*/
    //listConfig can be used instead of tpl since it gives a couple of more options 
    listConfig: {
        cls: 'vlan-list',
        getInnerTpl: function () {
            return [
            '<tpl if="type==\'special\'">',
              '<div class="vlan-item vlan-special">',
                '<div class="vlan-title">{name} <span class="vlan-badge">SPECIAL</span></div>',
              '</div>',
            '<tpl else>',
              '<div class="vlan-item">',
                '<tpl if="parseInt(vlan,10) &gt; 0">',
                  '<div class="vlan-title">VLAN {vlan}',
                '<tpl else>',
                  '<div class="vlan-title">',
                    '<tpl if="!(connects_with && connects_with.length)">',
                      '**No SSID Connected**',
                    '<tpl else>',
                      '<tpl for="connects_with">{[xindex>1?", ":""]}{name}</tpl>',
                    '</tpl>',
                  '</div>',
                '</tpl>',
                ' <span class="vlan-type">({[values.type.toUpperCase()]})</span>',
              '</div>',
            '</tpl>'
            ].join('');
        }
    },    
    displayTpl      : Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<tpl if="type==\'special\'">',
                '{name}',
            '<tpl else>',
                '<tpl if="vlan &gt; 0">', //If there is a VLAN (We Just show the VLAN)
                    'VLAN {vlan}',
                '<tpl else>',                    
                    '<tpl if="Ext.isEmpty(connects_with)">{[values.type.toUpperCase()]} (No SSID Connected)</tpl>', 
                    '<tpl for="connects_with">',
                        '{name}',
                        '<tpl if="xindex < xcount">, </tpl>',
                    '</tpl>',
                '</tpl>',
            '</tpl>',
        '</tpl>'
    ),
    allOption       : false,
    dev_mode        : false,
    dev_id          : false,
    initComponent: function() {
        var me  = this;
        var s   = Ext.create('Ext.data.Store', {
            proxy: {
                type            : 'ajax',
                format          : 'json',
                batchActions    : true, 
                url             : '/cake4/rd_cake/bandwidth-reports/index-interfaces.json',
                extraParams: {
                    dev_mode: me.dev_mode,
                    dev_id  : me.dev_id
                },
                reader: {
                    type            : 'json',
                    rootProperty    : 'items',
                    messageProperty : 'message'
                }
            },
            autoLoad : true
        });        
        s.getProxy().setExtraParam('all_option',me.allOption);        
        me.store = s;
        this.callParent(arguments);
    }
});
