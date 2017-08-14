module.exports = (req, res, validator, cb) => {
    if (!validator(req.body)) {
        res.status(400);
        res.json({ errors: validator.errors });
    } else {
        cb();
    }
};
