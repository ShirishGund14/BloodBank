const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware')
const Inventory = require('../models/inventoryModel')
const mongoose = require('mongoose');



router.get('/blood-groups-data', authMiddleware, async (req, res) => {

    try {
        const allBloodGroups = ['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-']
        const organization = new mongoose.Types.ObjectId(req.body.userId)
        const bloodGroupsData=[];

        await Promise.all(
            allBloodGroups.map(async (bloodGroup) => {
                const totalIn =await Inventory.aggregate([
                    {
                        $match: {
                            bloodGroup: bloodGroup,
                            inventoryType: 'in',
                            organization,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: '$quantity',
                            },
                        },
                    },
                ]);

               const totalOut =await Inventory.aggregate([
                    {
                        $match: {
                            bloodGroup: bloodGroup,
                            inventoryType: 'out',
                            organization,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: '$quantity',
                            },
                        },
                    },
                ]);

                const available=(totalIn[0]?.total || 0) - (totalOut[0]?.total || 0)

                bloodGroupsData.push({
                    bloodGroup,
                    totalIn:totalIn[0]?.total || 0,
                    totalOut:totalOut[0]?.total || 0,
                    available,
                })
            })
        );











        return res.send({
            success: true,
            message: 'Blood Group Data',
            data: bloodGroupsData,
        })

    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        })
    }

})

module.exports = router;