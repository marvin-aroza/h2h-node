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

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});


//get individual user post list
router.get("/user-posts", validateToken, async (req, res) => {
  try {
    const post = await Post.find({createdBy: mongoose.Types.ObjectId(req.decoded._id)});
    res.status(200).json({
      code: 200,
      message: "Post details fetched successfully",
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

//get Post list
router.get("/list/:catId", async (req, res) => {
  try {

		const post = await Post.aggregate([
			{$match: { category_id: mongoose.Types.ObjectId(req.params.catId), status: 'accept'}},
			{
				$lookup: {
					from: User.collection.name,
					localField: "createdBy",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $sort: { _id: -1 } },
		]);

    res.status(200).json({
      code: 200,
      message: "Post list fetched successfully",
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

//get Post list
router.get("/all-list/:limit?", async (req, res) => {
    try {
      let limit = 100;
      let filter;
      console.log(req.params.limit);
      if(req.params.limit) {
        limit = parseInt(req.params.limit)
      }

      if(req.query) {
        filter = req.query.filter
        console.log(filter);
      }
      const post = await Post.aggregate([{
        $lookup : {
          from : User.collection.name,
          localField : 'createdBy' ,
          foreignField : '_id',
          as : 'firstname',
          // let: { createdBy: '$createdBy' },
          // pipeline: [
          //   {
          //     $match: {
          //       $expr: {
          //         $and: [
          //           { $eq: ['$_id', '$$createdBy'] },
          //           { $eq: ['$role', 'Admin'] },
          //         ]
          //       }
          //     }
          //   }
          // ]
        }
      },
      {
        $lookup : {
          from : Category.collection.name,
          localField : 'category_id' ,
          foreignField : '_id',
          as : 'category'
        }
      },
      {
        $sort : { _id: -1}
      }
    ]).limit(limit);

      res.status(200).json({
        code: 200,
        message: "Post list fetched successfully",
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

//get individual post details
router.get("/:postId", async (req, res) => {
    try {
      // const post = await Post.findById(req.params.postId);
      const post = await Post.aggregate([
        {$match: {_id: mongoose.Types.ObjectId(req.params.postId)}},
        {
          $lookup : {
            from : User.collection.name,
            localField : 'createdBy' ,
            foreignField : '_id',
            as : 'user'
          }
        },
      ]);
      res.status(200).json({
        code: 200,
        message: "Post details fetched successfully",
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


//Delete category
router.delete("/:postId", async (req, res) => {
    try {
      const post = await Post.remove({ _id: req.params.postId });
      res.status(200).json({
        code: 200,
        message: "Post deleted successfully",
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

//Add Post
router.post('/', upload.any(),async (req,res)=>{

  let videoLink, imageLink;
      req.files.forEach(element => {
        if(element.fieldname == 'image')
          imageLink = element.path;
        else if(element.fieldname == 'video')
          videoLink = element.path;
      });

    const post = new Post({
        title:req.body.title,
        category_id:req.body.category_id,
        subtitle:req.body.subtitle,
        description:req.body.description,
        image:imageLink,
        video:videoLink,
        createdBy:req.body.createdBy,
        status:req.body.status,
        comments:req?.body?.comments
    });

    try{
        var response = await post.save();
        console.log(response);
        //Save notification for this post
        const notification = new Notification({
          postId: response._id
        })
        await notification.save();

        //send welcome email
        let emailOptions = {
          to: 'vamore5996@gmail.com',
          subject: 'New Post',
          text: 'There is a new post. Please check',
          postId: response._id
        }
        const emailResponse = sendEmail('post', emailOptions);

        res.status(200).json({
            code:200,
            message:'Post added successfully..!',
            data:response,
            status: true
        })
    } catch(err) {
      res.status(500).json({ 
        code: 500,
        message: err,
        data: null,
        status: false 
      });
    }
})

//update post info
router.patch("/:postId", upload.any(), async (req, res) => {
    try {
console.log(req.files);
      let videoLink, imageLink;
      req.files.forEach(element => {
        if(element.fieldname == 'image')
          imageLink = element.path;
        else if(element.fieldname == 'video')
          videoLink = element.path;
      });
      
      const post = await Post.updateOne(
        { _id: req.params.postId },
        {
          $set: {
            title:req.body.title,
            subtitle:req.body.subtitle,
            description:req.body.description,
            image:imageLink,
            video:videoLink,
            createdBy:req.body.createdBy
          },
        }
      );

      //Save notification for this post
      const notification = await Notification.findOneAndUpdate({
        postId: req.params.postId
      },
      {
        $set: {
          isRead:false
        }
      })
      await notification.save();

      res.status(200).json({
        code: 200,
        message: "Post updated successfully",
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

//Change post status
router.patch("/status-update/:postId/:status",async(req,res)=>{
  
  try{
    const post = await Post.updateOne(
      {
        _id:req.params.postId
      },
      {
        $set:{
          status:req.params.status
        }
      }
    );
    //To add notifications here
   
    let stat = req.params.status
    let msg = ''
    if(stat === 'accept')
      msg = 'Post accepted to upload!'
    else if(stat === 'reject')
      msg = 'Post rejected'

    res.status(200).json({
      code: 200,
      message: msg,
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
})

//Admin can add the comments
router.patch('/add-comments/:postId',async(req,res)=>{
  try{
    // const post = Post.updateOne(
    //   {
    //     _id:req.params.postId
    //   },
    //   {
    //     $set:{
    //       comments:req.body.comments
    //     }
    //   }
    // );

    Post.findByIdAndUpdate(req.params.postId,{$set:{comments:req.body.comments}},{new:true}, async function(err, result){
      if(err){
          console.log(err);
      }

      console.log(result._id);
      //To add notifications here
      const notif = new CommentNotification({
        postId:result._id,
        userId:result.createdBy
      });

      var notifResponse = await notif.save();

      res.status(200).json({
        code: 200,
        message: "Comments added successfully!",
        data: '',
        status: true
      });
  });

    
  } catch (error) {
    res.status(500).json({ 
      code: 500,
      message: error,
      data: null,
      status: false 
    });
  }
})

router.get("/total/count",async (req, res) => {
  try {
    const post = await Post.countDocuments();

    res.status(200).json({
      code: 200,
      message: "Post count fetched successfully",
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