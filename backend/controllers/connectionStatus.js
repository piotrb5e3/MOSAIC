const userCodeValidator = require('./validators').userCodeValidator;
const withValidator = require('./helpers/withValidator');
const withActiveConnection = require('./helpers/withActiveConnection');

module.exports = (req, res) => {
    withValidator(req, res, userCodeValidator, () => {
        withActiveConnection(req, res, req.body.code, () => {
            res.status(200);
            res.json({ active: true });
        }, () => {
            res.status(200);
            res.json({ active: false });
        });
    });
};
