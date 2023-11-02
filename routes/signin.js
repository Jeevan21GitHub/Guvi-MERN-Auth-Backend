const express = require("express");
const { CheckUser } = require("../controllers/login");
const { InsertVerifyUser, InsertSignUpUser } = require("../controllers/signin");
const router = express.Router();

router.get("/:token", async (req,res) => {
    try{
        //console.log(req.params.token);
        const response=await InsertSignUpUser(req.params.token)
        
        res.status(200).send(response)
    }
    catch(e){
        console.log(e);
        res.status(500).send(`<html>
        <body>
        <h4>GET: Link Expired....</h4>
        <h5>Welcome to the app</h5>
        <p>you are not successfully registered</p>
        <p>Regard</p>
        <p>Team</p>
        </body>
    </html>`)
    }
})

router.post("/verify", async (req, res) => {
    try {
        const { name, email, password } = await req.body;
        console.log(name, email, password);
        //await CheckUser(email)
        const registerCredentials = await CheckUser(email)
        if (registerCredentials === false) {
            await InsertVerifyUser(name, email, password)
            res.status(200).send(true)
        }
        else if (registerCredentials === true) {
            res.status(200).send(false)
        }
        else if (registerCredentials === "Server Busy") {
            res.status(500).send("Server Busy")
        }
    }
    catch (e) {
        console.log(e);
    }
})

module.exports = router;