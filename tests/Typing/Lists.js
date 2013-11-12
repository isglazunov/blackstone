require('should');
var blackstone = require('../../blackstone.js');
var lodash = require('lodash');
var List = blackstone.List;
var Super = blackstone.Superposition;

it('Blackstone Lists', function() {
    
    var eql = function(s1, s2) {
        s1._.should.be.eql(s2._);
    }
    
    var create = function(num) {
        var s = Super.new();
        s._ = num;
        return s;
    };
    
    var l = List.new();
    
    var s0 = create(0);
    var s1 = create(1);
    
    l.append(s0, s1);
    
    var s2 = create(2);
    
    s1.in(l).append(s2);
    
    var s3 = create(3);
    
    s1.in(l).prepend(s3);
    
    s1.in(l).remove();
    
    eql(l.first().super(), s0);
    eql(l.first().next().super(), s3);
    eql(l.first().next().next().super(), s2);
    eql(l.last().prev().prev().super(), s0);
    eql(l.last().prev().super(), s3);
    eql(l.last().super(), s2);
    
});