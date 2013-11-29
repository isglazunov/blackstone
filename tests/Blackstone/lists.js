require('should');
var _ = require('lodash');
var blackstone = require('../../blackstone.js');

var genSupers = function(num) {
    var c = [];
    for (var i = 0; i < num; i++) {
        var s = new blackstone.lists.Superposition;
        s.id = i
        c.push(s);
    }
    return c;
}
var lToIds = function(l) { return _.map(l.toArray(), function(value) { return value.id; }); };

describe('lists', function() {
    
    describe('List', function() {
        it('list.append', function() {
            var l = new blackstone.lists.List;
            var c = genSupers(10);
            l.append([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            lToIds(l).should.be.eql([0,1,2,3,4,5,6,7,8,9]);
            l.append([c[3],c[6],c[7],c[9],c[2]]);
            lToIds(l).should.be.eql([0,1,2,3,4,5,6,7,8,9]);
            l.append([c[3],c[6],c[7],c[9],c[2]], true);
            lToIds(l).should.be.eql([0,1,4,5,8,3,6,7,9,2]);
        });
        
        it('list.prepend', function() {
            var l = new blackstone.lists.List;
            var c = genSupers(10);
            l.prepend([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            lToIds(l).should.be.eql([0,1,2,3,4,5,6,7,8,9]);
            l.prepend([c[3],c[6],c[7],c[9],c[2]]);
            lToIds(l).should.be.eql([0,1,2,3,4,5,6,7,8,9]);
            l.prepend([c[3],c[6],c[7],c[9],c[2]], true);
            lToIds(l).should.be.eql([3,6,7,9,2,0,1,4,5,8]);
        });
        it('list.remove', function() {
            var l = new blackstone.lists.List;
            var c = genSupers(10);
            l.prepend([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            l.remove([c[4],c[2]]);
            lToIds(l).should.be.eql([0,1,3,5,6,7,8,9]);
        });
        it('list.sort', function() {
            var l = new blackstone.lists.List;
            var c = genSupers(10);
            
            var comparator = function(prev, next) {
                return prev.id < next.id;
            };
            
            l.append([c[3],c[6],c[7],c[9],c[2],c[0],c[1],c[4],c[5],c[8]]);
            l.sort(comparator);
            lToIds(l).should.be.eql([0,1,2,3,4,5,6,7,8,9]);
        });
    });
    
    describe('Position', function() {
        it('position.append', function() {
            var l = new blackstone.lists.List;
            var c = genSupers(10);
            l.append([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            lToIds(l).should.be.eql([0,1,2,3,4,5,6,7,8,9]);
            c[4].in(l).append([c[3],c[6],c[7],c[9],c[2]]);
            lToIds(l).should.be.eql([0,1,2,3,4,5,6,7,8,9]);
            c[4].in(l).append([c[3],c[6],c[7],c[9],c[2]], true);
            lToIds(l).should.be.eql([0,1,4,3,6,7,9,2,5,8]);
        });
        it('position.prepend', function() {
            var l = new blackstone.lists.List;
            var c = genSupers(10);
            l.prepend([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            lToIds(l).should.be.eql([0,1,2,3,4,5,6,7,8,9]);
            c[4].in(l).prepend([c[3],c[6],c[7],c[9],c[2]]);
            lToIds(l).should.be.eql([0,1,2,3,4,5,6,7,8,9]);
            c[4].in(l).prepend([c[3],c[6],c[7],c[9],c[2]], true);
            lToIds(l).should.be.eql([0,1,3,6,7,9,2,4,5,8]);
        });
        it('position.remove', function() {
            var l = new blackstone.lists.List;
            var c = genSupers(10);
            l.prepend([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            c[4].in(l).remove();
            lToIds(l).should.be.eql([0,1,2,3,5,6,7,8,9]);
        });
        it('position.add', function() {
            var l = new blackstone.lists.List;
            var c = genSupers(10);
            
            var comparator = function(prev, next) {
                return prev.id < next.id;
            };
            
            c[5].in(l).add(comparator);
            lToIds(l).should.be.eql([5]);
            c[3].in(l).add(comparator);
            lToIds(l).should.be.eql([3,5]);
            c[7].in(l).add(comparator);
            lToIds(l).should.be.eql([3,5,7]);
            c[6].in(l).add(comparator);
            lToIds(l).should.be.eql([3,5,6,7]);
        });
    });
    
    it('Superposition', function() {
        var s = new blackstone.lists.Superposition;
        var l = new blackstone.lists.List;
        s.in(l).should.be.an.instanceof(blackstone.lists.Position);
    });
    
});