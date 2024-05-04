// Desc: Create a token for the user
const jwt = require("jsonwebtoken");

const createToken = (user) => {
    try{
        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return token;
    } catch(err){
        console.log(err);
    }
};

module.exports = createToken;
