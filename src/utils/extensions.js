'use strict';

var mt;
try {
    mt = require('media-tools-lib');
} catch (ex) {

};

module.exports = {
    getCanceled : getCanceled,
    isEmpty     : isEmpty,
    isValid     : isValid,
    normalize   : normalize
};

function getCanceled(options) {
    if (!mt) { return null; }
    var result = [];
    mt.VALID_EXTENSIONS.array.forEach(e => {
        if (options[e] === false) {
            result.push(e);
        }
    });
    return result;
}
function isEmpty(values) {
    if (!mt) { return null; }
    if (typeof values === 'string') {
        values = values.split(mt._.primatives.files.DEFAULT_DELIMITER);
    }
    if (typeof values !== 'object' || !(values instanceof Array)) {
        return false;
    }
    return (mt._.primatives.arrays.removeEmpty(values).length < 1);
}
function isValid(values) {
    if (!mt) { return null; }
    
    if (isEmpty(values)) { return true; }
    if (typeof values === 'string') {
        values = values.split(mt._.primatives.files.DEFAULT_DELIMITER);
    }
    if (typeof values !== 'object') { return false; }
    if (!(values instanceof Array)) { return false; }
    
    var items = [];
    values.forEach(function(v){
        var item = mt._.primatives.files.cleanExtension(v);
        if (item.length > 0) { items.push(item); }
    });
    items = items.filter(function(ext){
        return (mt.VALID_EXTENSIONS.indexOf(ext.toLowerCase()) >= 0);
    });

    return (items.length === values.length);
}
function normalize(options) {
    if (!mt) { return null; }
    
    var included = mt._.primatives.files.toExtensionArray(options.include);
    var excluded = mt._.primatives.files.toExtensionArray(options.exclude);
    var canceled = mt.VALID_EXTENSIONS.filter(function(ext){
        return (options[ext] === false);
    });
    
    if (included.length < 1) { included = mt.VALID_EXTENSIONS; }
    
    included = mt._.primatives.arrays.remove(included, excluded);
    included = mt._.primatives.arrays.remove(included, canceled);

    return included;
}
