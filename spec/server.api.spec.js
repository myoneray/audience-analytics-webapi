var expect = require("chai").expect;
var request = require('request');
var chance = require('chance').Chance();

var apiurl = "http://localhost:3000/";
// var apiurl = "http://192.168.10.42:9001/";
// var apiurl = "http://192.168.88.104:9001/";

describe('taskCreate', function() {
    it("create", function(done) {
        let url = apiurl + 'task';
        let postBody = {
            url: url,
            body : {
                name : "sunyuetestTaks1" + chance.name(),
                clientType:0,
                period : "M",
                expired : "2017-10-1",
                isPreo : 0,
                dimension : "S0002,S0007",
                rules : {
                    "includes":[
                        [
                            {"uid":"S0025","rule":"上海"},
                            {"uid":"S0006","rule":"否"}
                        ],
                        [
                            {"uid":"S0007","rule":"是"}
                        ]
                    ],
                    "excludes":[]
                }

            },
            method: "post",
            json: true,
            forever: true,
            timeout : 6000,
            pool: {
                maxSockets: 10
            },
            time: true
        };

        request(postBody, function(err, res, body) {
            console.info(err, body);
            //body = JSON.parse(body);
            expect(res).to.not.be.undefined;
            expect(res).to.not.be.null;
            expect(res.statusCode).to.equal(200);
            done();
        });

    });


 /*   it("update", function(done) {
        let url = 'http://localhost:3000/task/16';
        let postBody = {
            url: url,
            body : {
                name : "sunyuetestUpdateTaks1" + chance.name(),
                clientType:0,
                period : "M",
                expired : "2017-10-1",
                isPreo : 0,
                dimension : "S0002,S0004,S0003",
                rules:
                {"includes":
                    [[{"uid":"S0006","rule":"中,高,低"}],
                        [{"uid":"S0007","rule":"是"}]],
                    "excludes":[]
                }

            },
            method: "put",
            json: true,
            forever: true,
            timeout : 10000,
            pool: {
                maxSockets: 10
            },
            time: true
        };

        request(postBody, function(err, res, body) {
            console.info(err, body);
            //body = JSON.parse(body);
            expect(res).to.not.be.undefined;
            expect(res).to.not.be.null;
            expect(res.statusCode).to.equal(200);
            done();
        });

    });



    it("delete", function(done) {


        request.delete('http://localhost:3000/task/15', function(err, res, body) {
            console.info(err, body);
            //body = JSON.parse(body);
            expect(res).to.not.be.undefined;
            expect(res).to.not.be.null;
            expect(res.statusCode).to.equal(200);
            done();
        });

    });*/






});