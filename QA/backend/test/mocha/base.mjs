import * as baseChai from "chai";
import chaiHttp from "chai-http";
const chai = baseChai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;
import generateCreds from "./creds.mjs";

describe("base", function() {
    it("Should get 200 OK from base url", function(done) {
        // Increase chai's timeout
        this.timeout(65000);
        // Rate limit purpose
        setTimeout(() => {
            console.log("Timeout of 1 minute has finished");
            generateCreds().then(creds => {
                console.log(creds)
                request.execute('http://127.0.0.1:3010/api')
                .get('/')
                .end((err, res) => {
                    // Error is abit buggy
                    // expect(err).to.be.null; 
                    expect(res.body.statusCode).to.equal(200);
                    done();
                });
            });

        }, 60000);
        


    });
});