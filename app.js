const express = require('express');

const sequelize = require('./util/database');

const app = express();

sequelize
	// .sync({ force: true })
	.sync()
	.then(() => app.listen(process.env.PORT || 3000))
	.catch(err => console.log(err));