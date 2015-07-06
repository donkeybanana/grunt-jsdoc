module.exports = function(grunt) {
    'use strict';

    var path = require('path');

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        clean: ['doc'],
        jsdoc: {
            basic: {
                src: ['tasks/**.js', 'tasks/lib/*.js'],
                options: {
                    destination: 'doc/basic'
                }
            },
            alternate: {
                src: ['tasks'],
                dest : 'doc/alternate',
                options: {
                    readme : 'README.md',
                    recurse : true,
                    private : false
                }
            },
            dynamic: {
                files: [{
                    expand: true,
                    src: [
                        'tasks/lib/*.js',
                        'tasks/*.js'
                    ],
                    dest: 'doc/dynamic',
                    rename: function(dest, src){
                        var parts = src.split('/');
                            parts.pop();
                            parts.shift();
                            parts.unshift(dest);

                        return path.join.apply(null, parts);
                    }
                }]
            },
            spacepack: {
                src: ['tasks/**/*.js'],
                options: {
                    destination: 'doc/pack age',
                    package: 'package.json'
                }
            },
            docstrap: {
                src: ['tasks/**.js', 'tasks/lib/*.js', 'README.md'],
                options: {
                    destination: 'doc/docstrap',
                    template: "node_modules/ink-docstrap/template",
                    configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        },
        nodeunit: {
            unit: ['test/jsdoc-plugin_test.js'],
            basic: ['test/jsdoc-basic_test.js'],
            alternate: ['test/jsdoc-alternate_test.js'],
            dynamic: ['test/jsdoc-dynamic_test.js'],
            docstrap: ['test/jsdoc-docstrap_test.js'],
            spacepack: ['test/jsdoc-spacepack_test.js']
        },
        jshint: {
            files: ['Gruntfile.js', 'tasks/*.js', 'tasks/lib/*.js', 'test/*.js'],
            options: {
                node: true,
                smarttabs: true
            }
        }
    });

    // Load local tasks.
    grunt.loadTasks('tasks');


    //testing tasks
    grunt.registerTask('default', 'Default task will lint and test', ['jshint', 'test']);
    grunt.registerTask('test-basic', 'Test basic jsdoc', ['jsdoc:basic', 'nodeunit:basic']);
    grunt.registerTask('test-alternate', 'Test jsdoc with alternate options', ['jsdoc:alternate', 'nodeunit:alternate']);
    grunt.registerTask('test-dynamic', 'Test jsdoc with dynamic options', ['jsdoc:dynamic', 'nodeunit:dynamic']);
    grunt.registerTask('test-docstrap', 'Test jsdoc with a template', ['jsdoc:docstrap', 'nodeunit:docstrap']);
    grunt.registerTask('test-spacepack', 'Test jsdoc with a package and spaces in the paths', ['jsdoc:spacepack', 'nodeunit:spacepack']);
    grunt.registerTask('test', 'Full test suite', ['clean', 'nodeunit:unit', 'test-basic', 'test-alternate', 'test-dynamic', 'test-docstrap', 'test-spacepack']);

};

