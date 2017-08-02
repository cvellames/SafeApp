const request = require("supertest");
const app = require("./../app");
const chai = require("chai");

const expect = chai.expect;
const returnUtils = require("./../utils/return")(app);

describe("Routes for User", function(){

    before(function (done) {
        app.on("serverStarted", function () {
            done();
        })
    });

    beforeEach(function(done){
        app.db.sequelize.sync({force:true}).done(function(){
            done();
        })
    });
    
    /*
      ======================== PUT | /api/user =========================
    */
    describe("PUT | /api/user", function(){
        it("Should create a new user in database", function(done){
            const phone = "+557188888888";
            request(app)
                .put('/api/user')
                .send({
                    phone: phone
                })
                .expect(200)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("USER_INSERTED", phone, true));
                    done();
                });
        });

        it("Should send missing param error", function(done){
            request(app)
                .put('/api/user')
                .send({
                    phoooneeee: "1234"
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });

        });

        it("Should generate a new activation code", function(done){
            const Users = app.db.models.Users;
            const phone = "+557188888888";
            Users.create({
                phone: phone
            }).then(function(user){
                request(app)
                    .put("/api/user")
                    .send({
                        phone: phone
                    })
                    .expect(200)
                    .end(function(err, res){
                        expect(res.body.message).to.eql(returnUtils.getI18nMessage("ACTIVATION_CODE_RESENT"));
                        expect(res.body.content).to.eql(null);
                        done()
                    })
            });
        });
    });
    
    
    /*
      ======================== POST | /api/user/activate =========================
    */
    
    describe("POST | /api/user/activate", function(){
        it("Should send missing param error", function(done){
            request(app)
                .post('/api/user/activate')
                .send({})
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

        it("Should send missing param error", function(done){
            request(app)
                .post('/api/user/activate')
                .send({
                    phone: "+55718888888"
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

        it("Should send missing param error", function(done){
            request(app)
                .post('/api/user/activate')
                .send({
                    activationCode: "1234"
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });
    })
});