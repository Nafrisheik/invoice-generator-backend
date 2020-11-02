const jwt =require("jsonwebtoken");
var authenticateMan = function(req,res,next){
    // console.log(req.headers)
    if(req.headers.authorization){
        jwt.verify(req.headers.authorization,"Manager",function(err,decoded){
            console.log(decoded)
            if(decoded){
                next();
            }else{
                res.json({
                    message:"Token not valid"
                });
            }
        })
        
    }else {
    res.json({
        message:"Not Authorized"
    });
}
};

var authenticateAdmin = function(req,res,next){
    // console.log(req.headers)
    if(req.headers.authorization){
        jwt.verify(req.headers.authorization,"Admin",function(err,decoded){
            console.log(decoded)
            if(decoded){
                next();
            }else{
                res.json({
                    message:"Token not valid"
                });
            }
        })
        
    }else {
    res.json({
        message:"Not Authorized"
    });
}
};
var authenticateEmp = function(req,res,next){
    // console.log(req.headers)
    if(req.headers.authorization){
        jwt.verify(req.headers.authorization,"Employee",function(err,decoded){
            console.log(decoded)
            if(decoded){
                next();
            }else{
                res.json({
                    message:"Token not valid"
                });
            }
        })
        
    }else {
    res.json({
        message:"Not Authorized"
    });
}
};
module.exports = {authenticateMan,authenticateAdmin,authenticateEmp};