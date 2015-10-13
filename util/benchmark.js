/* vim: set et sw=2 ts=2: */
/* jshint node: true, undef: false */
'use strict';

var N = require('../nodash.js');

var chalk = require('chalk');
var sprintf = require('sprintf').sprintf;

function timeExecution(func, args) {

  args = args || [];

  var error = null;
  var start = process.hrtime();

  try {
    func.apply(null, args);
  } catch (e) {
    return { error: e };
  }

  var end = process.hrtime(start);

  return end[0] * 10e9 + end[1];
}

function timeExecutions(options, func, callback) {
  
  var results = [];

  var min = +Infinity;
  var max = -Infinity;
  var avg = 0;

  var i = 0;

  function nextIteration() {
    i += 1;
    
    var args = N.map(N.invoke, options.args || []);
    var result = timeExecution(func, args);
    
    if (typeof result !== 'number') {
      callback(null, result.error);
      return;
    }
    
    min = Math.min(min, result);
    max = Math.max(max, result);
    avg += (result - avg) / i;

    if (options.median) {
      results.push(result);
    }

    if (i <= options.iterations) {
      if (options.delay > 0) {
        setTimeout(nextIteration, options.delay);
      } else {
        setImmediate(nextIteration);
      }
    } else {
      if (options.median) {
        results.sort(N.compare);
      }

      callback({
        min: min,
        max: max,
        avg: avg,
        median: results[N.floor(results.length / 2)]
      });
    }
  }

  nextIteration();
}

function groupResults(results) {

  var groupedResults = {};

  N.each(function (result, key) {
    if (N.isInfixOf('\0', key)) {
      key = key.split('\0');
      if (!groupedResults[key[0]]) {
        groupedResults[key[0]] = {};
      }
      groupedResults[key[0]][key[1]] = result;
    } else {
      groupedResults[key] = { '': result };
    }
  }, results);

  return groupedResults;
}

function timeSuite(options, suite, callback) {
  var plan = {};

  N.each(function (spec, name) {

    if (N.isFunction(spec)) {
      plan[name] = function (done) {
        timeExecutions(options, spec, done);
      };
    } else if (N.isObject(spec)) {
      var args = [];
      for (var i = 0 ;; i += 1) {
        if (!N.isFunction(spec[i])) {
          break;
        }
        args[i] = spec[i];
      }
      var groupOptions = N.clone(options);
      groupOptions.args = args;

      N.each(function (spec, group) {
        if (/^[0-9]+$/.test(group)) {
          return;
        }
        plan[name + '\0' + group] = function (done) {
          timeExecutions(groupOptions, spec, done);
        };
      }, spec);
    }

  }, suite);

  if (options.__warmUp === true) {
    setImmediate(callback);
    return;
  }

  timeSuite({
    iterations: options.warmUp || 10,
    delay: 1,
    __warmUp: true
  }, suite, function () {
    N.run(plan, function (results) {
      callback(groupResults(results));
    });
  });
}

function printResults(results) {

  N.each(function (results, group) {

    var averages = N.values(N.map(N.select('result.avg'), results));
    var best = N.minimum(averages);
    var worst = N.maximum(averages);

    console.log('');
    console.log(chalk.gray(sprintf(
      "%-22s %6s %8s %8s %8s %8s", group, "%", "AVG", "MEDIAN", "MIN", "MAX")));

    N.each(function (result, key) {
      if (result.error) {
        console.log(sprintf("  %s %s",
            chalk.white(key), chalk.red("(errored)")));
        console.log('    ' + chalk.gray(result.error));
      } else {
        result = result.result;
        var format = chalk.white;
        if (result.avg === best) {
          format = chalk.green;
        } else if (result.avg === worst) {
          format = chalk.yellow;
        }
        console.log(format(sprintf("  %-20s %6.2f %8d %8d %8d %8d",
            key, result.avg / best, result.avg, result.median, result.min, result.max)));
      }
    }, results);

  }, results);

}

module.exports = {
  timeExecution: timeExecution,
  timeExecutions: timeExecutions,
  timeSuite: timeSuite,
  printResults: printResults
};
