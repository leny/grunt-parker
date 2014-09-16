###
 * grunt-parker
 * https://github.com/leny/grunt-parker
 *
 * Copyright (c) 2014 leny
 * Licensed under the MIT license.
###

"use strict"

module.exports = ( grunt ) ->

    require( "matchdep" ).filterDev( "grunt-*" ).forEach grunt.loadNpmTasks

    grunt.initConfig
        coffeelint:
            options:
                arrow_spacing:
                    level: "error"
                camel_case_classes:
                    level: "error"
                duplicate_key:
                    level: "error"
                indentation:
                    level: "ignore"
                max_line_length:
                    level: "ignore"
                no_backticks:
                    level: "error"
                no_empty_param_list:
                    level: "error"
                no_stand_alone_at:
                    level: "error"
                no_tabs:
                    level: "error"
                no_throwing_strings:
                    level: "error"
                no_trailing_semicolons:
                    level: "error"
                no_unnecessary_fat_arrows:
                    level: "error"
                space_operators:
                    level: "error"
            task:
                files:
                    src: [ "src/*.coffee" ]
        coffee:
            options:
                bare: yes
            task:
                files:
                    "tasks/parker.js": "src/parker.coffee"
        parker:
            default:
                src: [ "test/*.css" ]
            custom:
                options:
                    metrics: [
                        "TotalRules"
                        "TotalSelectors"
                        "TotalIdentifiers"
                        "TotalDeclarations"
                    ]
                    file: "report.md"
                    colophon: yes
                    usePackage: yes
                src: [ "test/*.css" ]

    grunt.loadTasks "tasks"

    grunt.registerTask "default", [
        "coffeelint"
        "coffee"
        "parker"
    ]

    grunt.registerTask "build", [
        "coffeelint"
        "coffee"
    ]

    grunt.registerTask "test", [
        "clean"
        "parker"
    ]
