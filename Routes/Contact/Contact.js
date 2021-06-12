const express = require('express')
const router = express.Router();

//DB schema import
const Contact = require('../../Model/contact');

//Add Post
router.post('/', async (req,res)=>{

    const contact = new Contact({
        name:req.body.name,
        email:req.body.email,
        message:req.body.message,
        subject:req.body.subject
    });

    try{
        var response = await contact.save();

        res.status(200).json({
            code:200,
            message:'Contacted successfully..!',
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


//get Contact list
router.get("/", async (req, res) => {
    try {
      const contact = await Contact.find();
      res.status(200).json({
        code: 200,
        message: "Contact list fetched successfully",
        data: contact,
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


  //get Contact count
router.get("/count", async (req, res) => {
    try {
      const contact = await Contact.find({isRead:false}).countDocuments();
      res.status(200).json({
        code: 200,
        message: "Contact count fetched successfully",
        data: contact,
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


//Update Contact to read
router.patch("/:contactId", async (req, res) => {
    try {
      const contact = await Contact.updateOne(
        { _id: req.params.contactId },
        {
          $set: {
            isRead:true,
          },
        }
      );
      res.status(200).json({
        code: 200,
        message: "Contact updated successfully",
        data: contact,
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

  //get indiviual contact details
router.get("/:contactId", async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.contactId);
      res.status(200).json({
        code: 200,
        message: "Contact fetched successfully",
        data: contact,
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

  //Delete Contact
router.delete("/:contactId", async (req, res) => {
    try {
      const contact = await Contact.remove({ _id: req.params.contactId });
      res.status(200).json({
        code: 200,
        message: "Contact deleted successfully",
        data: contact,
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