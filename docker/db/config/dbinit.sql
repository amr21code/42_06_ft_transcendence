-- set root password
UPDATE mysql.user SET Password=PASSWORD('start123') WHERE User='root';
UPDATE mysql.user SET plugin = '' WHERE user = 'root';
-- create db user for WP
CREATE USER IF NOT EXISTS 'wp'@'%';
UPDATE mysql.user SET Password=PASSWORD('dbpass') WHERE User='wp';
GRANT ALL ON wordpress.* TO 'wp'@'%';
FLUSH PRIVILEGES;

-- USE wordpress;