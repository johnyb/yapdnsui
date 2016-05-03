module.exports = function (grunt) {

    grunt.initConfig({
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

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.registerTask('default', ['eslint']);

};
