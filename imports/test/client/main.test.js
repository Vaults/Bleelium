if (Meteor.isClient) {
  describe("client test", function(){
    it("does a bogus test", function(){
      chai.assert.equal(true);
    });
  });
}