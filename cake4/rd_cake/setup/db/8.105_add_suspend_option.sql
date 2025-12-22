drop procedure if exists add_admin_state;

delimiter //
create procedure add_admin_state()
begin

if not exists (select * from information_schema.columns
    where column_name = 'admin_state' and table_name = 'aps' and table_schema = DATABASE()) then
    alter table aps ADD COLUMN admin_state ENUM('active','suspended','inactive') NOT NULL DEFAULT 'active';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'admin_state' and table_name = 'ap_profile_exits' and table_schema = DATABASE()) then
    alter table ap_profile_exits ADD COLUMN admin_state ENUM('active','suspended','inactive') NOT NULL DEFAULT 'active';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'admin_state' and table_name = 'nodes' and table_schema = DATABASE()) then
    alter table nodes ADD COLUMN admin_state ENUM('active','suspended','inactive') NOT NULL DEFAULT 'active';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'admin_state' and table_name = 'mesh_exits' and table_schema = DATABASE()) then
    alter table mesh_exits ADD COLUMN admin_state ENUM('active','suspended','inactive') NOT NULL DEFAULT 'active';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'admin_state' and table_name = 'permanent_users' and table_schema = DATABASE()) then
    ALTER TABLE permanent_users ADD COLUMN admin_state ENUM('active', 'suspended', 'terminated', 'pending', 'expired', 'trial', 'locked') NOT NULL DEFAULT 'active' AFTER active;
    UPDATE permanent_users SET admin_state = 'active'    WHERE active = 1;
    UPDATE permanent_users SET admin_state = 'suspended' WHERE active = 0;
end if;


end//

delimiter ;
call add_admin_state;
