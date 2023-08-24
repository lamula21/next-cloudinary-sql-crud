// create connection to MYSQL

import mysql from 'serverless-mysql'

export const connection = mysql({
	config: {
		host: 'localhost',
		user: 'root',
		password: 'Starcraft14.',
		port: 3306,
		database: 'nextmysqlcrud',
	},
})
