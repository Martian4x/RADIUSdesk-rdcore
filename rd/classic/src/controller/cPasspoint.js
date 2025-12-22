Ext.define('Rd.controller.cPasspoint', {
    extend: 'Ext.app.Controller',
    actionIndex: function(pnl,itemId){
        var me      = this;
        var item    = pnl.down('#'+itemId);
        var added   = false;
        if(!item){
            var tp = Ext.create('Ext.tab.Panel',
            	{          
	            	border  : false,
	                itemId  : itemId,
	                plain	: true,
	                cls     : 'subSubTab', //Make darker -> Maybe grey
	                tabBar: {
                        items: [
                            { 
                                xtype   : 'btnOtherBack'
                            }              
                       ]
                    },
	                items   : [
	                    { 
	                        title   : 'Hotspot 2.0 / Passpoint', 
	                        xtype   : 'gridPasspoint',
	                        border  : false,
                            plain   : true,
                            padding : '0 5 0 5',
	                        glyph   : 'xf1eb@FontAwesome',
	                        padding : Rd.config.gridSlim,
	                    }
	                ]
	            });      
            pnl.add(tp);
            added = true;
        }
        return added;      
    },
    views:  [
    	'passpoint.gridPasspoint'
    ],
    stores: ['sPasspoint'],
    models: ['mPasspoint']
});
