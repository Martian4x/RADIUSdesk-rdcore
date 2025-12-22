<?php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class ApVpnStatsTable extends Table
{
    public function initialize(array $config):void{
        $this->belongsTo('ApVpnConnections');       
    }
}
