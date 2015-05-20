module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // uglify: {
        //     my_target: {
        //         files: {
        //             "./public/js/vendor/textext.min.js": ["./public/js/vendor/textext/*.js"]
        //         }
        //     }
        // },

        stylus: {
            compile: {
                options: {
                    compress: true
                },
                files: {
                    "./public/css/main.min.css": ["./app/views/stylus/main.styl"]
                }
            }
        },

        watch: {
            scripts: {
                options: {
                    livereload: true,
                    spawn: false,
                    run: true
                },
                tasks: ["react", "copy", "stylus"],
                files: [
                    "app/**/**/**"
                ]
            }
        },

        copy: {
            build: {
                files: [

                    {
                        expand: true,
                        cwd: "./app/views/app/portal",
                        src: ["**/*.js"],
                        dest: "./public/js/lib/portal",
                        flatten: true,
                        filter: "isFile"
                    },

                    {
                        expand: true,
                        cwd: "./app/views/app/default",
                        src: ["**/*.js"],
                        dest: "./public/js/lib",
                        flatten: false,
                        filter: "isFile"
                    }

                ]
            }
        },

        react: {
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: "./app/views/jsx",
                        src: ["**/*.jsx"],
                        dest: "./public/js/lib/jsx",
                        ext: ".js"
                    }
                ]
            }
        }
    });

    // grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-stylus");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-react");

    // grunt.registerTask("default", ["stylus", "uglify", "copy", "watch", "react"]);
    grunt.registerTask("default", ["watch", "react", "copy", "stylus"]);

};
