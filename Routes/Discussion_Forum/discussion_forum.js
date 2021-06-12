const express = require('express')
const router = express.Router();

//DB schema import
const { Discussion, SubDiscussion } = require('../../Model/discussion');
const validateToken = require('../../Middleware/auth-middleware').validateToken;

//Add Comment
router.post('/', validateToken, async (req,res)=>{

    const discussion = new Discussion({
        postId:req.body.postId,
        comment:req.body.comment,
        createdBy:req.decoded._id
    });

    try{
        var response = await discussion.save();

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
router.get("/", async (req, res) => {
    try {
      const discussion = await Discussion.find();
      res.status(200).json({
        code: 200,
        message: "Comment list fetched successfully",
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


  //get Comment count
router.get("/count/:postId", async (req, res) => {
    try {
        // console.log(req.params.postId);
      const discussion = await Discussion.find({isReport:false,isActive:true,postId:req.params.postId}).countDocuments();
      res.status(200).json({
        code: 200,
        message: "Comment count fetched successfully",
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


//Update Comment to reported
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

  //get individual comment details
router.get("/:commentId", async (req, res) => {
    try {
      const discussion = await Discussion.findById(req.params.commentId);
      res.status(200).json({
        code: 200,
        message: "Discussion fetched successfully",
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

  //Delete Comment
router.delete("/:commentId", async (req, res) => {
    try {
      const discussion = await Discussion.deleteOne({ _id: req.params.commentId });
      res.status(200).json({
        code: 200,
        message: "Discussion deleted successfully",
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


module.exports = router