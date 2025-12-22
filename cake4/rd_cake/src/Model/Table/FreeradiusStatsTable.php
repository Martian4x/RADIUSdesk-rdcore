<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class FreeradiusStatsTable extends Table
{
    public function initialize(array $config): void
    {
        parent::initialize($config);
        $this->setTable('freeradius_stats');
        $this->setPrimaryKey('id');
        $this->addBehavior('Timestamp', [
            'events' => [
                'Model.beforeSave' => [
                    'captured_at' => 'new'
                ]
            ]
        ]);
    }

    public function validationDefault(Validator $validator): Validator
    {
        return $validator
            ->notEmptyString('server');
    }
}
