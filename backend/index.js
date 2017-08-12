const express = require('express');
const bodyParser = require('body-parser');

const log = require('./log');
const router = require('./router');
const config = require('./config');
const startDb = require('./db');

const app = express();

app.use(bodyParser.json());

function runApp() {
    router.route(app);
    app.listen(config.port, () => {
        log.info(`Example app listening on port ${config.port}`);
    });
}

startDb()
    .then(runApp)
    .catch(err => log.error(`Startup failed with error: ${err}`));
