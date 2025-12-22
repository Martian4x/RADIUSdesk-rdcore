Ext.define('Rd.view.wireguard.pnlWireguardPeerQrcode', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlWireguardPeerQrcode',
    controller  : 'vcWireguardPeerQrcode',
    requires    : [
        'Rd.view.wireguard.vcWireguardPeerQrcode'
    ],
    layout      : {
      type  : 'vbox',
      align : 'start',
      pack  : 'start'
    },
    initComponent: function(){    
        var me      = this;
        var w_prim  = 550;        
        var cnt     = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items       : [
                {            
                    xtype       : 'container',
                    margin      : '30 0 0 0',
                    itemId      : 'cntInfo',
                    tpl		: new Ext.XTemplate(
				        '<div class="rd-tile-stat">',
                            '{name}',
                            '<div class="rd-tile-desc">',
				               '{description}',
				            '</div>',
				        '</div>'
			        ),
			        data        : {}
                },
		        {
                    xtype       : 'sliderfield',
                    label       : 'QR Code Size',
                    value       : 220,
                    minValue    : 120,
                    maxValue    : 480,
                    increment   : 10,
                    margin      : 10,
                    itemId      : 'sldrSize'
                },
		        {            
                    itemId      : 'cntDetailQr',
                    flex        : 1,
                    scrollable  : true,
                    xtype       : 'container'
                },
                {
                    xtype       : 'container',
                    layout      : { type: 'hbox', align: 'middle', pack: 'center' },
                    padding     : '10 10 10 10',
                    defaults    : {
                        xtype  : 'button',
                        margin : '0 5 0 5',
                        flex   : 1,
                        scale  : 'medium',
                        minWidth: 120
                    },
                    items: [                    
                        {
                            text    : 'Download PNG',
                            iconCls : 'x-fa fa-file-image-o',
                            handler : function(btn){
                                btn.up('pnlWireguardPeerQrcode').getController().exportQr('png');
                            }
                        },
                        {
                            text    : 'Download JPG',
                            iconCls : 'x-fa fa-file-image-o',
                            handler : function(btn){
                                btn.up('pnlWireguardPeerQrcode').getController().exportQr('jpeg');
                            }
                        }
                    ]
                }                
            ]
        };   
        me.items = cnt; 
        me.callParent(arguments);
    }
});

