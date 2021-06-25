const express = require('express')
const router = express.Router();

const directory = 'public/images/';
const fs = require('fs');

const dirTree = require("directory-tree");


//get Images list
router.get("/", async (req, res) => {
    try {
        const tree = dirTree('public/images/');
        console.log(tree);
        // fs.readdir(directory, (err, files) => {
            // console.log(files);
            res.status(200).json({
                code: 200,
                message: "Images fetched successfully",
                data: tree,
                status: true
            //   });
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