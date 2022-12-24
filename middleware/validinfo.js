module.exports = function(req, res, next) {
    const {name, email,  password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
    function validPassword(userPassword){
      return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(userPassword);
    }
  
    if (req.path === "/register" || req.path === "/login") {
      console.log(!email.length);
      if (![email, password].every(Boolean)) {
        return res.status(404).send({"message":"Missing Credentials"});
      } else if (!validEmail(email)) {
        return res.status(404).send({"message":"Invalid Email"});
      }else if(!validPassword(password))  {
        return res.status(404).send({"message":"Password must be at least 8 characters long, have at least on upper case and one lower case letter"})
      }
      
      
      
      // } else if (req.path === "/login") {
    //   if (![email, password].every(Boolean)) {
    //     return res.json("Missing Credentials");
    //   } else if (validEmail(email)) {
    //     return res.json("Invalid Email");
    //   }
    }
  
    next();
  };