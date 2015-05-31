var parser = require('../rules.js');
var expect = require('chai').expect;

describe('when result is entered and some bets won', function() {
  beforeEach(function() {
    var result = { first: 2, second: 3, third: 1 };
    var bets = [ 
      { product: 'W', selections: '1', stake: '3' },
      { product: 'W', selections: '2', stake: '4' },
      { product: 'W', selections: '3', stake: '5' },
      { product: 'W', selections: '4', stake: '5' },
      { product: 'W', selections: '1', stake: '16' },
      { product: 'W', selections: '2', stake: '8' },
      { product: 'W', selections: '3', stake: '22' },
      { product: 'W', selections: '4', stake: '57' },
      { product: 'W', selections: '1', stake: '42' },
      { product: 'W', selections: '2', stake: '98' },
      { product: 'W', selections: '3', stake: '63' },
      { product: 'W', selections: '4', stake: '15' },   
      { product: 'P', selections: '1', stake: '31' },
      { product: 'P', selections: '2', stake: '89' },
      { product: 'P', selections: '3', stake: '28' },
      { product: 'P', selections: '4', stake: '72' },
      { product: 'P', selections: '1', stake: '40' },
      { product: 'P', selections: '2', stake: '16' },
      { product: 'P', selections: '3', stake: '82' },
      { product: 'P', selections: '4', stake: '52' },
      { product: 'P', selections: '1', stake: '18' },
      { product: 'P', selections: '2', stake: '74' },
      { product: 'P', selections: '3', stake: '39' },
      { product: 'P', selections: '4', stake: '105' },
      { product: 'E', selections: '1,2', stake: '13' },
      { product: 'E', selections: '2,3', stake: '98' },
      { product: 'E', selections: '1,3', stake: '82' },
      { product: 'E', selections: '3,2', stake: '27' },
      { product: 'E', selections: '1,2', stake: '5' },
      { product: 'E', selections: '2,3', stake: '61' },
      { product: 'E', selections: '1,3', stake: '28' },
      { product: 'E', selections: '3,2', stake: '25' },
      { product: 'E', selections: '1,2', stake: '81' },
      { product: 'E', selections: '2,3', stake: '47' },
      { product: 'E', selections: '1,3', stake: '93' },
      { product: 'E', selections: '3,2', stake: '51' } 
    ];

    rules.setProperties({
      W: { name: 'Win', commission: 0.15 },
      P: { name: 'Place', commission: 0.12, 
           dividends: function(totalStakes) {
             return totalStakes / 3; 
           } 
         },
      E: { name: 'Exacta', commission: 0.18 },  
    });

    for(var bet in bets) {
      rules.addBet(bet);
    }
  });
  
  describe('when calculating house commission', function() {
    it('should return the correct house commissions per product', function() {
      var map = rules.getHouseCommission();      
      expect(map['W']).to.eql(50.69);
      expect(map['P']).to.eql(77.52);
      expect(map['W']).to.eql(109.97);
    });
  });
  
  describe('when calculating dividends', function() {        
    it('should return the correct dividends for Win, Place and Exacta', function() {
      
      var winDividend = rules.calculateDividends('W', result.first);      
      var placeFirstDividend = rules.calculateDividends('P', result.first);
      var placeSecondtDividend = rules.calculateDividends('P', result.second);
      var placeThirdDividend = rules.calculateDividends('P', result.third);
      var exactaDividend = rules.calculateDividends('E', result.first + ',' + result.second);

      expect(winDividend).to.eql(2.61);
      expect(placeFirstDividend).to.eql(1.06);
      expect(placeSecondtDividend).to.eql(1.27);
      expect(placeThirdDividend).to.eql(2.13);
      expect(exactaDividend).to.eql(2.43);
    });
  });
});

describe('when result is entered but no bets won', function() {
  beforeEach(function() {
    var result = { first: 2, second: 3, third: 1 };
    var bets = [ 
      { product: 'E', selections: '3,2', stake: '51' },
    ];

    rules.setProperties({
      W: { name: 'Win', commission: 0.15 },
      P: { name: 'Place', commission: 0.12, 
           dividends: function(totalStakes) {
             return totalStakes / 3; 
           } 
         },
      E: { name: 'Exacta', commission: 0.18 },  
    });
    
    for(var bet in bets) {
      rules.addBet(bet);
    }  
  });
  
  it('should return null', function() {
    var exactaDividend = rules.calculateDividends('E', result.first + ',' + result.second);
    expect(exactaDividend).to.eql(null);
  });
});