# grunt-parker

![NPM version](http://img.shields.io/npm/v/grunt-parker.svg) ![Dependency Status](https://david-dm.org/leny/grunt-parker.svg) ![Downloads counter](http://img.shields.io/npm/dm/grunt-parker.svg)

> Grunt plugin for [parker](https://github.com/katiefenn/parker), a stylesheet analysis tool.

* * *

## Getting Started

This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-parker --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-parker');
```

## The "parker" task

### Overview
In your project's Gruntfile, add a section named `parker` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  parker: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.metrics

Type: `Array` (metric names)  
Default value: `false`

An array of the metrics to use in parker.  
By default, grunt-parker use all available metrics.

By now, grunt-parker accepts the following metrics :

- `TotalStylesheets`
- `TotalStylesheetSize`
- `TotalRules`
- `TotalSelectors`
- `TotalIdentifiers`
- `TotalDeclarations`
- `SelectorsPerRule`
- `IdentifiersPerSelector`
- `SpecificityPerSelector`
- `TopSelectorSpecificity`
- `TopSelectorSpecificitySelector`
- `TotalIdSelectors`
- `TotalUniqueColours`
- `UniqueColours`
- `TotalImportantKeywords`
- `TotalMediaQueries`
- `MediaQueries`

#### options.file

Type: `String` (file path)  
Default value: `false`

A file path to log the reported results, in *markdown* format.  
If `false` is given, the file will not be written.

#### options.title

Type: `String`  
Default value: `Grunt Parker Report`

When logging the reported results to file, use this as title of the markdown document.

#### options.colophon

Type: `Boolean`  
Default value: `false`

When logging the reported results to file, use colophon and timestamp as footer of the markdown document.

#### options.usePackage

Type: `Boolean`  
Default value: `false`

When enabled, if you launch your grunt-packer task from a folder containing a `package.json` file (like 99% of use cases), grunt-packer will use some of the package's informations to make the report file a little more informative (use project's name as title, show version and description, links to the homepage…).

### Usage Examples

#### Default Options

In this example, the default options are used to shows the results of the parker analysis for the given files.

```js
grunt.initConfig({
  parker: {
    options: {},
    src: [
      'test/*.css'
    ],
  },
});
```

#### Custom Options

In this example, custom options are used to shows the results of the parker analysis for the given files, with only the four given metrics, and write the results on a file named `report.md`

```js
grunt.initConfig({
  parker: {
    options: {
      metrics: [
        "TotalRules",
        "TotalSelectors",
        "TotalIdentifiers",
        "TotalDeclarations"
      ],
      file: "report.md",
      colophon: true,
      usePackage: true
    },
    src: [
      'test/*.css'
    ]
  }
});
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  
Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* **2014/12/14** : v0.1.3
* **2014/09/16** : v0.1.2
* **2014/09/14** : v0.1.0
