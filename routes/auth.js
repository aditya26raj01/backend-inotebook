const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
var JWT = require("jsonwebtoken")

const JWT_SECRET = "harryisagoodb$oy"

// Create a User using: POST "/api/auth/createuser" Doesnt Require Auth


router.post("/createuser", [
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password must be of 5 characters").isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists!" })
        }
        const salt = await bcrypt.genSalt(10)
        const securedPassword = await bcrypt.hash(req.body.password, salt)

        // Create a New User
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securedPassword,
        })

        const data = {
            user:{
                id: user.id
            }
        }

        const authToken = JWT.sign(data,JWT_SECRET)

        res.json({authToken:authToken})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some Error Occured!")
    }
})

module.exports = router