drop procedure if exists add_wireguard;

delimiter //
create procedure add_wireguard()
begin

if not exists (select * from information_schema.columns
    where table_name = 'wireguard_servers' and table_schema = DATABASE()) then
	CREATE TABLE `wireguard_servers` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `cloud_id` int(11) NOT NULL,
      `name` varchar(128) NOT NULL,
      `ip_address` VARCHAR(45) DEFAULT NULL,
      `mac` varchar(64) NOT NULL,
      `uplink_interface` varchar(10) NOT NULL,
      `server_type` enum('standalone','mesh','ap_profile') DEFAULT 'standalone',
      `config_fetched` datetime DEFAULT NULL,
      `last_contact` datetime DEFAULT NULL,
      `last_contact_from_ip` varchar(30) NOT NULL DEFAULT '',
      `restart_flag` tinyint(1) NOT NULL DEFAULT '0',
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'wireguard_instances' and table_schema = DATABASE()) then
	CREATE TABLE `wireguard_instances` (
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      `wireguard_server_id` INT UNSIGNED NOT NULL,

      `interface_number` SMALLINT UNSIGNED NOT NULL,
      
      `name` VARCHAR(128) NOT NULL,
      `listen_port` SMALLINT UNSIGNED NOT NULL, -- port range 1-65535 fits SMALLINT

      `private_key` CHAR(44) NOT NULL,          -- base64 WireGuard key (32 bytes -> 44 chars)
      `public_key`  CHAR(44) NOT NULL,
      `preshared_key` CHAR(44) DEFAULT NULL,    -- optional, same size

      `ipv4_enabled` BOOLEAN NOT NULL DEFAULT FALSE,
      `ipv4_address` VARCHAR(45) DEFAULT NULL,  -- IPv4 or future-proof IPv6
      `ipv4_mask` TINYINT UNSIGNED DEFAULT NULL, -- 0–32 fits in TINYINT

      `ipv6_enabled` BOOLEAN NOT NULL DEFAULT FALSE,
      `ipv6_address` VARCHAR(45) DEFAULT NULL,
      `ipv6_prefix` TINYINT UNSIGNED DEFAULT NULL, -- 0–128 fits in TINYINT

      `nat_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
      `sqm_enabled` BOOLEAN NOT NULL DEFAULT FALSE,

      `upload_mb` BIGINT UNSIGNED NOT NULL DEFAULT 0,
      `download_mb` BIGINT UNSIGNED NOT NULL DEFAULT 0,

      `created` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      `modified` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      PRIMARY KEY (`id`),
      KEY `idx_server` (`wireguard_server_id`),
      UNIQUE KEY `ux_server_iface` (`wireguard_server_id`,`interface_number`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'wireguard_peers' and table_schema = DATABASE()) then

    CREATE TABLE wireguard_peers (
      `id`                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      `wireguard_instance_id` INT UNSIGNED NOT NULL,
      `name`                VARCHAR(128) NOT NULL,
      `description`         VARCHAR(255) DEFAULT NULL,

      -- addressing
      `ipv4_enabled`        BOOLEAN NOT NULL DEFAULT FALSE,
      `ipv4_address`        VARCHAR(45) DEFAULT NULL,  -- IPv4 or future-proof IPv6
      `ipv4_mask`           TINYINT UNSIGNED DEFAULT NULL, -- 0–32 fits in TINYINT

      `ipv6_enabled`        BOOLEAN NOT NULL DEFAULT FALSE,
      `ipv6_address`        VARCHAR(45) DEFAULT NULL,
      `ipv6_prefix`         TINYINT UNSIGNED DEFAULT NULL, -- 0–128 fits in TINYINT
      `dns`                 VARCHAR(255) DEFAULT NULL,   -- e.g. "1.1.1.1, 2606:4700:4700::1111"

      -- keys
      `private_key`         CHAR(44) NOT NULL,
      `public_key`          CHAR(44) NOT NULL,
      `preshared_key`       CHAR(44) DEFAULT NULL,    -- optional, same size
      
      -- runtime / policy
      `allowed_ips`         TEXT,               -- client-side AllowedIPs (often 0.0.0.0/0, ::/0)
      `persistent_keepalive` SMALLINT UNSIGNED DEFAULT 25,
      `mtu`                 SMALLINT UNSIGNED DEFAULT NULL,

      -- lifecycle
      `is_enabled`            TINYINT(1) NOT NULL DEFAULT 1,
      `revoked_at`            DATETIME DEFAULT NULL,

      -- telemetry you can backfill from `wg show` importer
      `last_handshake_ts`   DATETIME DEFAULT NULL,
      `rx_bytes`            BIGINT UNSIGNED DEFAULT 0,
      `tx_bytes`            BIGINT UNSIGNED DEFAULT 0,

      `created`             DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      `modified`            DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      CONSTRAINT fk_wgpeer_instance
        FOREIGN KEY (wireguard_instance_id) REFERENCES wireguard_instances(id)
          ON DELETE CASCADE
    );

end if;

if not exists (select * from information_schema.columns
    where table_name = 'wireguard_profile_entries' and table_schema = DATABASE()) then
	CREATE TABLE `wireguard_profile_entries` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `wireguard_profile_id` int(11) NOT NULL,
      `section` varchar(255) NOT NULL,
      `item` varchar(255) NOT NULL,
      `value` varchar(255) NOT NULL,
      `no_key_flag` tinyint(1) NOT NULL DEFAULT '0',
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'wireguard_stats' and table_schema = DATABASE()) then
	CREATE TABLE `wireguard_stats` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `wireguard_server_id` int(11) NOT NULL,
      `version` varchar(255) NOT NULL,
      `uptime` varchar(255) NOT NULL,
      `cpu` varchar(255) NOT NULL,
      `mem` varchar(255) NOT NULL,
      `core` text NOT NULL,
      `sessions_active` int(11) NOT NULL,
      `sessions` text NOT NULL,
      `pppoe` text NOT NULL,
      `radius1` text NOT NULL,
      `radius2` text NOT NULL,
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'wireguard_sessions' and table_schema = DATABASE()) then
	CREATE TABLE `wireguard_sessions` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `wireguard_server_id` int(11) NOT NULL,
      `netns` varchar(255) NOT NULL DEFAULT '',
      `vrf` varchar(255) NOT NULL DEFAULT '',
      `ifname` varchar(255) NOT NULL DEFAULT '',
      `username` varchar(255) NOT NULL DEFAULT '',
      `ip` varchar(32) NOT NULL DEFAULT '',
      `ip6` varchar(32) NOT NULL DEFAULT '',
      `ip6_dp` varchar(32) NOT NULL DEFAULT '',
      `type` varchar(32) NOT NULL DEFAULT '',
      `state` varchar(32) NOT NULL DEFAULT '',
      `uptime` varchar(32) NOT NULL DEFAULT '',
      `uptime_raw`  int(11) NOT NULL DEFAULT 0,
      `calling_sid` varchar(32) NOT NULL DEFAULT '',
      `called_sid` varchar(32) NOT NULL DEFAULT '',
      `sid` varchar(32) NOT NULL DEFAULT '',
      `comp` varchar(32) NOT NULL DEFAULT '',
      `rx_bytes` varchar(32) NOT NULL DEFAULT '',
      `tx_bytes` varchar(32) NOT NULL DEFAULT '',
      `rx_bytes_raw`  int(11) NOT NULL DEFAULT 0,
      `tx_bytes_raw`  int(11) NOT NULL DEFAULT 0,
      `rx_pkts`  int(11) NOT NULL DEFAULT 0,
      `tx_pkts`  int(11) NOT NULL DEFAULT 0,
      `inbound_if` varchar(32) NOT NULL DEFAULT '',
      `service_name` varchar(32) NOT NULL DEFAULT '',
      `rate_limit` varchar(32) NOT NULL DEFAULT '',
      `disconnect_flag` tinyint(1) NOT NULL DEFAULT '0',
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'wireguard_arrivals' and table_schema = DATABASE()) then
        CREATE TABLE `wireguard_arrivals` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `mac` varchar(255) NOT NULL,
      `vendor` varchar(255) DEFAULT NULL,
      `last_contact` datetime DEFAULT NULL,
      `last_contact_from_ip` varchar(30) NOT NULL DEFAULT '',
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;


alter table ap_profile_exits modify `type` enum('bridge','tagged_bridge','nat','captive_portal','openvpn_bridge','tagged_bridge_l3','pppoe_server') DEFAULT NULL; 
alter table mesh_exits modify `type` enum('bridge','tagged_bridge','nat','captive_portal','openvpn_bridge','tagged_bridge_l3','pppoe_server') DEFAULT NULL; 

if not exists (select * from information_schema.columns
    where table_name = 'mesh_exit_pppoe_servers' and table_schema = DATABASE()) then
        CREATE TABLE `mesh_exit_pppoe_servers` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `mesh_exit_id` int(11) NOT NULL,
      `wireguard_profile_id` int(11) NOT NULL,
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;
end if;

if not exists (select * from information_schema.columns
    where table_name = 'ap_profile_exit_wireguard_servers' and table_schema = DATABASE()) then
        CREATE TABLE `ap_profile_exit_wireguard_servers` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `ap_profile_exit_id` int(11) NOT NULL,
      `wireguard_profile_id` int(11) NOT NULL,
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;
end if;


end//

delimiter ;
call add_wireguard;



