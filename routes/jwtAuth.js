const router = require('express').Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwtGenerator=require('../utils/jwtGenerator')
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");

//registering
router.post('/register',validInfo, async(req,res) =>{
    try {

        //1.DEStructor the req.body (name,email,password)

            const {name,email,password} = req.body;

        //2.check if user exist(if user exist then throw error)
             
            const user  = await pool.query('SELECT * FROM users WHERE user_email=$1',
            [email]);
       if (user.rows.length !== 0) {
       return res.status(401).json('USER ALREADY EXIST' );
     }
        
        //3.bcryot the user password
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPassword = await bcrypt.hash(password,salt);
            
            //console.log(bcryptPassword)
        //4enter the new user inside our db


        await pool.connect();           // gets connection
        await pool.query(
            `INSERT INTO users (user_name, user_email,user_password)  
             VALUES ($1, $2, $3)`, [name, email,bcryptPassword]); // sends queries
             
        // let newUser = await pool.query("INSERT INTO users (user_name,user_email,user_password)  VALUES($1,$2,$3), RETURNIG *" [name,email,bcryptPassword]);
        //   res.json(newUser.rows[0]);  
        //5 generating our jwt token
     
        const token = jwtGenerator(email);
        
    
        return res.json({token});

    } catch (err) {
        console.error(err.message)
       return res.send(err)
    }
});
 //login  route
    router.post('/login',validInfo, async(req,res)  => {
        try {
            //1.Destructure the req.body
            const{ email,password} = req.body
            //2.Chechk if user  doesn't exist(if not then we throw error)
             const user = await pool.query('SELECT * FROM users WHERE user_email =$1',[email]);
            if (user.rows.length===0){
                
                return res.status(401).send({"message":"PASSWORD OR EMAIL IS INCORRECT,PLEASE TRY AGAIN"})
            }
            const validPassword = await bcrypt.compare(password,user.rows[0].user_password)
            if(!validPassword){
                return res.status(401).send({"message":"PASSWORD OR EMAIL IS INCORRECT,PLEASE TRY AGAIN"})
            }

            const token = jwtGenerator(user.rows[0].user_id)

            res.json({token})
            //res.send({"message":"Success","token":token})
        } catch (err) {
            console.log(err.message)
            return res.send('erora brnel')
        }
    })
    router.post("/verify", authorize, (req, res) => {
        try {
          res.json(true);
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server error");
        }
      });


module.exports = router;