
/*
 * grunt-todo
 * https://github.com/Leny/grunt-todo
 *
 * Copyright (c) 2014 leny
 * Licensed under the MIT license.
 */
"use strict";
var Parker, chalk;

chalk = require("chalk");

Parker = require("parker");

module.exports = function(grunt) {
  return grunt.registerMultiTask("parker", "Stylesheet analysis", function() {
    var aLogFileLines, aMetrics, error, i, len, oError, oMetric, oOptions, oParsedMetrics, oProjectPackage, parker, sDefaultTitle, sDescription, sHomePage, sMetric, sTitle, sVersion;
    oOptions = this.options({
      metrics: false,
      file: false,
      title: false,
      colophon: false,
      usePackage: false
    });
    aLogFileLines = [];
    sDefaultTitle = "Grunt Parker Report";
    if (grunt.util.kindOf(oOptions.metrics) === "array") {
      aMetrics = (function() {
        var i, len, ref, results;
        ref = oOptions.metrics;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          sMetric = ref[i];
          results.push(require("parker/metrics/" + sMetric + ".js"));
        }
        return results;
      })();
    } else {
      aMetrics = require("parker/metrics/All.js");
    }
    parker = new Parker(aMetrics);
    oParsedMetrics = {};
    for (i = 0, len = aMetrics.length; i < len; i++) {
      oMetric = aMetrics[i];
      oParsedMetrics[oMetric.id] = oMetric;
    }
    if (oOptions.usePackage) {
      try {
        oProjectPackage = grunt.file.readJSON((process.cwd()) + "/package.json");
      } catch (error) {
        oError = error;
        grunt.log.writeln("");
        grunt.log.writeln(chalk.yellow.bold("Oops:"), "No " + (chalk.cyan('package.json')) + " file found. Disabling " + (chalk.green('usePackage')) + " option.");
        oOptions.usePackage = false;
      }
    }
    if (oOptions.file) {
      if (sTitle = oOptions.title || (oOptions.usePackage && oProjectPackage.name ? oProjectPackage.name : false) || sDefaultTitle) {
        if (oOptions.usePackage) {
          if (sHomePage = oProjectPackage.homepage) {
            aLogFileLines.push("# [" + sTitle + "]( " + sHomePage + " )");
          } else {
            aLogFileLines.push("# " + sTitle);
          }
          aLogFileLines.push("");
          if (sVersion = oProjectPackage.version) {
            aLogFileLines.push("**Version:** `" + sVersion + "`");
            aLogFileLines.push("");
          }
          if (sDescription = oProjectPackage.description) {
            aLogFileLines.push("> " + sDescription);
            aLogFileLines.push("");
            aLogFileLines.push("* * *");
            aLogFileLines.push("");
          }
        } else {
          aLogFileLines.push("# " + sTitle);
          aLogFileLines.push("");
        }
        if (sTitle !== sDefaultTitle) {
          aLogFileLines.push("## Parker Report");
        }
      } else {
        aLogFileLines.push("# " + sDefaultTitle);
      }
      aLogFileLines.push("");
    }
    this.filesSrc.filter(function(sFilePath) {
      return grunt.file.exists(sFilePath) && grunt.file.isFile(sFilePath);
    }).forEach(function(sFilePath) {
      var aFileResults, aResult, aResults, j, len1, mValue, oParkerMetrics, sResult, sValue;
      aResults = [];
      aFileResults = [];
      oParkerMetrics = parker.run(grunt.file.read(sFilePath));
      if (oParkerMetrics) {
        for (sMetric in oParkerMetrics) {
          mValue = oParkerMetrics[sMetric];
          aResults.push([oParsedMetrics[sMetric].name, mValue]);
        }
        if (aResults.length) {
          if (!oOptions.file) {
            grunt.log.writeln();
            grunt.log.writeln(chalk.underline(sFilePath));
            grunt.log.writeln();
          }
          for (j = 0, len1 = aResults.length; j < len1; j++) {
            aResult = aResults[j];
            sValue = (function() {
              var k, l, len2, len3, ref, ref1, results;
              switch (grunt.util.kindOf(aResult[1])) {
                case "array":
                  if (!oOptions.file) {
                    grunt.log.writeln(chalk.cyan(aResult[0] + ":"));
                    ref = aResult[1];
                    for (k = 0, len2 = ref.length; k < len2; k++) {
                      sResult = ref[k];
                      grunt.log.writeln("\t" + sResult);
                    }
                  }
                  aFileResults.push("- **" + aResult[0] + ":**");
                  ref1 = aResult[1];
                  results = [];
                  for (l = 0, len3 = ref1.length; l < len3; l++) {
                    sResult = ref1[l];
                    if (sResult.substring(0, 1) === "#") {
                      sResult = "`" + sResult + "`";
                    }
                    results.push(aFileResults.push("\t- " + sResult));
                  }
                  return results;
                  break;
                case "number":
                  if (!oOptions.file) {
                    grunt.log.writeln(chalk.cyan(aResult[0] + ":"), chalk.yellow(aResult[1]));
                  }
                  return aFileResults.push("- **" + aResult[0] + ":** " + aResult[1]);
                default:
                  if (!oOptions.file) {
                    grunt.log.writeln(chalk.cyan(aResult[0] + ":"), aResult[1]);
                  }
                  return aFileResults.push("- **" + aResult[0] + ":** " + aResult[1]);
              }
            })();
          }
        }
      }
      if (oOptions.file && aFileResults.length) {
        aLogFileLines.push("### " + sFilePath);
        aLogFileLines.push("");
        aLogFileLines = aLogFileLines.concat(aFileResults);
        return aLogFileLines.push("");
      }
    });
    if (oOptions.file) {
      if (oOptions.colophon) {
        aLogFileLines.push("");
        aLogFileLines.push("* * *");
        aLogFileLines.push("");
        aLogFileLines.push("Last generated: " + (grunt.template.today()) + " by [grunt-parker](https://github.com/leny/grunt-parker).");
        aLogFileLines.push("");
      }
      grunt.file.write(oOptions.file, aLogFileLines.join("\n"));
      grunt.log.writeln();
      return grunt.log.writeln("Logged in " + (chalk.yellow(oOptions.file)));
    }
  });
};
