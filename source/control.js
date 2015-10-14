/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function () {

  var Nodash = this;

  return {
    
    async: function (f) {
      return function () {
        try {
          var callback = arguments[arguments.length - 1];
          var result = f.apply(null, [].slice.call(arguments, 0, arguments.length - 1));
          setImmediate(function () { callback(null, result); });
        } catch (e) {
          setImmediate(function () { callback(e); });
        }
      };
    },

    run: function (specification) {
      // this function does its own currying.
      if (arguments.length === 2) {
        Nodash.run(specification)(arguments[1]);
        return;
      }

      // if spec is an array, translate to object spec
      if (Nodash.isArray(specification)) {
        var prev = null;
        var newSpec = {};
        Nodash.each(function (func, taskName) {
          newSpec[taskName] = prev === null ? func : [ prev, func ];
          prev = taskName;
        }, specification);
        specification = newSpec;
      }

      var tasks = {};
      var initial = [];

      // prepare tasks specification.
      Nodash.each(function (spec, name) {
        var dependencies = [];
        var func = null;
        if (Nodash.isArray(spec)) {
          dependencies = Nodash.init(spec);
          func = Nodash.last(spec);
        } else {
          if (Nodash.isArray(spec.depends)) {
            dependencies = spec.depends;
          }
          func = spec;
        }

        var task = {
          func: func,
          args: dependencies,
          depends: {},
          enables: tasks[name] ? tasks[name].enables : {}
        };
        Nodash.each(function (dependency) {
          task.depends[dependency] = true;
          if (!tasks[dependency]) {
              tasks[dependency] = { enables: {} };
          }
          tasks[dependency].enables[name] = true;
        }, dependencies);
        tasks[name] = task;
      }, specification);

      // check spec for unmet dependencies
      var unmetDependencies = [];
      Nodash.each(function (task, taskName) {
        Nodash.each(function (_, dependency) {
          if (!specification[dependency]) {
            unmetDependencies.push([ taskName, dependency ]);
          }
        }, task.depends);
      }, tasks);

      function mkError(message) {
        return function (callback) {
          setImmediate(function () {
            callback(message);
          });
        };
      }

      if (!Nodash.isEmpty(unmetDependencies)) {
        return mkError({
          message: 'unmet dependencies',
          details: Nodash.map(function (detail) {
            return '`' +
              detail[0] + '` depends on `' +
              detail[1] + '` which is not defined';
          }, unmetDependencies)
        });
      }

      // build initial set
      Nodash.each(function (task, taskName) {
        if (Nodash.isEmpty(task.depends)) {
          initial.push(taskName);
        }
      }, tasks);

      if (Nodash.isEmpty(initial)) {
        return mkError({
          message: 'no initial task',
          details: 'There is no task without any dependencies.'
        });
      }

      // check spec for cycles
      var cycles = [];
      Nodash.each(function (taskName) {

        var visited = {};
        var path = [];

        function visit(node) {
          path.push(node);
          if (visited[node]) {
            cycles.push(Nodash.map(Nodash.id, path));
          } else {
            visited[node] = true;
            Nodash.each(visit, Object.keys(tasks[node].enables));
          }
          delete visited[path.pop()];
        }

        visit(taskName);

      }, initial);

      if (!Nodash.isEmpty(cycles)) {
        cycles = Nodash.map(function (cycle) {
          cycle = Nodash.dropWhile(Nodash.NEQ(Nodash.last(cycle)), cycle);
          return Nodash.reverse(cycle);
        }, cycles);
        return mkError({
          message: 'cycle detected',
          details: Nodash.map(Nodash.intercalate(' -> '), cycles)
        });
      }

      return function _runTasks(callback) {

        var depends = {},
            toGo = Nodash.length(tasks),
            results = Nodash.map(function (task, taskName) {
          return { toGo: Nodash.length(task.enables) };
        }, tasks);

        function callbackHandle(taskName) {
          return function (error, result) {
            if (!error) {
              results[taskName].result = result;
            } else {
              results[taskName].error = error;
            }

            // clean up results if need be
            Nodash.each(function (_, dependency) {
              results[dependency].toGo -= 1;
              if (results[dependency].toGo === 0) {
                delete results[dependency];
              }
            }, tasks[taskName].depends);

            toGo -= 1;
            if (toGo === 0) {
              // clean results object
              Nodash.each(function (result) {
                delete result.toGo;
              }, results);
              callback(null, results);
            } else {
              Nodash.each(function (_, next) {
                delete depends[next][taskName];
                if (Nodash.isEmpty(depends[next])) {
                  execute(next);
                }
              }, tasks[taskName].enables);
            }
          };
        }

        function execute(taskName) {
          var task = tasks[taskName],
              callback = callbackHandle(taskName),
              dependenciesFailed = false,
              args = Nodash.map(function (dependency) {
                if (results[dependency].error) {
                  dependenciesFailed = true;
                }
                return results[dependency].result;
              }, task.args);

          if (dependenciesFailed && Nodash.isFunction(task.func.runOnError)) {
            var tempResult = {};
            Nodash.each(function (dependency) {
              var result = results[dependency];
              var stubResult = {};
              if (result.error) {
                stubResult.error = result.error;
              } else {
                stubResult.result = result.result;
              }
              tempResult[dependency] = stubResult;
            }, task.args);
            tempResult = task.func.runOnError(tempResult) || tempResult;
            args = Nodash.map(function (dependency) {
              return tempResult[dependency].result;
            }, task.args);
          }

          args.push(callback);

          setImmediate(function _executeTask() {
            if (dependenciesFailed && !task.func.runOnError) {
              callback({ message: 'dependencies failed' });
            } else {
              var f = task.func;
              if (Nodash.isObject(f)) {
                f = f.func;
              }
              try {
                f.apply(null, args);
              } catch (e) {
                callback(e);
              }
            }
          });
        }

        Nodash.each(function (task, taskName) {
          depends[taskName] = Nodash.clone(task.depends);
        }, tasks);

        Nodash.each(execute, initial);
      };
    },

    until: function (p, f, v) {
      while (!p(v)) {
        v = f(v);
      }
      return v;
    },

    pipe: function () {
      var functions, intermediateResult, callback;
      var error = null;
      if (Nodash.isArray(arguments[0])) {
        functions = arguments[0];
        callback = arguments[1];
      } else {
        functions = arguments;
      }
      if (functions.length > 0) {
        if (Nodash.isFunction(functions[0])) {
          intermediateResult = functions[0]();
        } else {
          intermediateResult = functions[0];
        }
        for (var i = 1; i < functions.length; i += 1) {
          try {
            intermediateResult = functions[i](intermediateResult);
          } catch (err) {
            error = err;
          }
        }
      }
      if (Nodash.isFunction(callback)) {
        callback(error, intermediateResult);
      } else if (error) {
        throw error;
      }
      return intermediateResult;
    }

  };
};
