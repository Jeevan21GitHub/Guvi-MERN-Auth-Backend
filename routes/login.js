const express = require("express");
const { route } = require("./signin");
const { AuthenticationUser } = require("../controllers/login");
const client = require("../redis");
const router = express.Router();

client
    .connect()
    .then(()=>{
        console.log("connected to redis");
    })
    .catch((e)=>{
        console.log(e);
    })

router.post("/",async(req,res)=>{
    const {email,password}=req.body;
    const loginCredentials=await AuthenticationUser(email,password);
    console.log(loginCredentials);
    if(loginCredentials==="Invalid User name or Password"){
        res.status(200).send("Invalid User name or Password")
    }
    else if(loginCredentials==="Server Busy"){
        res.status(200).send("Server Busy")
    }
    else{
        res.status(200).json({token:loginCredentials.token})
    }
})

module.exports=router;