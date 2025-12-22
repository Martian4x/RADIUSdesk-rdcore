Ext.define('Rd.view.components.cmbVendor', {
    extend: 'Ext.form.ComboBox',
    alias : 'widget.cmbVendor',
    fieldLabel: i18n('sVendor'),
    labelSeparator: '',
   // store: 'sVendors',
    queryMode: 'local',
    valueField: 'id',
    displayField: 'name',
    typeAhead: true,
    allowBlank: false,
    mode: 'local',
    labelWidth : 60,
    labelClsExtra: 'lblRd',
    requires: [
        'Rd.store.sVendors'
    ],
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
            '<div class="x-boundlist-item">',
                '<strong>{name}</strong></span>',
                '<tpl if="has_number">',
                    '<span style="color:grey;font-size:90%">  PEN No {number}</span>',
                '</tpl>',
            '</div>',
        '</tpl>'
    ),
    initComponent: function() {
    	var me = this;
  		var s = Ext.create('Rd.store.sVendors', {});            
        me.setStore(s);
        this.callParent(arguments);
    }
});
