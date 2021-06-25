const express = require('express')
const router = express.Router();

//User schema import
const User = require('../../Model/user');
const validateToken = require('../../Middleware/auth-middleware').validateToken;

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

//get User list
router.get("/",validateToken, async (req, res) => {

    let matchCondition = {}
    if(req.query && req.query.filter) {
      filter = req.query.filter
      console.log("filter");
      matchCondition = (req.query.filter !== 'null') ? {isActive:filter} : {}
    }

    try {
      const user = await User.find(matchCondition);
      res.status(200).json({
        code: 200,
        message: "User list fetched successfully",
        data: user,
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

//get indiviual user details
router.get("/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      res.status(200).json({
        code: 200,
        message: "User fetched successfully",
        data: user,
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

//Delete User
router.delete("/:userId", async (req, res) => {
    try {
      const user = await User.remove({ _id: req.params.userId });
      res.status(200).json({
        code: 200,
        message: "User deleted successfully",
        data: user,
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

  //update user info
router.patch("/:userId",  async (req, res) => {
    try {
      const user = await User.updateOne(
        { _id: req.params.userId },
        {
          $set: {
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            username:req.body.username,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender,
            role:req.body.role
          },
        }
      );
      res.status(200).json({
        code: 200,
        message: "User updated successfully",
        data:user,
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

  //mark user active inactive
  router.patch("/mark-status/:userId",  async (req, res) => {
    try {
      const user = await User.updateOne(
        { _id: req.params.userId },
        {
          $set: {
            isActive:req.body.isActive
          },
        }
      );

      let message = 'User marked as inactive successfully..!'
      if(req.body.isActive === true) {
        message = 'User marked as active successfully..!'
      }
      
      res.status(200).json({
        code: 200,
        message: message,
        data:user,
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

  //profile image upload
  router.patch("/profile-upload/:userId", upload.any('profImage'), async (req, res) => {
    try {
      const user = await User.updateOne(
        { _id: req.params.userId },
        {
          $set: {
            profImage:req.files[0].path
          },
        }
      );
      res.status(200).json({
        code: 200,
        message: "User profile image updated successfully",
        data:user,
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