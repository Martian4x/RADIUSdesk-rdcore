<?php
declare(strict_types=1);

namespace App\Controller;

use Cake\I18n\FrozenTime;
use Cake\Datasource\ConnectionManager;

class FreeradiusStatsController extends AppController
{

     public function initialize():void{  
        parent::initialize();
        $this->Authentication->allowUnauthenticated([ 'deltas']);
    }    


    // GET /freeradius-stats/deltas.json?tag=main&from=2025-10-26T00:00:00Z&to=2025-10-27T00:00:00Z&bucket=60&metrics=d_acct_requests,d_acct_responses,d_access_requests,d_access_rejects
    public function deltas()
    {
        $this->request->allowMethod(['get']);

        $tag     = (string)($this->request->getQuery('tag') ?? '');
        if ($tag === '') {
            return $this->response->withStatus(400)->withStringBody('Missing ?tag');
        }

        // defaults: last 6 hours, 60-second buckets
        $toStr   = (string)($this->request->getQuery('to')   ?? FrozenTime::now('UTC')->toIso8601String());
        $fromStr = (string)($this->request->getQuery('from') ?? FrozenTime::now('UTC')->subHours(6)->toIso8601String());
        $bucket  = (int)($this->request->getQuery('bucket') ?? 60);
        if ($bucket < 10) { $bucket = 10; }                 // min 10s
        if ($bucket > 86400) { $bucket = 86400; }           // max 1d

        // allowlist the metrics
        $allowed = [
            'd_access_requests','d_access_accepts','d_access_rejects','d_access_challenges','d_auth_responses',
            'd_auth_dup','d_auth_malformed','d_auth_invalid','d_auth_dropped','d_auth_unknown','d_auth_conflicts',
            'd_acct_requests','d_acct_responses','d_acct_dup','d_acct_malformed','d_acct_invalid','d_acct_dropped','d_acct_unknown','d_acct_conflicts'
        ];
        $metrics = $this->request->getQuery('metrics');
        $metrics = is_string($metrics) && $metrics !== '' ? explode(',', $metrics) : ['d_acct_requests','d_acct_responses'];
        $metrics = array_values(array_intersect($metrics, $allowed));
        if (empty($metrics)) {
            return $this->response->withStatus(400)->withStringBody('No valid metrics requested');
        }

        // Parse ISO8601 (accepts 'Z'); store in UTC
        $from = new FrozenTime($fromStr, 'UTC');
        $to   = new FrozenTime($toStr, 'UTC');
        if ($from->gte($to)) {
            return $this->response->withStatus(400)->withStringBody('?from must be < ?to');
        }

        $conn = ConnectionManager::get('default');

        // Build SELECT fields like: SUM(d_acct_requests) AS d_acct_requests, ...
        $fields = [];
        foreach ($metrics as $m) {
            $fields[] = "SUM($m) AS `$m`";
        }
        $fieldsSql = implode(",\n      ", $fields);

        // Bucket time: UNIX_TIMESTAMP(captured_at) DIV :bucket * :bucket (seconds)
        // We return `ts` as UNIX seconds and `ts_ms` for charting.
        $sql = "
            SELECT
              (UNIX_TIMESTAMP(captured_at) DIV :bucket) * :bucket AS ts,
              FROM_UNIXTIME((UNIX_TIMESTAMP(captured_at) DIV :bucket) * :bucket) AS ts_dt,
              $fieldsSql
            FROM freeradius_stats_deltas
            WHERE tag = :tag
              AND captured_at >= :from
              AND captured_at <  :to
            GROUP BY ts
            ORDER BY ts ASC
        ";

        $rows = $conn->execute($sql, [
            'bucket' => $bucket,
            'tag'    => $tag,
            'from'   => $from->format('Y-m-d H:i:s'),
            'to'     => $to->format('Y-m-d H:i:s'),
        ])->fetchAll('assoc');

        // Shape for chart series: { ts, ts_ms, metrics... }
        $data = [];
        foreach ($rows as $r) {
            $item = [
                'ts'    => (int)$r['ts'],
                'ts_ms' => (int)$r['ts'] * 1000,
            ];
            foreach ($metrics as $m) {
                $item[$m] = (int)$r[$m];
            }
            $data[] = $item;
        }

        $this->set([
            'success' => true,
            'bucket'  => $bucket,
            'tag'     => $tag,
            'from'    => $from->toIso8601String(),
            'to'      => $to->toIso8601String(),
            'metrics' => $metrics,
            'items'   => $data,
        ]);
        $this->viewBuilder()->setOption('serialize', ['success','bucket','tag','from','to','metrics','items']);
    }

    // GET /freeradius-stats/latest.json?tag=main
    // Returns the most recent snapshot (point-in-time USTH + last bucket sums for a handful of deltas)
    public function latest()
    {
        $this->request->allowMethod(['get']);
        $tag = (string)($this->request->getQuery('tag') ?? '');
        if ($tag === '') {
            return $this->response->withStatus(400)->withStringBody('Missing ?tag');
        }

        $conn = ConnectionManager::get('default');

        // Last snapshot (from base table) – handy for queue/threads
        $snap = $conn->execute("
            SELECT id, server, captured_at, queue_len_internal, queue_len_proxy, queue_len_auth, queue_len_acct, queue_len_detail,
                   queue_pps_in, queue_pps_out, threads_active, threads_total, threads_max
            FROM freeradius_stats
            WHERE tag = :tag
            ORDER BY captured_at DESC
            LIMIT 1
        ", ['tag' => $tag])->fetch('assoc');

        // Sum deltas over the last 5 minutes for quick “rate now”
        $rates = $conn->execute("
            SELECT
              SUM(d_access_requests)  AS d_access_requests,
              SUM(d_access_rejects)   AS d_access_rejects,
              SUM(d_acct_requests)    AS d_acct_requests,
              SUM(d_acct_responses)   AS d_acct_responses
            FROM freeradius_stats_deltas
            WHERE tag = :tag
              AND captured_at >= (UTC_TIMESTAMP() - INTERVAL 5 MINUTE)
        ", ['tag' => $tag])->fetch('assoc');

        $this->set([
            'success' => true,
            'snapshot' => $snap ?: null,
            'rates_last_5m' => array_map('intval', $rates ?: []),
        ]);
        $this->viewBuilder()->setOption('serialize', ['success','snapshot','rates_last_5m']);
    }
}
