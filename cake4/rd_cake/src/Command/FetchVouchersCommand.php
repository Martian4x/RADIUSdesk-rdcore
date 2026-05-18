<?php
namespace App\Command;

use Cake\Command\Command;
use Cake\Console\Arguments;
use Cake\Console\ConsoleIo;
use Cake\Datasource\ConnectionManager;

class FetchVouchersCommand extends Command
{
    public function execute(Arguments $args, ConsoleIo $io): int
    {
        $sourceDb = ConnectionManager::get('bahariweb_izone');
        $destDb   = ConnectionManager::get('default');

        $io->out("<info>Starting Voucher Sync (Starting from ID 3312)...</info>");

        // --- IMPROVEMENT: Force start from 3312 ---
        // We get the max izone_id from local. If it's empty or less than 3311, 
        // we set it to 3311 so the query "v.id > 3311" fetches 3312.
        $lastImported = $destDb->execute("SELECT MAX(izone_id) as max_id FROM vouchers")->fetch('assoc');
        $currentMax = $lastImported['max_id'] ?? 0;
        $lastId = max($currentMax, 3311); 

        // 2. Pre-fetch Profile Time Limits (Cache)
        $timeLimits = [];
        $limits = $destDb->execute("SELECT groupname, value FROM radgroupcheck WHERE attribute = 'Rd-Total-Time'")->fetchAll('assoc');
        foreach ($limits as $l) {
            $timeLimits[$l['groupname']] = $l['value'];
        }

        // 3. Fetch new vouchers starting from 3312
        $newVouchers = $sourceDb->execute("
            SELECT v.*, b.name as batch_name, p.rad_profile_name, p.rad_profile_id, p.rad_time_valid 
            FROM vouchers v
            JOIN voucher_batches b ON v.batch_id = b.id
            JOIN packages p ON v.package_id = p.id
            WHERE v.id > ? AND v.status = 'unused'
            ORDER BY v.id ASC
            LIMIT 500
        ", [$lastId])->fetchAll('assoc');

        if (empty($newVouchers)) {
            $io->out("No new vouchers found above ID $lastId.");
            return static::CODE_SUCCESS;
        }

        foreach ($newVouchers as $v) {
            try {
                $destDb->transactional(function ($db) use ($v, $timeLimits, $io) {
                    $profileName = $v['rad_profile_name'];
                    $profileId = $v['rad_profile_id'];
                    $totalTime = $timeLimits[$profileName] ?? 0;
                    $timeValid = $v['rad_time_valid'];
                    // $code // remove, alphabets and special characters and spaces to ensure it's clean for RADIUS
                    // $code = preg_replace('/[^A-Za-z0-9]/', '', $v['code']);
                    $code = preg_replace('/[^0-9]/', '', $v['code']);

                    // A. Insert rd.vouchers
                    $db->insert('vouchers', [
                        'izone_id'    => $v['id'],
                        'name'        => $code,
                        'password'    => $code,
                        'batch'       => $v['batch_name'],
                        'status'      => 'new',
                        'cloud_id'    => 24,
                        'realm'       => 'iZone Unlimited',
                        'realm_id'    => 20, 
                        'profile'     => $profileName,
                        'profile_id'  => $profileId,
                        'time_valid'  => $timeValid,
                        'time_cap'    => $totalTime,
                        'created'     => date('Y-m-d H:i:s'),
                        'modified'    => date('Y-m-d H:i:s'),
                    ]);

                    // B. Insert rd.radcheck entries
                    $radcheckData = [
                        ['username' => $code, 'attribute' => 'User-Profile', 'op' => ':=', 'value' => $profileName],
                        ['username' => $code, 'attribute' => 'Rd-Realm', 'op' => ':=', 'value' => 'iZone Unlimited'],
                        ['username' => $code, 'attribute' => 'Cleartext-Password', 'op' => ':=', 'value' => $code],
                        ['username' => $code, 'attribute' => 'Rd-User-Type', 'op' => ':=', 'value' => 'voucher'],
                        ['username' => $code, 'attribute' => 'Rd-Voucher', 'op' => ':=', 'value' => $timeValid],
                        ['username' => $code, 'attribute' => 'Rd-Total-Time', 'op' => ':=', 'value' => $totalTime],
                    ];

                    foreach ($radcheckData as $row) {
                        $db->insert('radcheck', $row);
                    }
                });
            } catch (\Exception $e) {
                $io->error("Failed to import ID {$v['id']}: " . $e->getMessage());
            }
        }

        $io->success(count($newVouchers) . " vouchers imported starting from ID " . ($lastId + 1));
        return static::CODE_SUCCESS;
    }
}