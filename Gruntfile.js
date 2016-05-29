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
        watch: {
            code: {
                files: ['Gruntfile.js', 'middleware/**/*', 'ui/**/*', 'webpack.config.js'],
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
    grunt.loadNpmTasks('grunt-webpack');
    grunt.registerTask('default', ['eslint', 'copy', 'webpack']);

};
