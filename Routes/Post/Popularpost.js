const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

//Post schema import
const Post = require('../../Model/post');
const Notification = require('../../Model/notification');
const CommentNotification = require('../../Model/post_notification');
const User = require('../../Model/user');
const {Category} = require('../../Model/master')
//Packages
var multer  = require('multer'); // Package to upload image
const { validateToken } = require('../../Middleware/auth-middleware');
const sendEmail = require('../../Middleware/mailer');


//get popular post
router.get("/", async (req, res) => {
    try {
      const post = await Post.find({isPopular: true});
      res.status(200).json({
        code: 200,
        message: "Popular Post fetched successfully",
        data: post,
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

//Admin can make popular
router.patch("/:postId", async (req, res) => {
    try {
      const post = await Post.updateOne(
        { _id: req.params.postId },
        {
          $set: {
            isPopular:req.body.status,
          },
        }
      );
      res.status(200).json({
        code: 200,
        message: "Post updated as popular successfully",
        data: post,
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