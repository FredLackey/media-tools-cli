var chalk       = require('chalk');

const error     = chalk.bold.red;
const warn      = chalk.orange;
const success   = chalk.green;
const info      = chalk.white;

module.exports = {
    error   : error,
    warn    : warn,
    success : success,
    info    : info,

    getColor    : getColor
}

function getColor(res) {
    if (!hasFound(res)) { return info; }
    if (res.skipped.length === res.found.length) { return success; }
    if (hasErrors(res)) {
        if (hasSuccess(res) || hasSkipped(res)) { return warn; }
        return error;
    }
    return success;
}

function hasSuccess(res){
    return (res.success.length || (res.found.length === res.skipped.length));
}
function hasFound(res) {
    return (res.found.length > 0);
}
function hasSkipped(res) {
    return (res.skipped.length > 0);
}
function hasErrors(res) {
    return (res.failures.invalidName.length > 0 ||
        res.failures.metaRead.length > 0 ||
        res.failures.metaEmpty.length > 0 ||
        res.failures.metaWrite.length > 0);
}