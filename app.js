'use strict';
var readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

var parser = require('./parser');
var rules = require('./rules');


parser.setDelimeter(':');
parser.setProperties({
  Bet: 
  [
    { product: '[WP]{1}' },
    { selections: 
      { product: 
        { W: '\\d+',
          P: '\\d+'
        } 
      }
    },
    { stake: '\\d+' }
  ],
  Result: 
  [
    { first: '\\d+'},
    { second: '\\d+'},
    { third: '\\d+'},
  ]
});

rules.setProperties({
  W: { name: 'Win', commission: 0.15 },
  P: { name: 'Place', commission: 0.12, 
       dividends: function(totalStakes) {
         return totalStakes / 3; 
       } 
     }
});

rules.on('Win', function(key, result) {
  var dividends = this.calculateDividends(key, result.first);
  display('Win', result.first, dividends);
});

rules.on('Place', function(key, result) {
  for (var resultKey in result) {
    var place = result[resultKey];
    var dividends = this.calculateDividends(key, place);
    display('Place', place, dividends);
  }  
});

var display = function(product, selection, dividends) {
  console.log("==============");
  var dividendOutput = dividends ? "$" + dividends.toFixed(2) : "NONE";
  console.log(product + ":" + selection + ":" + dividendOutput);
};

readline.on("line", function(input) {
  if (input === 'x') {
    readline.close();
    return;
  }

  var values = parser.parse(input);
  rules.process(values);
});
