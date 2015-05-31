var parser = require('../parser.js');
var expect = require('chai').expect;

describe('when a correct bet is entered with the following format: Bet:<product>:<selection>:<stake>', function() {
  beforEach(function() {
    var properties = {
      Bet: [
        { product: '[WPE]{1}' },
        { selections: 
          { product: { W: '\\d+', P: '\\d+', E: '\\d+,\\d+'} }
        },
        { stake: '\\d+' }
      ]
    };

    parser.setDelimeter(':');
    parser.setProperties(properties);
  });

  it('should return a correct field to value map for Bet:W:1:3', function() {      
    var bet = 'Bet:W:1:3';
    var map = parser.parse(bet);
    expect(map).to.eql(
      { key: 'Bet', 
        data: { product: 'W', selection: '1', stake: '3' }
      });
  });

  it('should return a correct field to value map for Bet:P:2:4', function() {      
    var bet = 'Bet:P:2:4';
    var map = parser.parse(bet);
    expect(map).to.eql(
      { key: 'Bet', 
        data: { product: 'P', selection: '2', stake: '4' }
      });
  });

  it('should return a correct field to value map for Bet:E:3,4:5', function() {      
    var bet = 'Bet:E:3,4:5';
    var map = parser.parse(bet);
    expect(map).to.eql(
      { key: 'Bet', 
        data: { product: 'E', selection: '3,4', stake: '5' }
      });
  });
});

describe('when an incorrect bet is entered', function() {
  beforEach(function() {
    var properties = {
      Bet: [
        { product: '[WPE]{1}' },
        { selections: 
          { product: { W: '\\d+', P: '\\d+', E: '\\d+,\\d+'} }
        },
        { stake: '\\d+' }
      ]
    };

    parser.setDelimeter(':');
    parser.setProperties(properties);
  });

  it('should return null for lower case "bet" in input', function() {
    var bet = 'bet:E:3,4:5';
    var map = parser.parse(bet);
    expect(map).to.eql(null);
  });

  it('should return null for lower case <product> in input', function() {
    var bet = 'Bet:e:3,4:5';
    var map = parser.parse(bet);
    expect(map).to.eql(null);
  });

  it('should return null if <product> is not W, P nor E in input', function() {
    var bet = 'Bet:x:3,4:5';
    var map = parser.parse(bet);
    expect(map).to.eql(null);
    
    bet = 'Bet:1:1:5';
    map = parser.parse(bet);
    expect(map).to.eql(null);        

    bet = 'Bet:Bet:1:5';
    map = parser.parse(bet);
    expect(map).to.eql(null);        
  });

  it('should return null if <product> is E but there is only a single <selection> in input', function() {
    var bet = 'Bet:E:3:5';
    var map = parser.parse(bet);
    expect(map).to.eql(null);
  });

  it('should return null if <product> is E but <selection> does not follow the <first>,<second> format in input', function() {
    var bet = 'Bet:E:,1:5';
    var map = parser.parse(bet);
    expect(map).to.eql(null);
    
    bet = 'Bet:E:1,:5';
    map = parser.parse(bet);
    expect(map).to.eql(null);    

    bet = 'Bet:E:1,2,3:5';
    map = parser.parse(bet);
    expect(map).to.eql(null);    
  });
  
  it('should return null if <stake> is not a whole number', function() {
    var bet = 'Bet:E:1:a';
    var map = parser.parse(bet);
    expect(map).to.eql(null);
    
    bet = 'Bet:E:1:5.1';
    map = parser.parse(bet);
    expect(map).to.eql(null);    
    
    bet = 'Bet:E:1:.1';
    map = parser.parse(bet);
    expect(map).to.eql(null);    
  });
  
  it('should return null if any or all of the fields is/are not specified', function() {
    var bet = ':E:1:a';
    var map = parser.parse(bet);
    expect(map).to.eql(null);
    
    bet = 'Bet::1:1';
    map = parser.parse(bet);
    expect(map).to.eql(null);    
    
    bet = 'Bet:E:1:';
    map = parser.parse(bet);
    expect(map).to.eql(null);    

    bet = ':::';
    map = parser.parse(bet);
    expect(map).to.eql(null);    

    bet = 'Bet:::';
    map = parser.parse(bet);
    expect(map).to.eql(null);
  });
});

describe('when a correct result is entered with the following format: Result:<first>:<second>:<third>', function() {
  beforEach(function() {
    var properties = {
      Result: 
      [
        { first: '\\d+'},
        { second: '\\d+'},
        { third: '\\d+'},
      ]
    };

    parser.setDelimeter(':');
    parser.setProperties(properties);
  });

  it('should return the correct field value map for Result:1:2:3', function() {
    var result = 'Result:1:2:3';
    var map = parser.parse(result);
    expect(map).to.eql({ first: 1, second: 2, third: 3 });
  });
});

describe('when the input is not in the following format: Result:<first>:<second>:<third>', function() {
  beforEach(function() {
    var properties = {
      Result: 
      [
        { first: '\\d+'},
        { second: '\\d+'},
        { third: '\\d+'},
      ]
    };

    parser.setDelimeter(':');
    parser.setProperties(properties);
  });

  it('should return null for lower case input', function() {
    var result = 'result:1:2:3';
    var map = parser.parse(result);
    expect(map).to.eql(null);
  });
  
  it('should return null for non whole number for any of the <first>, <second> or <third>', function() {
    var result = 'Result:a:2:3';
    var map = parser.parse(result);
    expect(map).to.eql(null);
  
    result = 'Result:1:b:2';
    map = parser.parse(result);
    expect(map).to.eql(null);    

    result = 'Result:1:2:c';
    map = parser.parse(result);
    expect(map).to.eql(null);    

    result = 'Result:1.1:2.2:3.3';
    map = parser.parse(result);
    expect(map).to.eql(null);    
  });
  
  it('should return null for any other non conforming inputs', function() {
    var result = 'Result:1:2:3:4';
    var map = parser.parse(result);
    expect(map).to.eql(null);
    
    result = 'Result:1,2,3';
    map = parser.parse(result);
    expect(map).to.eql(null);

    result = 'Result::2:3';
    map = parser.parse(result);
    expect(map).to.eql(null);

    result = 'Result:::';
    map = parser.parse(result);
    expect(map).to.eql(null);

    result = ':::';
    map = parser.parse(result);
    expect(map).to.eql(null);
  });
  
});