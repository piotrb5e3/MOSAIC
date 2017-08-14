const express = require('express');
const bodyParser = require('body-parser');

const log = require('./logger');
const router = require('./router');
const config = require('./config');
const startDb = require('./db');
require('./mq/setup');

const app = express();

function runApp() {
    app.use(bodyParser.json());
    router.route(app);
    app.listen(config.port, () => {
        log.info(`Example app listening on port ${config.port}`);
    });
}

startDb()
    .then(runApp)
    .catch(err => log.error(`Startup failed with error: ${err}`));
