drop procedure if exists add_nlbw_stats;

delimiter //
create procedure add_nlbw_stats()
begin

if not exists (select * from information_schema.columns
    where table_name = 'nlbw_ap_stats' and table_schema = DATABASE()) then  
    CREATE TABLE nlbw_ap_stats (
      -- Keep AI first for performance, include `created` in PK to allow partitioning by created 
      id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      created    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
      modified   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      family     ENUM('4','6')   NOT NULL DEFAULT '4',
      proto      VARCHAR(8)      NOT NULL DEFAULT '',
      port       INT UNSIGNED    NOT NULL DEFAULT 0,
      mac_address_id  INT UNSIGNED    NOT NULL DEFAULT 0,
      ip         VARCHAR(45)     NOT NULL,             -- IPv4/IPv6
      conns      BIGINT UNSIGNED NOT NULL DEFAULT 0,

      rx_bytes   BIGINT UNSIGNED NOT NULL DEFAULT 0,
      rx_pkts    BIGINT UNSIGNED NOT NULL DEFAULT 0,
      tx_bytes   BIGINT UNSIGNED NOT NULL DEFAULT 0,
      tx_pkts    BIGINT UNSIGNED NOT NULL DEFAULT 0,

      layer7     VARCHAR(255)    NOT NULL DEFAULT '',
      l3if       VARCHAR(16)     NOT NULL DEFAULT '',
      l3dev      VARCHAR(16)     NOT NULL DEFAULT '',
      exit_id    INT UNSIGNED    NOT NULL DEFAULT 0,
      exit_type  VARCHAR(16)     NOT NULL DEFAULT '',    
      ap_id      INT UNSIGNED    NOT NULL DEFAULT 0,
      -- Primary key includes `created` so we can partition by `created` (MySQL requirement)
      PRIMARY KEY (id, created),

      -- Time filter
      KEY ix_created (created),
      KEY ix_ap_id (ap_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

end if;

end//

delimiter ;
call add_nlbw_stats;
