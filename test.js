require('./nodash.js').install(GLOBAL);

var tasks = {
    'EINS': function (callback) {
        console.log("Starting: EINS");
        setTimeout(function () {
            console.log("Finishing: EINS");
            callback("eins");
        }, Math.random() * 2000);
    },

    'ZWEI': [ 'VIER', {
      func: function (vier, callback) {
        console.log("Starting: ZWEI", vier);
        setTimeout(function () {
            console.log("Finishing: ZWEI");
            callback("zwei");
        }, Math.random() * 2000);
      },
      runOnError: function (results) {
          console.log(results);
          results.VIER.result = "fallback";
      }
    }],

    'DREI': [ 'EINS', 'VIER', function (eins, vier, callback) {
        console.log("Starting: DREI", eins, vier);
        setTimeout(function () {
            console.log("Finishing: DREI");
            callback("drei");
        }, Math.random() * 2000);
    }],

    'VIER': [ 'FÜNF', 'EINS', function (fuenf, eins, callback) {
        console.log("Starting: VIER", fuenf, eins);
        setTimeout(function () {
            console.log("Finishing: VIER");
            callback("vier", "aww snap!");
        }, Math.random() * 2000);
    }],

    'FÜNF': function (callback) {
        console.log("Starting: FÜNF");
        setTimeout(function () {
            console.log("Finishing: FÜNF");
            callback("fünf");
        }, Math.random() * 2000);
    }
};

run(tasks, function (results, error) {
    console.log(results);
    console.log(error);    
    console.log('DONE');
});

run({

    zero: [ null ],

    one: [ 'two', 'zero', null ],

    two: [ 'one', null ],

    three: [ 'two', null ]

}, function (results, error) {
    console.log(results);
    console.log(error);
    console.log("DONE");
});


