module.exports = function (grunt) {

    grunt.initConfig({
        copy: {
            ui: {
                files: [{
                    expand: true,
                    src: ['*/*.*'],
                    filter: 'isFile',
                    cwd: 'ui/',
                    dest: 'public/'
                }]
            }
        },
        eslint: {
            all: {
                files: [{
                    expand: true,
                    src: ['Gruntfile.js', 'app.js', 'routes/**/*.js', 'libs/**/*.js'],
                    filter: 'isFile'
                }]
            }
        },
        watch: {
            code: {
                files: ['Gruntfile.js', 'app.js', 'routes/**/*.js', 'libs/**/*.js'],
                tasks: ['default']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.registerTask('default', ['eslint', 'copy']);

};
