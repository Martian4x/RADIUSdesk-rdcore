<?php
namespace App\Model\Table;

use Cake\ORM\Table;

class ApVpnConnectionMacAddressesTable extends Table {

    public function initialize(array $config):void{
    
        $this->addBehavior('Timestamp');
        $this->belongsTo('ApVpnConnections', [
            'className' => 'ApVpnConnections',
            'foreignKey' => 'ap_vpn_connection_id'
        ]);
        $this->belongsTo('MacAddresses', [
            'className' => 'MacAddresses',
            'foreignKey' => 'mac_address_id'
        ]);        
    }
}
