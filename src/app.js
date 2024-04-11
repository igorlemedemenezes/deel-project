const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const ContractsResource = require('./resources/ContractsResource');
const JobsResource = require('./resources/JobsResource');
const BalanceResource = require('./resources/BalanceResource');

app.use('/jobs', JobsResource);
app.use('/balances', BalanceResource);
app.use('/contracts', ContractsResource);

module.exports = app;
