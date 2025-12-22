drop procedure if exists add_iperf_tests;

delimiter //
create procedure add_iperf_tests()
begin

if not exists (select * from information_schema.columns
    where table_name = 'iperf_tests' and table_schema = DATABASE()) then
	CREATE TABLE iperf_tests (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      ap_id INT NULL,
      node_id INT NULL,
      mac CHAR(17) NULL,
      ip VARCHAR(45) NULL,
      port INT NULL,
      protocol VARCHAR(10) NULL,
      timestamp_utc DATETIME(6) NULL,     -- parsed from timestamp.time
      test_start_time DATETIME(6) NULL,   -- parsed from test_start (if present)
      duration_seconds DECIMAL(6,3) NULL,
      upload_bps BIGINT NULL,             -- sum_sent.bits_per_second for upload
      upload_bytes BIGINT NULL,
      upload_retransmits INT NULL,
      upload_mean_rtt_us INT NULL,        -- store RTT values as microseconds if present
      download_bps BIGINT NULL,           -- sum_received.bits_per_second for download
      download_bytes BIGINT NULL,
      download_retransmits INT NULL,
      download_mean_rtt_us INT NULL,
      sender_tcp_congestion VARCHAR(32) NULL,
      receiver_tcp_congestion VARCHAR(32) NULL,
      meta_json JSON NOT NULL,            -- full original JSON payload
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_ap_id (ap_id),
      INDEX idx_node_id (node_id),
      INDEX idx_timestamp (timestamp_utc),
      INDEX idx_upload_bps (upload_bps),
      INDEX idx_download_bps (download_bps)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

end if;


end//

delimiter ;
call add_iperf_tests;
