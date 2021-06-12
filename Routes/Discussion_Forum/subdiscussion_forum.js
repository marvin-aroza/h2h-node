const express = require('express')
const router = express.Router();

//DB schema import
const { Discussion, SubDiscussion } = require('../../Model/discussion');
const validateToken = require('../../Middleware/auth-middleware').validateToken;

//Add Sub Comment
router.post('/', validateToken, async (req,res)=>{

    const subDiscussion = new SubDiscussion({
        commentId:req.body.commentId,
        comment:req.body.comment,
        createdBy:req.decoded._id
    });

    try{
        var response = await subDiscussion.save();

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


//get SubComment list
router.get("/", async (req, res) => {
    try {
      const subDiscussion = await SubDiscussion.find();
      res.status(200).json({
        code: 200,
        message: "Comment list fetched successfully",
        data: subDiscussion,
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


  //get Sub Comment count
router.get("/count/:commentId", async (req, res) => {
    try {
        // console.log(req.params.postId);
      const subDiscussion = await SubDiscussion.find({isReport:false,isActive:true,postId:req.params.commentId}).countDocuments();
      res.status(200).json({
        code: 200,
        message: "Comment count fetched successfully",
        data: subDiscussion,
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


//Update SubComment to reported
router.patch("/report/:commentId", async (req, res) => {
    try {
      const discussion = await Discussion.updateOne(
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
        data: discussion,
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

  //get individual Subcomment details
router.get("/:commentId", async (req, res) => {
    try {
      const subDiscussion = await SubDiscussion.findById(req.params.commentId);
      res.status(200).json({
        code: 200,
        message: "SubDiscussion fetched successfully",
        data: subDiscussion,
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

  //Delete Sub Comment
router.delete("/:commentId", async (req, res) => {
    try {
      const subDiscussion = await SubDiscussion.deleteOne({ _id: req.params.commentId });
      res.status(200).json({
        code: 200,
        message: "SubDiscussion deleted successfully",
        data: subDiscussion,
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