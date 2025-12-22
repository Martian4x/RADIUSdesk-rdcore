<?php 

// src/Model/Entity/User.php
namespace App\Model\Entity;

use Cake\ORM\Entity;
use Cake\Auth\DefaultPasswordHasher;
use Cake\Utility\Text;

class User extends Entity{

    // Make all fields mass assignable except for primary key field "id".
    protected $_accessible = [
        '*' => true,
        'id' => false,
    ];

    // Exclude password from JSON versions of the entity.
    protected $_hidden = [
        'password',
    ];

    // Hash the user's password before saving it to the database.
    protected function _setPassword(string $password): ?string
    {
        if (strlen($password) > 0) {
            return (new DefaultPasswordHasher())->hash($password);
        }
        return null;
    }
    
    protected function _setToken($value){
        if($value == ''){  //'' is a 'special' value that is suppose to generate a new token
            return Text::uuid();
        }
    }
    
}
