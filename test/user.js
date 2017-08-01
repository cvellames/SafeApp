const request = require("supertest");
const app = require("./../app");
const chai = require("chai");

const expect = chai.expect;

describe("Routes for User", function(){

    before(function (done) {
        app.on("serverStarted", function () {
            done();
        })
    });
    
    it("Create a new user in database", function(done){
        request(app)
            .put('/api/user')
            .send({
                phone: "+557188888888"
            })
            .expect(200)
            .end(function(err, res){
                expect(res.body.status).to.eql("Success");
                expect(res.body.message).to.eql("User inserted with success");
                done();
            });

    })
});