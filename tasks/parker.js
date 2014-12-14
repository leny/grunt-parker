
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
    var aLogFileLines, aMetrics, oError, oMetric, oOptions, oParsedMetrics, oProjectPackage, parker, sDefaultTitle, sDescription, sHomePage, sMetric, sTitle, sVersion, _i, _len;
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
        var _i, _len, _ref, _results;
        _ref = oOptions.metrics;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sMetric = _ref[_i];
          _results.push(require("../node_modules/parker/metrics/" + sMetric + ".js"));
        }
        return _results;
      })();
    } else {
      aMetrics = require("../node_modules/parker/metrics/All.js");
    }
    parker = new Parker(aMetrics);
    oParsedMetrics = {};
    for (_i = 0, _len = aMetrics.length; _i < _len; _i++) {
      oMetric = aMetrics[_i];
      oParsedMetrics[oMetric.id] = oMetric;
    }
    if (oOptions.usePackage) {
      try {
        oProjectPackage = grunt.file.readJSON("" + (process.cwd()) + "/package.json");
      } catch (_error) {
        oError = _error;
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
      var aFileResults, aResult, aResults, mValue, oParkerMetrics, sResult, sValue, _j, _len1;
      aResults = [];
      aFileResults = [];
      oParkerMetrics = parker.run(grunt.file.read(sFilePath));
      if (oParkerMetrics) {
        for (sMetric in oParkerMetrics) {
          mValue = oParkerMetrics[sMetric];
          aResults.push([oParsedMetrics[sMetric].name, mValue]);
        }
        if (aResults.length) {
          grunt.log.writeln();
          grunt.log.writeln(chalk.underline(sFilePath));
          grunt.log.writeln();
          for (_j = 0, _len1 = aResults.length; _j < _len1; _j++) {
            aResult = aResults[_j];
            sValue = (function() {
              var _k, _l, _len2, _len3, _ref, _ref1, _results;
              switch (grunt.util.kindOf(aResult[1])) {
                case "array":
                  grunt.log.writeln(chalk.cyan("" + aResult[0] + ":"));
                  _ref = aResult[1];
                  for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
                    sResult = _ref[_k];
                    grunt.log.writeln("\t" + sResult);
                  }
                  aFileResults.push("- **" + aResult[0] + ":**");
                  _ref1 = aResult[1];
                  _results = [];
                  for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
                    sResult = _ref1[_l];
                    if (sResult.substring(0, 1) === "#") {
                      sResult = "`" + sResult + "`";
                    }
                    _results.push(aFileResults.push("\t- " + sResult));
                  }
                  return _results;
                  break;
                case "number":
                  grunt.log.writeln(chalk.cyan("" + aResult[0] + ":"), chalk.yellow(aResult[1]));
                  return aFileResults.push("- **" + aResult[0] + ":** " + aResult[1]);
                default:
                  grunt.log.writeln(chalk.cyan("" + aResult[0] + ":"), aResult[1]);
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
