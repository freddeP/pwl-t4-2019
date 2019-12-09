const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailTo = require("./mail");

module.exports = {

    loginForm(req,res){
        res.sendFile(__dirname+"/form.html");
    },
    confirmationForm(req,res){
        res.sendFile(__dirname+"/conf.html");
    },
    login(req,res){

        // SKAPA TOKEN MED HASHAD CODE
        // SKAPA COOKIE MED TOKEN KORT EXP
        let code = getRandomCode();
        let hash = bcrypt.hashSync(code,12);

        let email = req.body.email;
        let payload = {email:email, hash:hash};
        emailTo(code,email);
        let token = jwt.sign(payload,process.env.FIRSTSECRET,{expiresIn:120});
        res.cookie("tmpToken",token,{maxAge:120000,sameSite:"strict", httpOnly:true})
        res.redirect("/confirmation");

    },
    confirmation(req,res){

    // hit skickas en kod
    // hit skickas också en cookie med token
    // verifiera token
    // hämta hash från token
    // jämför med kod mha bcrypt.compare()
    // om allt går bra skicka ny token med lång exp och annan MAINSECRET
    let code = req.body.code;
    let tmpToken = req.cookies.tmpToken;
    
    // om det finns cookie med namn tmpToken
    if(tmpToken)
    {
        // verifiera tmpToken
        try {
            verifiedToken = jwt.verify(tmpToken,process.env.FIRSTSECRET);
            // hämtar hash från token
            let hash = verifiedToken.hash;
            bcrypt.compare(code,hash,(err,success)=>{

              if(success)
              {
                let payload = {email: verifiedToken.email};
                res.cookie("tmpToken",false,{maxAge:10000});
                let token = jwt.sign(payload,process.env.MAINSECRET,{expiresIn:"2h"});
                res.cookie("token",token,{maxAge:7200000,httpOnly:true, sameSite:"Strict"})
                res.send("you are logged in");
              }
              else{
                  res.send("Login Error");
              }


            });


        } catch (error) {
           res.send(error.message); 
        }
  

    }
    else{
        res.send("no cookie provided");
    }


    }

}



function getRandomCode(){

    const crypto = require('crypto');
    const code = crypto.randomBytes(3).toString("hex");
    console.log(code);
    return code;
  
}