const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const AdminResource = require('./resources/AdminResource');
const JobsResource = require('./resources/JobsResource');
const BalanceResource = require('./resources/BalanceResource');
const ContractsResource = require('./resources/ContractsResource');

app.use('/jobs', JobsResource);
app.use('/balances', BalanceResource);
app.use('/contracts', ContractsResource);
app.use('/admin', AdminResource);

module.exports = app;
