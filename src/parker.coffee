###
 * grunt-todo
 * https://github.com/Leny/grunt-todo
 *
 * Copyright (c) 2014 leny
 * Licensed under the MIT license.
###

"use strict"

chalk = require "chalk"
Parker = require "parker"

module.exports = ( grunt ) ->

    grunt.registerMultiTask "parker", "Stylesheet analysis", ->
        oOptions = @options
            metrics: no
            file: no
            title: no
            colophon: no
            usePackage: no
        aLogFileLines = []
        sDefaultTitle = "Grunt Parker Report"

        if grunt.util.kindOf( oOptions.metrics ) is "array"
            aMetrics = ( require "../node_modules/parker/metrics/#{ sMetric }.js" for sMetric in oOptions.metrics )
        else
            aMetrics = require "../node_modules/parker/metrics/All.js"

        parker = new Parker aMetrics

        oParsedMetrics = {}
        oParsedMetrics[ oMetric.id ] = oMetric for oMetric in aMetrics

        if oOptions.usePackage
            try
                oProjectPackage = grunt.file.readJSON "#{ process.cwd() }/package.json"
            catch oError
                grunt.log.writeln ""
                grunt.log.writeln chalk.yellow.bold( "Oops:" ), "No #{ chalk.cyan( 'package.json' ) } file found. Disabling #{ chalk.green( 'usePackage' ) } option."
                oOptions.usePackage = no

        if oOptions.file
            if sTitle = ( oOptions.title or ( if oOptions.usePackage and oProjectPackage.name then oProjectPackage.name else no ) or sDefaultTitle )
                if oOptions.usePackage
                    if sHomePage = oProjectPackage.homepage
                        aLogFileLines.push "# [#{ sTitle }]( #{ sHomePage } )"
                    else
                        aLogFileLines.push "# #{ sTitle }"
                    aLogFileLines.push ""
                    if sVersion = oProjectPackage.version
                        aLogFileLines.push "**Version:** `#{ sVersion }`"
                        aLogFileLines.push ""
                    if sDescription = oProjectPackage.description
                        aLogFileLines.push "> #{ sDescription }"
                        aLogFileLines.push ""
                        aLogFileLines.push "* * *"
                        aLogFileLines.push ""
                else
                    aLogFileLines.push "# #{ sTitle }"
                    aLogFileLines.push ""
                aLogFileLines.push "## Parker Report" unless sTitle is sDefaultTitle
            else
                aLogFileLines.push "# #{ sDefaultTitle }"
            aLogFileLines.push ""

        @filesSrc
            .filter ( sFilePath ) ->
                grunt.file.exists( sFilePath ) and grunt.file.isFile( sFilePath )
            .forEach ( sFilePath ) ->
                aResults = []
                aFileResults = []
                oParkerMetrics = parker.run grunt.file.read sFilePath

                if oParkerMetrics
                    for sMetric, mValue of oParkerMetrics
                        aResults.push [
                            oParsedMetrics[ sMetric ].name
                            mValue
                        ]

                    if aResults.length
                        grunt.log.writeln()
                        grunt.log.writeln chalk.underline sFilePath
                        grunt.log.writeln()
                        for aResult in aResults
                            sValue = switch grunt.util.kindOf aResult[ 1 ]
                                when "array"
                                    grunt.log.writeln chalk.cyan( "#{ aResult[ 0 ] }:" )
                                    grunt.log.writeln "\t#{ sResult }" for sResult in aResult[ 1 ]
                                    aFileResults.push "- **#{ aResult[ 0 ] }:**"
                                    for sResult in aResult[ 1 ]
                                        if sResult.substring( 0, 1 ) is "#"
                                            sResult = "`#{ sResult }`"
                                        aFileResults.push "\t- #{ sResult }"
                                when "number"
                                    grunt.log.writeln chalk.cyan( "#{ aResult[ 0 ] }:" ), chalk.yellow aResult[ 1 ]
                                    aFileResults.push "- **#{ aResult[ 0 ] }:** #{ aResult[ 1 ] }"
                                else
                                    grunt.log.writeln chalk.cyan( "#{ aResult[ 0 ] }:" ), aResult[ 1 ]
                                    aFileResults.push "- **#{ aResult[ 0 ] }:** #{ aResult[ 1 ] }"

                if oOptions.file and aFileResults.length
                    aLogFileLines.push "### #{ sFilePath }"
                    aLogFileLines.push ""
                    aLogFileLines = aLogFileLines.concat aFileResults
                    aLogFileLines.push ""

        if oOptions.file

            if oOptions.colophon
                aLogFileLines.push ""
                aLogFileLines.push "* * *"
                aLogFileLines.push ""
                aLogFileLines.push "Last generated: #{ grunt.template.today() } by [grunt-parker](https://github.com/leny/grunt-parker)."
                aLogFileLines.push ""

            grunt.file.write oOptions.file, aLogFileLines.join "\n"
            grunt.log.writeln()
            grunt.log.writeln "Logged in #{ chalk.yellow( oOptions.file ) }"
