exports.check_trades_exists_sql = `select count(*) as table_no from information_schema.tables where table_schema = 'main';`

exports.create_trades_sql = `CREATE TABLE IF NOT EXISTS  trades
(
				id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
				open_price DECIMAL(10,4) NOT NULL,
				close_price DECIMAL(10,4),
				amount DECIMAL(10,6),
				open_date DATETIME NOT NULL,
				close_date DATETIME,
				fee DECIMAL(10,4) DEFAULT 0 NULL
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
				value DECIMAL(10,4) NOT NULL,
				prev_val DECIMAL(10,4),
				type TINYINT(1) NOT NULL,
				pred_date DATETIME NOT NULL,
				UNIQUE KEY pred_key (type, pred_date)
);`

exports.create_statistics_sql = `CREATE TABLE IF NOT EXISTS statistics
(
				id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
				name varchar(50) NOT NULL,
				value DECIMAL(10,4) NOT NULL,
				UNIQUE KEY statistics_key (name)
);`