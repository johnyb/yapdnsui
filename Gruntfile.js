module.exports = function (grunt) {

    grunt.initConfig({
        clean: {
            public: {
                src: ['public/']
            }
        },
        copy: {
            ui: {
                files: [{
                    expand: true,
                    src: ['index.html'],
                    cwd: 'ui/',
                    filter: 'isFile',
                    dest: 'public/'
                }]
            }
        },
        eslint: {
            middleware: {
                files: [{
                    expand: true,
                    src: ['**/*.js'],
                    cwd: 'middleware/',
                    filter: 'isFile'
                }]
            },
            build: {
                files: [{
                    expand: true,
                    src: ['Gruntfile.js'],
                    filter: 'isFile'
                }]
            }
        },
        mochaTest: {
            middleware: {
                expand: true,
                src: ['**/*_spec.js'],
                cwd: 'spec/',
                filter: 'isFile'
            }
        },
        watch: {
            middleware: {
                files: ['Gruntfile.js', 'middleware/**/*', 'spec/middleware/**/*'],
                tasks: ['eslint', 'mochaTest']
            },
            ui: {
                files: ['Gruntfile.js', 'ui/**/*', 'webpack.config.js'],
                tasks: ['default']
            }
        },
        webpack: {
            ui: require('./webpack.config.js')
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.registerTask('default', ['eslint', 'copy', 'webpack']);

};
