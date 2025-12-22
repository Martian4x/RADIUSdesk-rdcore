drop procedure if exists add_freeradius_stats;

delimiter //
create procedure add_freeradius_stats()
begin

if not exists (select * from information_schema.columns
    where table_name = 'freeradius_stats' and table_schema = DATABASE()) then
    
        CREATE TABLE `freeradius_stats` (
          `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          `captured_at` DATETIME NOT NULL,         -- store in UTC
          `tag` VARCHAR(64) DEFAULT NULL,          -- e.g. hostname / role / cloud tag
          `server` VARCHAR(128) NOT NULL,          -- "127.0.0.1:18121"

          -- FreeRADIUS status times
          `stats_start_time` DATETIME DEFAULT NULL, -- FreeRADIUS-Stats-Start-Time
          `stats_hup_time`   DATETIME DEFAULT NULL, -- FreeRADIUS-Stats-HUP-Time

          -- ===== AUTH totals (Access + Auth) =====
          `total_access_requests`      BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Access-Requests
          `total_access_accepts`       BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Access-Accepts
          `total_access_rejects`       BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Access-Rejects
          `total_access_challenges`    BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Access-Challenges
          `total_auth_responses`       BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Auth-Responses
          `auth_duplicate_requests`    BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Auth-Duplicate-Requests
          `auth_malformed_requests`    BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Auth-Malformed-Requests
          `auth_invalid_requests`      BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Auth-Invalid-Requests
          `auth_dropped_requests`      BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Auth-Dropped-Requests
          `auth_unknown_types`         BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Auth-Unknown-Types
          `auth_conflicts`             BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Auth-Conflicts

          -- ===== ACCOUNTING totals =====
          `total_acct_requests`        BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Accounting-Requests
          `total_acct_responses`       BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Accounting-Responses
          `acct_duplicate_requests`    BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Acct-Duplicate-Requests
          `acct_malformed_requests`    BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Acct-Malformed-Requests
          `acct_invalid_requests`      BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Acct-Invalid-Requests
          `acct_dropped_requests`      BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Acct-Dropped-Requests
          `acct_unknown_types`         BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Acct-Unknown-Types
          `acct_conflicts`             BIGINT UNSIGNED DEFAULT 0,  -- FreeRADIUS-Total-Acct-Conflicts

          -- ===== USTH (queues/pps/threads) =====
          `queue_len_internal`         INT UNSIGNED DEFAULT 0,     -- FreeRADIUS-Queue-Len-Internal
          `queue_len_proxy`            INT UNSIGNED DEFAULT 0,     -- FreeRADIUS-Queue-Len-Proxy
          `queue_len_auth`             INT UNSIGNED DEFAULT 0,     -- FreeRADIUS-Queue-Len-Auth
          `queue_len_acct`             INT UNSIGNED DEFAULT 0,     -- FreeRADIUS-Queue-Len-Acct
          `queue_len_detail`           INT UNSIGNED DEFAULT 0,     -- FreeRADIUS-Queue-Len-Detail

          `queue_pps_in`               INT UNSIGNED DEFAULT 0,     -- FreeRADIUS-Queue-PPS-In
          `queue_pps_out`              INT UNSIGNED DEFAULT 0,     -- FreeRADIUS-Queue-PPS-Out

          `threads_active`             INT UNSIGNED DEFAULT 0,     -- FreeRADIUS-Stats-Threads-Active
          `threads_total`              INT UNSIGNED DEFAULT 0,     -- FreeRADIUS-Stats-Threads-Total
          `threads_max`                INT UNSIGNED DEFAULT 0,     -- FreeRADIUS-Stats-Threads-Max

          PRIMARY KEY (`id`),
          KEY `idx_captured_at` (`captured_at`),
          KEY `idx_server_captured_at` (`server`,`captured_at`),
          KEY `idx_tag_captured_at` (`tag`,`captured_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

end if;


CREATE OR REPLACE VIEW freeradius_stats_deltas AS
SELECT
  id,
  tag,
  server,
  captured_at,

  -- AUTH deltas
  GREATEST(0, total_access_requests   - LAG(total_access_requests)   OVER (PARTITION BY tag ORDER BY captured_at)) AS d_access_requests,
  GREATEST(0, total_access_accepts    - LAG(total_access_accepts)    OVER (PARTITION BY tag ORDER BY captured_at)) AS d_access_accepts,
  GREATEST(0, total_access_rejects    - LAG(total_access_rejects)    OVER (PARTITION BY tag ORDER BY captured_at)) AS d_access_rejects,
  GREATEST(0, total_access_challenges - LAG(total_access_challenges) OVER (PARTITION BY tag ORDER BY captured_at)) AS d_access_challenges,
  GREATEST(0, total_auth_responses    - LAG(total_auth_responses)    OVER (PARTITION BY tag ORDER BY captured_at)) AS d_auth_responses,
  GREATEST(0, auth_duplicate_requests - LAG(auth_duplicate_requests) OVER (PARTITION BY tag ORDER BY captured_at)) AS d_auth_dup,
  GREATEST(0, auth_malformed_requests - LAG(auth_malformed_requests) OVER (PARTITION BY tag ORDER BY captured_at)) AS d_auth_malformed,
  GREATEST(0, auth_invalid_requests   - LAG(auth_invalid_requests)   OVER (PARTITION BY tag ORDER BY captured_at)) AS d_auth_invalid,
  GREATEST(0, auth_dropped_requests   - LAG(auth_dropped_requests)   OVER (PARTITION BY tag ORDER BY captured_at)) AS d_auth_dropped,
  GREATEST(0, auth_unknown_types      - LAG(auth_unknown_types)      OVER (PARTITION BY tag ORDER BY captured_at)) AS d_auth_unknown,
  GREATEST(0, auth_conflicts          - LAG(auth_conflicts)          OVER (PARTITION BY tag ORDER BY captured_at)) AS d_auth_conflicts,

  -- ACCT deltas
  GREATEST(0, total_acct_requests     - LAG(total_acct_requests)     OVER (PARTITION BY tag ORDER BY captured_at)) AS d_acct_requests,
  GREATEST(0, total_acct_responses    - LAG(total_acct_responses)    OVER (PARTITION BY tag ORDER BY captured_at)) AS d_acct_responses,
  GREATEST(0, acct_duplicate_requests - LAG(acct_duplicate_requests) OVER (PARTITION BY tag ORDER BY captured_at)) AS d_acct_dup,
  GREATEST(0, acct_malformed_requests - LAG(acct_malformed_requests) OVER (PARTITION BY tag ORDER BY captured_at)) AS d_acct_malformed,
  GREATEST(0, acct_invalid_requests   - LAG(acct_invalid_requests)   OVER (PARTITION BY tag ORDER BY captured_at)) AS d_acct_invalid,
  GREATEST(0, acct_dropped_requests   - LAG(acct_dropped_requests)   OVER (PARTITION BY tag ORDER BY captured_at)) AS d_acct_dropped,
  GREATEST(0, acct_unknown_types      - LAG(acct_unknown_types)      OVER (PARTITION BY tag ORDER BY captured_at)) AS d_acct_unknown,
  GREATEST(0, acct_conflicts          - LAG(acct_conflicts)          OVER (PARTITION BY tag ORDER BY captured_at)) AS d_acct_conflicts,

  -- pass-through USTH (point-in-time)
  queue_len_internal, queue_len_proxy, queue_len_auth, queue_len_acct, queue_len_detail,
  queue_pps_in, queue_pps_out, threads_active, threads_total, threads_max
FROM freeradius_stats;


end//

delimiter ;
call add_freeradius_stats;
