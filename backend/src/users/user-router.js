const express = require('express');
const router = express.Router();
const User = require('./user-controller');
const obj = new User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const saltRounds = 10;
//const pwd = 'Shubham';

/* bcrypt.hash(pwd, saltRounds, (err, hash) => {
    // Now we can store the password hash in db.
    console.log(hash);
});

// Load hash from the db, which was preivously stored 
bcrypt.compare('Shubham', '$2b$10$HI1BsBOHU3h0Lty5sih9T.uepOiqSn6uKz3zWlFG718fWQG2otgT.', function (err, res) {
    console.log((res));
}); */

//register user
router.post('/', async (req, res) => {
    //hashing password
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        // Now we can store the password hash in db.
        let result = await obj.insert(req.body,hash);
        if (result) {
            return res.status(200).json('Registered successfully');
        } else {
            return res.status(501).json({
                msg: "Email doesn't exist, Please try again"
            });
        }
    });
})

//verify user and genrate Token
router.post('/login', async (req, res) => {
    let email = req.body.email;
    let result = await obj.findUser(email);
    if (result) {
        let token = jwt.sign({
            data: result
        }, 'secret', {
            expiresIn: '24h'
        });
        return res.status(200).json(token);
    } else {
        return res.status(501).json({
            msg: "Email doesn't exist, Please try again"
        });
    }
});

//get user data on dashboard
router.post('/dashboard', verifyToken, async (req, res) => {
    let id = decodedData.data.id;
    console.log(id);
    let result = await obj.findUserById(id);
    return res.status(200).json(result)
})

decodedData = '';
//verifing token
function verifyToken(req, res, next) {
    let token = req.body.token;
    jwt.verify(token, 'secret', (err, data) => {
        if (data) {
            decodedData = data;
            next();
        }
        if (err) {
            return res.status(501).json('Not verified');
        }
    })
}

//render user data into edit form
router.post('/edit', async (req, res) => {
    let id = req.body.id;
    let result = await obj.findUserById(id);
    if (result) {
        return res.status(200).json(result)
    } else {
        return res.status(501).json('Internal error');
    }
})
//save user edited details
router.put('/editData', obj.updateDetails, async (req, res) => {
    res.status(200).json('Updated successfully');
})
module.exports = router;