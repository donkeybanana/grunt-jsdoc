/**
 * @fileoverview This task helps you to run jsdoc3 to generate doc in your Grunt build sequence
 * @copyright Bertrand Chevrier 2012
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @license MIT
 *
 * @module tasks/jsdoc-plugin
 */

var path = require('path');
var exec = require('./lib/exec');

/**
 * Register the jsdoc task and helpers to Grunt
 * @type GruntTask
 * @constructor
 * @param {Object} grunt - the grunt context
 */
module.exports = function jsDocTask(grunt) {
    'use strict';

    var errorCode = {
        generic: 1,
        task: 3
    };

    var jsdocFlags = ['access', 'configure', 'destination', 'debug', 'encoding', 'help', 'match', 'nocolor', 'private', 'package', 'pedantic', 'query', 'recurse', 'readme', 'template', 'test', 'tutorials', 'version', 'verbose', 'explain'];


    //bind the task to the grunt context
    grunt.registerMultiTask('jsdoc', 'Generates source documentation using jsdoc', function registerJsdocTask() {

        var jsdoc;
        var child;
        var children;
        var params = {};
        var done = this.async();
        var next = function() {
            children--;
            if (children === 0) {
                done();
            }
        };
        var options = this.options({
            'private': true,
            'ignoreWarnings': false,
            'timeout': 60
        });


        var jsdocPath = this.data.jsdoc;

        //legacy configs
        if (options.config) {
            params.configure = options.config;
        }

        // Compute JSDoc flags from options
        jsdocFlags.forEach(function(flag) {
            if (typeof options[flag] !== 'undefined') {
                params[flag] = options[flag];
            }
        });

        if (jsdocPath && grunt.file.exists(jsdocPath) && grunt.file.isFile(jsdocPath)) {
            //use the given jsdoc path if set
            jsdoc = jsdocPath;
        } else {
            //lookup jsdoc
            jsdoc = exec.lookup(grunt);
        }

        //check if jsdoc npm module is installed
        if (jsdoc === undefined) {
            grunt.log.error('Unable to locate jsdoc');
            grunt.fail.warn('Wrong installation/environnement', errorCode.generic);
        }

        // convert jsdoc path to relative path
        jsdoc = path.relative('.', jsdoc);

        grunt.log.debug("Using jsdoc from : " + jsdoc);

        //check if there is sources to generate the doc for
        if (this.files.length === 0 && !params.configure) {
            grunt.log.error('No source files defined');
            grunt.fail.warn('Wrong configuration', errorCode.generic);
        }

        //check if jsdoc config file path is provided and does exist
        if (params.configure && !grunt.file.exists(params.configure)) {
            grunt.log.error('jsdoc config file path does not exist');
            grunt.fail.warn('Wrong configuration', errorCode.generic);
        }

        // Count child processes to be run
        children = this.files.length;
        // Loop over targets
        this.files.forEach(function(files){
            // Ensure destination exists
            if (!grunt.file.exists(files.dest)) {
                grunt.file.mkdir(files.dest);
                grunt.log.debug('create destination : ' + files.dest);
                if (!grunt.file.exists(files.dest)) {
                    grunt.log.error('unable to create documentation folder : ' + files.dest);
                    grunt.fail.warn('Wrong configuration', errorCode.generic);
                }
            }

            params.destination = files.dest;

            //execution of the jsdoc command
            child = exec.buildSpawned(grunt, jsdoc, files.src, params);

            child.stdout.on('data', grunt.log.debug);
            child.stderr.on('data', function(data) {
                if (!options.ignoreWarnings) {
                    grunt.log.error(data);
                }
            });
            child.on('exit', function(code) {
                if (code === 0) {
                    grunt.log.writeln('Documentation generated to ' + path.resolve(files.dest));
                } else {
                    grunt.fail.warn('jsdoc terminated with a non-zero exit code', errorCode.task);
                }

                next();
            });
        });
    });
};

