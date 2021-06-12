const express = require('express')
const router = express.Router();

//Master schema import
const {Category} = require('../../Model/master');
const {SubCategory} = require('../../Model/master');


//Add categories
router.post('/category',async (req,res)=>{
    console.log('Add category');

    const Cat = new Category({
        name:req.body.name,
    });

    try{
        var response = await Cat.save();
        res.status(200).json({
            code:200,
            message:'Category added successfully..!',
            data:response,
            status: true
        })
    } catch(err) {
        res.status(500).json({
            code: 500,
            message:err,
            data: null,
            status: false
        })
    }
})


//get categories
router.get("/category", async (req, res) => {
    try {
      const cats = await Category.find();
      res.status(200).json({
        code: 200,
        message: "Category list fetched successfully",
        data: cats,
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

//get indiviual category details
router.get("/category/:catId", async (req, res) => {
    try {
      const cats = await Category.findById(req.params.catId);
      res.status(200).json({
        code: 200,
        message: "Category fetched successfully",
        data:cats,
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
router.delete("/category/:catId", async (req, res) => {
    try {
      const cats = await Category.remove({ _id: req.params.catId });
      res.status(200).json({
        code: 200,
        message: "Category Deleted Successfully",
        data:cats,
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

//update category info
router.patch("/category/:catId", async (req, res) => {
    try {
      const cats = await Category.updateOne(
        { _id: req.params.catId },
        {
          $set: {
            name: req.body.name,
          },
        }
      );
      res.status(200).json({
        code: 200,
        message: "Category updated successfully",
        data:cats,
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


//Adding subcategories based on the categories
router.post('/subcategory',async (req,res)=>{
    console.log('Add subcategory');

    const SubCat = new SubCategory({
        name:req.body.name,
        category_id: req.body.category_id
    });

    try{
        var response = await SubCat.save();
        res.status(200).json({
            code:200,
            message:'SubCategory added successfully..!',
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

//get subcategories
router.get("/subcategory", async (req, res) => {
    try {
      const subcats = await SubCategory.find();
      res.status(200).json({
        code: 200,
        message: "Subcategory fetched successfully",
        data: subcats,
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

  //get indiviual subcategory details
router.get("/subcategory/:subcatId", async (req, res) => {
    try {
      const subcats = await SubCategory.findById(req.params.subcatId);
      res.status(200).json({
        code: 200,
        message: "Subcategory fetched successfully",
        data:subcats,
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
router.delete("/subcategory/:subcatId", async (req, res) => {
    try {
      const subcats = await SubCategory.remove({ _id: req.params.subcatId });
      res.status(200).json({
        code: 200,
        message: "Subcategory fetched successfully",
        data:subcats,
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

//update subcategory info
router.patch("/subcategory/:subcatId", async (req, res) => {
    try {
      const subcats = await SubCategory.updateOne(
        { _id: req.params.subcatId },
        {
          $set: {
            name: req.body.name,
            category_id: req.body.category_id
          },
        }
      );
      res.status(200).json({
        code: 200,
        message: "Subcategory fetched successfully",
        data: subcats,
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