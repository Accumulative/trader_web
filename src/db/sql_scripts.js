exports.check_trades_exists_sql = `select count(*) as table_no from information_schema.tables where table_schema = 'main';`

exports.create_trades_sql = `CREATE TABLE IF NOT EXISTS  trades
(
				id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
				open_price DECIMAL(10) NOT NULL,
				close_price DECIMAL(10),
				buy TINYINT(1) NOT NULL,
				open_date DATETIME NOT NULL,
				close_date DATETIME
);`

exports.create_parameters_sql = `CREATE TABLE IF NOT EXISTS  parameters
(
				id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
				name varchar(50) NOT NULL,
				value varchar(50),
				prev_val varchar(50),
				active TINYINT(1) NOT NULL,
				UNIQUE KEY param_name (name)
);`

exports.create_predictions_sql = `CREATE TABLE IF NOT EXISTS predictions
(
				id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
				value DECIMAL(10) NOT NULL,
				prev_val DECIMAL(10),
				type TINYINT(1) NOT NULL,
				pred_date DATETIME NOT NULL,
				UNIQUE KEY pred_key (type, pred_date)
);`