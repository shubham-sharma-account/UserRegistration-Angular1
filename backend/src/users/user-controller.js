const {
    Person
} = require('./user-model');
const {
    Op
} = require("sequelize");
const bcrypt = require('bcrypt');

class Users {
    //creating new user
    async insert(body, hash) {
        let myJson = {
            name: body.name,
            email: body.email,
            password: hash,
            phone: body.phone,
            date: body.date,
            gender: body.gender,
            address1: body.address1,
            address2: body.address2,
            city: body.city,
            state: body.state,
            zip: body.zip
        }
        try {
            const data = await Person.findOne({
                where: {
                    email: myJson.email
                }
            });
            if (data) {
                return 0;
            } else {
                await Person.create(myJson);
                return 1;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async findUser(email) {
        try {
            let data = await Person.findOne({
                where: {
                    email: {
                        [Op.eq]: email
                    }
                }
            });
            return Promise.resolve(data)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    async findUserById(id) {
        try {
            let data = await Person.findOne({
                where: {
                    id: {
                        [Op.eq]: id
                    }
                }
            });
            return Promise.resolve(data)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /* async updateDetails(req, res, next) {
        let email = req.body.email;
        await Person.update({
            name: req.body.name,
            phone: req.body.phone,
            date: req.body.date,
            gender: req.body.gender,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.send,
            zip: req.body.zip
        }, {
            where: {
                email: email
            }
        }).then((data) => {
            if (data) {
                next();
            } else {
                res.status(501).send('No data found');
            }
        });
    } */

    async updateDetails(req, res, next) {
        let email = req.body.email;
        let oldPass = req.body.oldPassword;             //getting old password value
        try {
            let data = await Person.findOne({
                where: {
                    email: {
                        [Op.eq]: email
                    }
                }
            });
            console.log(data);
            if (data) {
                //compare old password with new password
                bcrypt.compare(oldPass, data.password, async function (err, result) { 
                    //if true only than update data    
                    if (result) {
                        bcrypt.hash(req.body.password, 10, async (err, hash) => {
                            await Person.update({
                                name: req.body.name,
                                phone: req.body.phone,
                                date: req.body.date,
                                password: hash,
                                gender: req.body.gender,
                                address1: req.body.address1,
                                address2: req.body.address2,
                                city: req.body.city,
                                state: req.body.send,
                                zip: req.body.zip
                            }, {
                                where: {
                                    email: email
                                }
                            }).then((result) => {
                                if (result) {
                                    next();
                                } else {
                                    res.status(501).json({
                                        msg: 'No data found'
                                    });
                                }
                            });
                        })
                    } else {
                        res.status(501).json({
                            msg: 'Old password is incorrect'
                        });
                    }
                });
            } else {
                res.status(501).json({
                    msg: 'Data not found'
                });
            }
        } catch (error) {

        }
    }
}

module.exports = Users;