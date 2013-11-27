require('should');
var blackstone = require('../../blackstone.js');

describe('lists', function() {
    
    describe('List', function() {
        it('list.append', function() {
            var l = new blackstone.lists.List;
            var c = [];
            for (var i = 0; i < 10; i++) {
                c.push(new blackstone.lists.Superposition);
            }
            l.append([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            l.toArray().should.be.eql([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            l.append([c[3],c[6],c[7],c[9],c[2]]);
            l.toArray().should.be.eql([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            l.append([c[3],c[6],c[7],c[9],c[2]], true);
            l.toArray().should.be.eql([c[0],c[1],c[4],c[5],c[8],c[3],c[6],c[7],c[9],c[2]]);
        });
        
        it('list.prepend', function() {
            var l = new blackstone.lists.List;
            var c = [];
            for (var i = 0; i < 10; i++) {
                c.push(new blackstone.lists.Superposition);
            }
            l.prepend([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            l.toArray().should.be.eql([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            l.prepend([c[3],c[6],c[7],c[9],c[2]]);
            l.toArray().should.be.eql([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            l.prepend([c[3],c[6],c[7],c[9],c[2]], true);
            l.toArray().should.be.eql([c[3],c[6],c[7],c[9],c[2],c[0],c[1],c[4],c[5],c[8]]);
        });
        it('list.remove', function() {
            var l = new blackstone.lists.List;
            var c = [];
            for (var i = 0; i < 10; i++) {
                c.push(new blackstone.lists.Superposition);
            }
            l.prepend([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            l.remove([c[4],c[2]]);
            l.toArray().should.be.eql([c[0],c[1],c[3],c[5],c[6],c[7],c[8],c[9]]);
        });
        
        describe('list.each', function() {
            describe('order true', function() {
                it('sync', function(done) {
                    var l = new blackstone.lists.List;
                    var c = [];
                    for (var i = 0; i < 10; i++) {
                        c.push(new blackstone.lists.Superposition);
                    }
                    l.append(c);
                    var i = 0;
                    l.each({
                        handler: function(sup) {
                            c[i].should.be.eql(sup);
                            i++;
                        },
                        callback: function() {
                            done();
                        }
                    });
                });
                it('async', function(done) {
                    var l = new blackstone.lists.List;
                    var c = [];
                    for (var i = 0; i < 10; i++) {
                        c.push(new blackstone.lists.Superposition);
                    }
                    l.append(c);
                    var i = 0;
                    l.each({
                        sync: false,
                        handler: function(sup) {
                            c[i].should.be.eql(sup);
                            i++;
                            this.return();
                        },
                        callback: function() {
                            done();
                        }
                    });
                });
            });
            describe('order false', function() {
                it('sync', function(done) {
                    var l = new blackstone.lists.List;
                    var c = [];
                    for (var i = 0; i < 10; i++) {
                        c.push(new blackstone.lists.Superposition);
                    }
                    l.append(c);
                    var i = c.length - 1;
                    l.each({
                        order: false,
                        handler: function(sup) {
                            c[i].should.be.eql(sup);
                            i--;
                        },
                        callback: function() {
                            done();
                        }
                    });
                });
                it('async', function(done) {
                    var l = new blackstone.lists.List;
                    var c = [];
                    for (var i = 0; i < 10; i++) {
                        c.push(new blackstone.lists.Superposition);
                    }
                    l.append(c);
                    var i = c.length - 1;
                    l.each({
                        sync: false,
                        order: false,
                        handler: function(sup) {
                            c[i].should.be.eql(sup);
                            i--;
                            this.return();
                        },
                        callback: function() {
                            done();
                        }
                    });
                });
            });
        });
    });
    
    describe('Position', function() {
        it('position.append', function() {
            var l = new blackstone.lists.List;
            var c = [];
            for (var i = 0; i < 10; i++) {
                c.push(new blackstone.lists.Superposition);
            }
            l.append([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            l.toArray().should.be.eql([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            c[4].in(l).append([c[3],c[6],c[7],c[9],c[2]]);
            l.toArray().should.be.eql([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            c[4].in(l).append([c[3],c[6],c[7],c[9],c[2]], true);
            l.toArray().should.be.eql([c[0],c[1],c[4],c[3],c[6],c[7],c[9],c[2],c[5],c[8]]);
        });
        it('position.prepend', function() {
            var l = new blackstone.lists.List;
            var c = [];
            for (var i = 0; i < 10; i++) {
                c.push(new blackstone.lists.Superposition);
            }
            l.prepend([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            l.toArray().should.be.eql([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            c[4].in(l).prepend([c[3],c[6],c[7],c[9],c[2]]);
            l.toArray().should.be.eql([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            c[4].in(l).prepend([c[3],c[6],c[7],c[9],c[2]], true);
            l.toArray().should.be.eql([c[0],c[1],c[3],c[6],c[7],c[9],c[2],c[4],c[5],c[8]]);
        });
        it('position.remove', function() {
            var l = new blackstone.lists.List;
            var c = [];
            for (var i = 0; i < 10; i++) {
                c.push(new blackstone.lists.Superposition);
            }
            l.prepend([c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]]);
            c[4].in(l).remove();
            l.toArray().should.be.eql([c[0],c[1],c[2],c[3],c[5],c[6],c[7],c[8],c[9]]);
        });
    });
    
    it('Superposition', function() {
        var s = new blackstone.lists.Superposition;
        var l = new blackstone.lists.List;
        s.in(l).should.be.an.instanceof(blackstone.lists.Position);
    });
});