const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

//DB schema import
const Comment = require('../../Model/discussion_comments');
const User = require('../../Model/user');
const validateToken = require('../../Middleware/auth-middleware').validateToken;

//Add Comment
router.post('/', validateToken, async (req,res)=>{

    const comment = new Comment({
        forumId:req.body.forumId,
        comment:req.body.comment,
        createdBy:req.decoded._id
    });

    try{
        var response = await comment.save();

        res.status(200).json({
            code:200,
            message:'Comment added successfully..!',
            data:response,
            status: true
        })
    } catch(err) {
      res.status(500).json({ 
        code: 500,
        message: error,
        data: null,
        status: false 
      });
    }
})


//get Comment list
router.get("/:forumId", async (req, res) => {
    try {
      // const comment = await Comment.find({forumId: req.params.forumId});
      const comment = await Comment.aggregate([
        {$match: {forumId:mongoose.Types.ObjectId(req.params.forumId)}},
        {
          $lookup: {
            from: User.collection.name,
            localField: "createdBy",
            foreignField: "_id",
            as: "user",
          },
        },
      ]);
      res.status(200).json({
        code: 200,
        message: "Comment list fetched successfully",
        data: comment,
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


  //get Comment count
router.get("/count/:forumId", async (req, res) => {
    try {
        // console.log(req.params.postId);
      const comment = await Comment.find({isReport:false,isActive:true,postId:req.params.forumId}).countDocuments();
      res.status(200).json({
        code: 200,
        message: "Comment count fetched successfully",
        data: comment,
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


//Update Comment to reported
router.patch("/report/:commentId", async (req, res) => {
    try {
      const comment = await Comment.updateOne(
        { _id: req.params.commentId },
        {
          $set: {
            isReport:true,
          },
        }
      );
      res.status(200).json({
        code: 200,
        message: "Comment reported successfully",
        data: comment,
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

  //get individual comment details
router.get("/:commentId", async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      res.status(200).json({
        code: 200,
        message: "Discussion fetched successfully",
        data: comment,
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

  //Delete Comment
router.delete("/:commentId", async (req, res) => {
    try {
      const comment = await Comment.deleteOne({ _id: req.params.commentId });
      res.status(200).json({
        code: 200,
        message: "Discussion deleted successfully",
        data: comment,
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