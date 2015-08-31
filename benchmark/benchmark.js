/* vim: set et sw=2 ts=2: */

"use strict";

require('../nodash.js').install(GLOBAL);

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
    
    var args = map(invoke, options.args || []);
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
        results.sort(compare);
      }

      callback({
        min: min,
        max: max,
        avg: avg,
        median: results[floor(results.length / 2)]
      });      
    }
  }

  nextIteration();
}

function groupResults(results) {

  var groupedResults = {};

  each(function (result, key) {
    if (isInfixOf('\0', key)) {
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

  each(function (spec, name) {

    if (isFunction(spec)) {
      plan[name] = function (done) {
        timeExecutions(options, spec, done);
      };
    } else if (isObject(spec)) {
      var args = [];
      for (var i = 0 ;; i += 1) {
        if (!isFunction(spec[i])) {
          break;
        }
        args[i] = spec[i];
      }
      var groupOptions = clone(options);
      groupOptions.args = args;

      each(function (spec, group) {
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
    run(plan, function (results) {
      callback(groupResults(results));
    });
  });
}

function printResults(results) {

  each(function (results, group) {

    var averages = values(map(select('result.avg'), results));
    var best = minimum(averages);
    var worst = maximum(averages);

    console.log('');
    console.log(chalk.gray(sprintf(
      "%-17s %8s %8s %8s %8s", group, "MIN", "MAX", "AVG", "MEDIAN")));

    each(function (result, key) {
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
        console.log(format(sprintf("  %-15s %8d %8d %8d %8d",
            key, result.min, result.max, result.avg, result.median)));
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
