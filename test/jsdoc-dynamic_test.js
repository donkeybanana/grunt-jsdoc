var testCase = require('./task');
testCase.setUp = function(done){
    this.destination = 'doc/dynamic';
    this.expectedFiles = [
        'index.html',
        'jsdoc-plugin.js.html',
        'module-tasks_jsdoc-plugin.html',
        'lib/exec.js.html',
        'lib/index.html',
        'lib/module-exec.html'
    ];
    done();
};

exports.JsDocDynamicTest = testCase;
