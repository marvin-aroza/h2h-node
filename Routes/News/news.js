const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

//News schema import
const News = require('../../Model/news');

//Packages
var multer  = require('multer'); // Package to upload image
const { validateToken } = require('../../Middleware/auth-middleware');

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



//get News list
router.get("/", async (req, res) => {
    try {
      const news = await News.find().sort({_id: -1});
      res.status(200).json({
        code: 200,
        message: "News list fetched successfully",
        data: news,
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

//get individual News details
router.get("/:newsId", async (req, res) => {
    try {
      const news = await News.findById(req.params.newsId);
      res.status(200).json({
        code: 200,
        message: "News details fetched successfully",
        data: news,
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


//Delete news
router.delete("/:newsId", async (req, res) => {
    try {
      const news = await News.remove({ _id: req.params.newsId });
      res.status(200).json({
        code: 200,
        message: "News deleted successfully",
        data: news,
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

//Add News
router.post('/', upload.any('image'), async (req,res)=>{
    console.log(req.files);

    const news = new News({
        title:req.body.title,
        subtitle:req.body.subtitle,
        body:req.body.body,
        image:req.files[0]?.path,
        video:req.files[1]?.path
    });

    try{
        var response = await news.save();

        res.status(200).json({
            code:200,
            message:'News added successfully..!',
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

//update news info
router.patch("/:newsId", upload.any(), async (req, res) => {
    try {
      console.log(req);
      let videoLink, imageLink;
      req.files.forEach(element => {
        if(element.fieldname == 'image')
          imageLink = element.path;
        else if(element.fieldname == 'video')
          videoLink = element.path;
      });
      const news = await News.updateOne(
        { _id: req.params.newsId },
        {
          $set: {
            title:req.body.title,
            subtitle:req.body.subtitle,
            body:req.body.body,
            image:(imageLink) ? imageLink : req.body.image,
            video:(videoLink) ? videoLink : req.body.video
          },
        }
      );

      res.status(200).json({
        code: 200,
        message: "News updated successfully",
        data: news,
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


  router.get("/total/count",async (req, res) => {
    try {
      const news = await News.countDocuments();

      res.status(200).json({
        code: 200,
        message: "News count fetched successfully",
        data: news,
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