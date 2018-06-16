exports.check_trades_exists_sql = `SELECT 1 FROM trades LIMIT 1;`

exports.create_trades_sql = `CREATE TABLE trades
(
				id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
				open_price DECIMAL(10) NOT NULL,
				close_price DECIMAL(10),
				buy TINYINT(1) NOT NULL,
				open_date DATETIME NOT NULL,
				close_date DATETIME
);`

exports.create_parameters_sql = `CREATE TABLE parameters
(
				id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
				name varchar(50) NOT NULL,
				value varchar(50),
				prev_val varchar(50),
				active TINYINT(1) NOT NULL,
				UNIQUE KEY param_name (name)
);`