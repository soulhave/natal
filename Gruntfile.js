/// <vs AfterBuild='debug' />

module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    var _ = require('lodash');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets: grunt.file.readJSON('assetsfiles.json'),
        clean: {
            build: ['build/*'],
            assets: ['assets/libs', 'assets/css/*', 'assets/fonts', '!assets/css/app.css']
        },
        copy: {
            assets: {
                files: '<%= assets.files %>'
            },
            buildmin: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.*', '!**/*.js', '!**/*.css', '!**/*.tpl.*', '!**/env/*.json', '**/env/*-env.json'], // Discard uglified files, template files and json environment parameters
                    dest: 'build/app/',
                }, {
                    expand: true,
                    cwd: 'assets/',
                    src: ['**/*.*', '!**/*.js', '!**/*.css'],
                    dest: 'build/assets/',
                }, {
                    expand: true,
                    src: ['favicon.ico', 'index.html', 'main.tpl.js', 'version.tpl.json'],
                    dest: 'build/',
                    rename: function(dest, src) {
                        return dest + src.replace('.tpl', '');
                    }
                }]
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.*', '!**/*.tpl.*', '!**/env/*.json', '**/env/*-env.json'], // Discard uglified files, template files and json environment parameters
                    dest: 'build/app/',
                }, {
                    expand: true,
                    cwd: 'assets/',
                    src: ['**/*.*'],
                    dest: 'build/assets/',
                }, {
                    expand: true,
                    src: ['favicon.ico', 'index.html', 'main.tpl.js', 'version.tpl.json'], //Copy necessary files from root
                    dest: 'build/',
                    rename: function(dest, src) {
                        return dest + src.replace('.tpl', '');
                    },
                }]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> | Copyright (c) <%= grunt.template.today("yyyy-mm-dd") %> by CI&T */\n'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.js', '!**/*.tpl.*'],
                    dest: 'build/app/',
                    ext: '.js'
                }, {
                    expand: true,
                    cwd: 'assets/',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: 'build/assets/',
                    ext: '.js'
                }, {
                    'build/main.js': ['main.tpl.js']
                }]
            }
        },
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: 'build/app/',
                    ext: '.css'
                }, {
                    expand: true,
                    cwd: 'assets/',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: 'build/assets/',
                    ext: '.css'
                }]
            }
        },
        replace: {
            main: {
                options: {
                    patterns: [{
                        match: ".js'",
                        replacement: "'",
                    }, ],
                    usePrefix: false,
                },
                files: [{
                    src: 'main.tpl.js',
                    dest: 'main.js'
                }, ]
            },
            mainbuild: {
                options: {
                    patterns: [{
                        match: ".js'",
                        replacement: "'",
                    }, ],
                    usePrefix: false,
                },
                files: [{
                    src: "build/main.*.js",
                    dest: "<%= grunt.filerev.summary['build\\\\main\\\.js'].replace(/\\\\/g, '\/') %>"
                }]
            },
            environment: {
                options: {
                    patterns: [{
                        yaml: "<%= grunt.option(grunt.task.current.args[0] + 'JSON') %>"
                    }] // Json string of environment settings (json must have same properties then the template)
                },
                files: [{
                    src: ['app/<%= grunt.task.current.args[0] %>/env/<%= grunt.task.current.args[0] %>-env.tpl.json'], // template with parameter @@ with same name of property.
                    dest: 'app/<%= grunt.task.current.args[0] %>/env/<%= grunt.task.current.args[0] %>-env.json'
                }]
            },
            version: {
                options: {
                    patterns: [{
                        match: 'mapping',
                        // Insert file mapping with '/' as directory separator and breakline
                        replacement: "<%= JSON.stringify(grunt.filerev.summary).replace(/\\\\\\\\/g, '\/').replace(/,/g, ',\\n').replace(/\"build\\//g, '\"') %>",
                    }, {
                        match: 'version',
                        replacement: "<%= grunt.task.current.args.length ? grunt.task.current.args[0] : pkg.version %>" // ToDo Versioning
                    }]
                },
                files: [{
                    src: ['version.tpl.json'],
                    dest: "<%= grunt.filerev.summary['build\\\\version\\\.json'].replace(/\\\\/g, '\/') %>"
                }]
            },
            versiondevelop: {
                options: {
                    patterns: [{
                        match: 'mapping',
                        replacement: "{}",
                    }, {
                        match: 'version',
                        replacement: "<%= grunt.task.current.args.length ? grunt.task.current.args[0] : pkg.version %>" // ToDo Versioning
                    }]
                },
                files: [{
                    src: ['version.tpl.json'],
                    dest: 'version.json'
                }]
            }
        },
        prompt: {
            target: {
                options: {
                    questions: [{
                        config: 'environment', // name of config property
                        type: 'list', // list, checkbox, confirm, input, password
                        message: 'Choice an environment to build',
                        default: 'develop', // default value if nothing is entered
                        choices: [{
                            name: "develop",
                            value: 'develop'
                        }, {
                            name: "release",
                            value: 'release'
                        }, {
                            name: "master",
                            value: 'master'
                        }],
                    }]
                }
            },
        },
        filerev: {
            options: {
                algorithm: 'md5',
                length: 16
            },
            sources: {
                src: ['build/**/*.*', '!build/version.json', '!build/index.html', '!build/**/angular-locale*.js']
            }
        },
        filerev_apply_cit: {
            options: {
                prefix: ['build', 'assets'],
                unixfyPath: true,
            },
            files: {
                expand: true,
                cwd: 'build/',
                src: ['**/*.{html,css,js}'],
                dest: 'build',
            }
        },
        jshint: {
            options: {
                globalstrict: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                strict: true,
                newcap: false,
                globals: {
                    jQuery: true,
                    angular: false,
                    "$": false,
                    "_": false,
                    "jd": false,
                    "define": false,
                    "console": false,
                    "moment": false
                },
            },
            allFiles: [
                'Gruntfile.js',
                'app/**/*.js',
            ]
        },


        'http-server': {

            'dev': {
                root: './',
                port: 8080,
                showDir: true,
                autoIndex: true,
                ext: "html",
                runInBackground: true,
                logFn: function(req, res, error) {},
                openBrowser: false

            }

        },

        watch: {
            all: {
                files: ['app/**/*'],
                options: {
                    livereload: true,
                },
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-http-server');

    // Main tasks for each environment
    grunt.registerTask('develop', ['execute:develop']);
    grunt.registerTask('release', ['execute:release']);
    grunt.registerTask('master', ['execute:master']);
    grunt.registerTask('live-my', ['http-server','watch']);

    // Task Default, prompt user for parameters
    grunt.registerTask('default', 'Default Task', function() {
        grunt.task.run('prompt:target');
        grunt.task.run('execute');
    });

    // Main task with environment as parameter
    grunt.registerTask('execute', 'Default Task', function(env) {
        // If not passed as parameter, use environment from prompt
        if (!env) {
            env = grunt.config('environment');
        }

        grunt.task.run('jshint');
        grunt.task.run('assets'); // Copy needed assets from bower
        grunt.task.run('set-environment:' + env);

        // Build version 
        if (env === 'develop') {
            grunt.task.run('build-develop');
        } else
        if (env !== 'master') {
            grunt.task.run('build');
        } else {
            grunt.task.run('build-min');
        }
    });

    // Task responsible for prepare and replace scripts to develop mode
    grunt.registerTask('build-develop', ['replace:main', 'replace:versiondevelop']);

    grunt.registerTask('cache-bust', ['filerev', 'filerev_apply_cit', 'replace:version', 'replace:mainbuild']);

    // Task responsible for create the build folder without minify
    grunt.registerTask('build', ['clean:build', 'copy:build', 'cache-bust']);

    // Task responsible for create the build folder with minify
    grunt.registerTask('build-min', ['clean:build', 'uglify', 'cssmin', 'copy:buildmin', 'cache-bust']);

    // Task responsible for create assets folder
    grunt.registerTask('assets', ['clean:assets', 'copy:assets']);

    // Task responsible for set configurations of environments
    grunt.registerTask('set-environment', 'Set configurations for environment', function(env) {

        grunt.log.writeln('Setting configurations for environment: ' + env);

        // Get modules from folders inside "./app/"
        var modules = getModules();

        //Set environment for each module
        for (var i = 0; i < Object.keys(modules).length; i++) {

            var json = grunt.file.readJSON('app/' + modules[i] + '/env/' + modules[i] + '-env.' + env + '.json');

            grunt.option(modules[i] + 'JSON', JSON.stringify(json));
            grunt.task.run('replace:environment:' + modules[i]);
        }
    });

    grunt.registerMultiTask('filerev_apply_cit', 'Applies the filename changes in grunt.filerev.summary', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            prefix: [''],
            unixfyPath: false,
        });

        var summary = {};
        _.each(grunt.filerev.summary, function(value, key) {
            summary[applyPathOptions(key)] = applyPathOptions(value);
        });

        function applyPathOptions(value) {
            var result = options.unixfyPath ? value.replace(/\\/g, '/') : value;
            options.prefix.forEach(function(element) {
                result = result.replace(element, '');
            });
            result = result.replace(/^\/+/g, '');
            return result;
        }

        var pattern = new RegExp('(' + _.keys(summary).join(')|(') + ')', 'gi');

        var replacer = function(match, offset) {
            // If no replacement is defined for the match, simply return the match
            return summary[match] || match;
        };

        // Iterate over all specified file groups.
        this.files.forEach(function(file) {
            var contents = file.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                return grunt.file.read(filepath);
            }).join('');

            var revved = contents.replace(pattern, replacer);
            grunt.file.write(file.dest, revved);
        });
    });

    // Get modules from directories inside ./app/ folder
    function getModules() {
        var fs = require('fs'),
            path = require('path');
        return fs.readdirSync('./app').filter(function(file) {
            return fs.statSync(path.join('./app', file)).isDirectory();
        });
    }
};