class ExpressErr extends Error {
    constructor(statusCode , msg){
        super();
        this.statusCode = statusCode;
        this.msg = msg;
    }
}

module.exports = ExpressErr;