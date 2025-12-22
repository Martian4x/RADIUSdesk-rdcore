Ext.define('Rd.view.components.cmbAttribute', {
    extend: 'Ext.form.ComboBox',
    alias : 'widget.cmbAttribute',
    fieldLabel: i18n('sAttribute'),
    labelSeparator: '',
    queryMode: 'local',
    valueField: 'id',
    displayField: 'name',
    typeAhead: true,
    allowBlank: false,
    mode: 'local',
    labelWidth : 60,
    labelClsExtra: 'lblRd',
    requires: [
        'Rd.store.sAttributes'
    ],
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
            '<div class="x-boundlist-item" style="border-bottom: 1px solid #ccc;">',
                '<strong>{name}</strong></span>',
                    '<div style="color:grey;font-size:90%">',
                    '<tpl if="has_tag">',
                        '<span style="color:#1f80ff;font-size:100%;"><i class="fa fa-tag"></i>   </span>',
                    '</tpl>',
                    'No {number} / Type {type}',
                    '</div>',
            '</div>',
        '</tpl>'
    ),
    initComponent: function() {
    	var me = this;
  		var s = Ext.create('Rd.store.sAttributes', {});            
        me.setStore(s);
        this.callParent(arguments);
    }
});
