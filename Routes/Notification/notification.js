const express = require('express')
const router = express.Router();

//DB schema import
const Notification = require('../../Model/notification');
const Post = require('../../Model/post');


//get Notification list
router.get("/", async (req, res) => {
    try {
      const notification = await Notification.aggregate([{
        $lookup:
        {
          from: Post.collection.name,
          localField: 'postId',
          foreignField: '_id',
          as: 'post'
        }
      }]);
      res.status(200).json({
        code: 200,
        message: "Notification list fetched successfully",
        data: notification,
        status: true
      });
    } catch (error) {
      res.status(500).json({ 
        code: 500,
        message: error,
        data: null,
        status: false 
      });
    }
  });


  //get Notification count
router.get("/count", async (req, res) => {
    try {
      const notification = await Notification.find({isRead:false}).countDocuments();
      res.status(200).json({
        code: 200,
        message: "Notification count fetched successfully",
        data: notification,
        status: true
      });
    } catch (error) {
      res.status(500).json({ 
        code: 500,
        message: error,
        data: null,
        status: false 
      });
    }
  });


//Update notification to read
router.patch("/:notificationId", async (req, res) => {
    try {
      const notification = await Notification.updateOne(
        { _id: req.params.notificationId },
        {
          $set: {
            isRead:true,
          },
        }
      );
      res.status(200).json({
        code: 200,
        message: "Notification updated successfully",
        data: notification,
        status: true
      });
    } catch (error) {
      res.status(500).json({ 
        code: 500,
        message: error,
        data: null,
        status: false 
      });
    }
  });


module.exports = router