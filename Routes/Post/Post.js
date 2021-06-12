const express = require('express')
const router = express.Router();

//Post schema import
const Post = require('../../Model/post');
const Notification = require('../../Model/notification');

//Packages
var multer  = require('multer'); // Package to upload image
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

//get Post list
router.get("/", async (req, res) => {
    try {
      const post = await Post.find();
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
      const post = await Post.findById(req.params.postId);
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
router.post('/', upload.any('image'),async (req,res)=>{
    console.log(req.files);

    const post = new Post({
        title:req.body.title,
        subtitle:req.body.subtitle,
        description:req.body.description,
        image:req.files[0].path,
        video:req.files[1].path,
        createdBy:req.body.createdBy
    });

    try{
        var response = await post.save();
        console.log(response);
        //Save notification for this post
        const notification = new Notification({
          postId: response._id
        })
        await notification.save();
        res.status(200).json({
            code:200,
            message:'Post added successfully..!',
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

//update post info
router.patch("/:postId", upload.any('image'), async (req, res) => {
    try {
      const post = await Post.updateOne(
        { _id: req.params.postId },
        {
          $set: {
            title:req.body.title,
            subtitle:req.body.subtitle,
            description:req.body.description,
            image:req.files[0].path,
            video:req.files[1].path,
            createdBy:req.body.createdBy
          },
        }
      );

      //Save notification for this post
      const notification = await Notification.updateOne({
        postId: req.params.postId
      },
      {
        $set: {
          isRead:true
        },
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


module.exports = router