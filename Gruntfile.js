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
                files: ['Gruntfile.js', 'middleware/**/*', 'ui/**/*'],
                tasks: ['default']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.registerTask('default', ['eslint', 'copy']);

};
