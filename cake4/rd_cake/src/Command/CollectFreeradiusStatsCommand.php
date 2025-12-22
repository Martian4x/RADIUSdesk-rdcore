<?php

//as www-data
//cd /var/www/html/cake4/rd_cake && bin/cake update_user_stats_dailies 


declare(strict_types=1);

namespace App\Command;

use Cake\Console\Arguments;
use Cake\Console\Command;
use Cake\Console\ConsoleIo;
use Cake\ORM\TableRegistry;
use Cake\I18n\FrozenTime;

class CollectFreeradiusStatsCommand extends Command
{
    protected const DEFAULT_TIMEOUT = 7; // seconds

    public static function defaultName(): string
    {
        return 'freeradius:collect-stats';
    }

    public function execute(Arguments $args, ConsoleIo $io)
    {
        $server  = $args->getOption('server') ?? '127.0.0.1';
        $port    = (string)($args->getOption('port') ?? '18121');
        $secret  = $args->getOption('secret') ?? 'adminsecret';
        $attrs   = $args->getOption('attrs') ?? '/var/www/rdcore/cake4/rd_cake/config/status-all.txt';
        $tag     = $args->getOption('tag') ?? 'main';
        $timeout = (int)($args->getOption('timeout') ?? self::DEFAULT_TIMEOUT);

        $bin = trim((string)($args->getOption('radclient') ?? 'radclient'));

        $serverAddr = "{$server}:{$port}";
        $cmd = sprintf(
            'timeout %d %s -x %s status %s < %s 2>&1',
            $timeout,
            escapeshellcmd($bin),
            escapeshellarg($serverAddr),
            escapeshellarg($secret),
            escapeshellarg($attrs)
        );

        $io->out("Running: $cmd");
        $output = shell_exec($cmd) ?? '';
        if ($output === '') {
            $io->err('No output from radclient');
            return self::CODE_ERROR;
        }

        // Parse lines "Key = value" and map only Accounting + USTH
        $lines = preg_split('/\R/u', $output);
        $kv = [];
        foreach ($lines as $line) {
            // E.g.: " FreeRADIUS-Total-Accounting-Requests = 36"
            if (preg_match('/^\s*([A-Za-z0-9\-]+)\s*=\s*(.+)\s*$/', $line, $m)) {
                $key = $m[1];
                $val = trim($m[2], '" ');
                $kv[$key] = $val;
            }
        }

        $mapInt = function($key) use ($kv): ?int {
            if (!array_key_exists($key, $kv)) return null;
            $v = $kv[$key];
            if (preg_match('/^-?\d+$/', $v)) return (int)$v;
            return null;
        };

        $parseFrTime = function($key) use ($kv): ?FrozenTime {
            if (empty($kv[$key])) return null;
            // Example: "Oct 26 2025 19:29:33 UTC"
            $dt = \DateTime::createFromFormat('M d Y H:i:s T', $kv[$key], new \DateTimeZone('UTC'));
            if (!$dt) return null;
            return FrozenTime::createFromTimestamp($dt->getTimestamp())->setTimezone('UTC');
        };

        $entityData = [
            'captured_at'             => FrozenTime::now('UTC'),
            'tag'                     => $tag,
            'server'                  => $serverAddr,

            'stats_start_time'        => $parseFrTime('FreeRADIUS-Stats-Start-Time'),
            'stats_hup_time'          => $parseFrTime('FreeRADIUS-Stats-HUP-Time'),
            
            // Auth totals
            'total_access_requests'   => $mapInt('FreeRADIUS-Total-Access-Requests'),
            'total_access_accepts'    => $mapInt('FreeRADIUS-Total-Access-Accepts'),
            'total_access_rejects'    => $mapInt('FreeRADIUS-Total-Access-Rejects'),
            'total_access_challenges' => $mapInt('FreeRADIUS-Total-Access-Challenges'),
            'total_auth_responses'    => $mapInt('FreeRADIUS-Total-Auth-Responses'),
            'auth_duplicate_requests' => $mapInt('FreeRADIUS-Total-Auth-Duplicate-Requests'),
            'auth_malformed_requests' => $mapInt('FreeRADIUS-Total-Auth-Malformed-Requests'),
            'auth_invalid_requests'   => $mapInt('FreeRADIUS-Total-Auth-Invalid-Requests'),
            'auth_dropped_requests'   => $mapInt('FreeRADIUS-Total-Auth-Dropped-Requests'),
            'auth_unknown_types'      => $mapInt('FreeRADIUS-Total-Auth-Unknown-Types'),
            'auth_conflicts'          => $mapInt('FreeRADIUS-Total-Auth-Conflicts'),         

            // Accounting totals
            'total_acct_requests'     => $mapInt('FreeRADIUS-Total-Accounting-Requests'),
            'total_acct_responses'    => $mapInt('FreeRADIUS-Total-Accounting-Responses'),
            'acct_duplicate_requests' => $mapInt('FreeRADIUS-Total-Acct-Duplicate-Requests'),
            'acct_malformed_requests' => $mapInt('FreeRADIUS-Total-Acct-Malformed-Requests'),
            'acct_invalid_requests'   => $mapInt('FreeRADIUS-Total-Acct-Invalid-Requests'),
            'acct_dropped_requests'   => $mapInt('FreeRADIUS-Total-Acct-Dropped-Requests'),
            'acct_unknown_types'      => $mapInt('FreeRADIUS-Total-Acct-Unknown-Types'),
            'acct_conflicts'          => $mapInt('FreeRADIUS-Total-Acct-Conflicts'),

            // USTH
            'queue_len_internal'      => $mapInt('FreeRADIUS-Queue-Len-Internal'),
            'queue_len_proxy'         => $mapInt('FreeRADIUS-Queue-Len-Proxy'),
            'queue_len_auth'          => $mapInt('FreeRADIUS-Queue-Len-Auth'),
            'queue_len_acct'          => $mapInt('FreeRADIUS-Queue-Len-Acct'),
            'queue_len_detail'        => $mapInt('FreeRADIUS-Queue-Len-Detail'),
            'queue_pps_in'            => $mapInt('FreeRADIUS-Queue-PPS-In'),
            'queue_pps_out'           => $mapInt('FreeRADIUS-Queue-PPS-Out'),
            'threads_active'          => $mapInt('FreeRADIUS-Stats-Threads-Active'),
            'threads_total'           => $mapInt('FreeRADIUS-Stats-Threads-Total'),
            'threads_max'             => $mapInt('FreeRADIUS-Stats-Threads-Max'),
        ];

        // Insert
        /** @var \App\Model\Table\FreeradiusStatsTable $Stats */
        print_r($entityData);

        $Stats = TableRegistry::getTableLocator()->get('FreeradiusStats');
        $entity = $Stats->newEntity($entityData);
        if ($entity->getErrors()) {
            $io->err('Validation errors: ' . json_encode($entity->getErrors(), JSON_PRETTY_PRINT));
            return self::CODE_ERROR;
        }
        if (!$Stats->save($entity)) {
            $io->err('Failed saving freeradius_stats row.');
            return self::CODE_ERROR;
        }

        $io->success('OK: row id ' . $entity->id);
        return self::CODE_SUCCESS;
    }

    protected function buildOptionParser(\Cake\Console\ConsoleOptionParser $parser): \Cake\Console\ConsoleOptionParser
    {
        $parser = parent::buildOptionParser($parser);
        $parser->addOptions([
            'server'   => ['help' => 'Status server IP/host', 'short' => 's'],
            'port'     => ['help' => 'Status server port', 'short' => 'p'],
            'secret'   => ['help' => 'Shared secret', 'short' => 'e'],
            'attrs'    => ['help' => 'Attributes file path', 'short' => 'a'],
            'tag'      => ['help' => 'Tag for this node (cloud/role/hostname)', 'short' => 't'],
            'timeout'  => ['help' => 'Command timeout (seconds)', 'short' => 'i'],
            'radclient'=> ['help' => 'Path to radclient binary', 'short' => 'c'],
        ]);
        return $parser;
    }
}
