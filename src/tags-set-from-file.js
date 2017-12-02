#!/usr/bin/env node

'use strict';

var _       = require('./utils');
var log     = console.log;

const error     = _.colors.error;
const warn      = _.colors.orange;
const success   = _.colors.green;
const info      = _.colors.white;

var lib;

try {
    lib = require('media-tools-lib');
} catch (ex) {

};

const program = require('commander');

program
    .version('0.0.0')
    .usage('[options] <path>')
    .description('clears updatable tags from media files')
    .option('-l, --log-path <path>', 'logging folder (default: ./.logs')
    .option('-x, --exclude [extensions]', 'file extensions to exclude')
    .option('-i, --include [extensions]', 'file extensions to include')
    .option('--no-asf', 'ignore ASF files')
    .option('--no-avi', 'ignore AVI files')
    .option('--no-flv', 'ignore FLV files')
    .option('--no-mp3', 'ignore MP3 files')
    .option('--no-mp4', 'ignore MP4 files')
    .option('--no-m4a', 'ignore M4A files')
    .option('--no-wma', 'ignore M4A files')
    .option('--no-wmv', 'ignore WMV files')
    .action(function(root, options){

        if (!lib) {  
            log(error('media-tools-lib is not installed ... quitting')); 
        } else {

            var exts = _.extensions.normalize(options);
            
            if (options.include && !_.extensions.isValid(options.include)) {
                log(error('included extensions contains invalid values ... quitting')); 
            }
            else if (options.exclude && !_.extensions.isValid(options.exclude)) {
                log(error('excluded extensions contains invalid values ... quitting')); 
            }
            else if (exts.length < 1 && !_.extensions.isEmpty(options.include) && !_.extensions.isEmpty(options.exclude)) {
                log(error('exclusions canceled all options ... quitting')); 
            } else {

                var e = [];
                exts.forEach(ext => {
                    if (e.indexOf('*.' + ext.toLowerCase()) < 0) {
                        e.push('*.' + ext.toLowerCase());
                    }
                });

                lib.actions.addTagFromFileName.process(root, e, function(err, results){
                    if (err) { error(err); }
                    else { 

                        var color = _.colors.getColor(results);

                        log(color('Process complete.'));

                        log(color(' > ELIGIBLE: %s'), results.found.length);
                        if (results.failures.invalidName.length > 0) {
                            log(color(' > SKIPPED : %s (%s)'), results.failures.invalidName.length, 'name not available in file');
                        }
                        if (results.failures.metaRead.length > 0) {
                            log(color(' > FAILED  : %s (%s)'), results.failures.metaRead.length, 'err reading meta');
                        }
                        if (results.failures.metaEmpty.length > 0) {
                            log(color(' > FAILED  : %s (%s)'), results.failures.metaEmpty.length, 'no meta data');
                        }
                        if (results.failures.metaWrite.length > 0) {
                            log(color(' > FAILED  : %s (%s)'), results.failures.metaWrite.length, 'meta data not written');
                        }
                        if (results.skipped.length > 0) {
                            log(color(' > SKIPPED : %s (%s)'), results.skipped.length, 'not needed - already set');
                        }
                        if (results.success.length > 0) {
                            log(color(' > SUCCESS : %s'), results.success.length);                        
                        }
                    }
                });
            }
        }
    })
    .parse(process.argv);

if (!program.args || program.args.length < 1) { 
    program.help();
}

