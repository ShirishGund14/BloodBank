const router = require('express').Router();

const bcrypt = require('bcryptjs');
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const Inventory = require('../models/inventoryModel')
const mongoose = require('mongoose')


//Register new user
router.post('/register', async (req, res) => {

    try {
        //check if user already exists
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.send({
                success: false,
                message: 'User already exists',
            })
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        //save user
        const newUser = new User(req.body);
        await newUser.save();

        res.send({
            success: true,
            message: 'User Registered Succesfully !!'
        })

    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        })
    }

})

//user Login
router.post('/login', async (req, res) => {

    try {
        //check if user already exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.send({
                success: false,
                message: 'User not found ',
            })

        }

        //check if usertype matches
        if (user.userType !== req.body.userType) {
            return res.send({
                success: false,
                message: `User is not registered as ${req.body.userType} `,
            })
        }




        //compare password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.send({
                success: false,
                message: 'Invalid password',
            })

        }

        //create and assign token
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '7d' })
        res.send({
            success: true,
            message: 'User Logged in Succesfully !!',
            data: token,
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }

})

//get current user

router.get('/get-current-user', authMiddleware, async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.body.userId });


        res.send({
            success: true,
            message: 'User Fetched Succesfully',
            data: user,
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }

})

//get all unique donars

router.get('/get-all-donars', authMiddleware, async (req, res) => {

    try {
        //get all unique donar ids from inventory
        const organization = new mongoose.Types.ObjectId(req.body.userId)
        const uniqueDonarIds = await Inventory.distinct('donar',{
            organization,
        })


        const donars=await User.find({
            _id:{$in:uniqueDonarIds},
        })
        res.send({
            success: true,
            message: 'Donars Fetched Succesfully',
            data: donars,
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }

})


//get all unique hospitals

router.get('/get-all-hospitals', authMiddleware, async (req, res) => {

    try {
        //get all unique hospital ids from inventory
        const organization = new mongoose.Types.ObjectId(req.body.userId)
        const uniqueHospitalIds = await Inventory.distinct('hospital',{
            organization,
        })


        const hospitals=await User.find({
            _id:{$in:uniqueHospitalIds},
        })

        res.send({
            success: true,
            message: 'Hospitals Fetched Succesfully',
            data: hospitals,
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }

})

//get all unique organization for donars
router.get('/get-all-organizations-of-a-donar', authMiddleware, async (req, res) => {

    try {
        //get all unique organization ids from inventory
        const donar = new mongoose.Types.ObjectId(req.body.userId)
        const uniqueOraganizationIds = await Inventory.distinct('organization',{
            donar,
        })


        const hospitals=await User.find({
            _id:{$in:uniqueOraganizationIds},
        })

        res.send({
            success: true,
            message: 'Organizations Fetched Succesfully',
            data: hospitals,
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }

})

//get all unique organization for Hospital
router.get('/get-all-organizations-of-a-hospital', authMiddleware, async (req, res) => {

    try {
        //get all unique organization ids from inventory
        const hospital = new mongoose.Types.ObjectId(req.body.userId)
        const uniqueOraganizationIds = await Inventory.distinct('organization',{
            hospital,
        })


        const hospitals=await User.find({
            _id:{$in:uniqueOraganizationIds},
        })

        res.send({
            success: true,
            message: 'Organizations Fetched Succesfully',
            data: hospitals,
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }

})

module.exports = router;