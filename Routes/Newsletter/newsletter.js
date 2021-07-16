const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

//News schema import
const { Newsletter, NewsletterSubscription} = require('../../Model/newsletter');
const sendEmail = require('../../Middleware/mailer');

//get Newsltter list
router.get("/", async (req, res) => {
    try {
      const newsletter = await Newsletter.find().sort({_id: -1});
      res.status(200).json({
        code: 200,
        message: "Newsletter list fetched successfully",
        data: newsletter,
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

//get individual Newsletter details
router.get("/:newsletterId", async (req, res) => {
    try {
      const newsletter = await Newsletter.findById(req.params.newsletterId);
      res.status(200).json({
        code: 200,
        message: "Newsletter details fetched successfully",
        data: newsletter,
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


//Delete newsletter
router.delete("/:newsletterId", async (req, res) => {
    try {
      const newsletter = await Newsletter.remove({ _id: req.params.newsletterId });
      res.status(200).json({
        code: 200,
        message: "Newsletter deleted successfully",
        data: newsletter,
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

//Add Newsletter
router.post('/', async (req,res)=>{

    const news = new Newsletter({
        body:req.body.body,
    });

    try{
        var response = await news.save();

        res.status(200).json({
            code:200,
            message:'Newsletter added successfully..!',
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

//update newsletter info
router.patch("/:newsletterId", async (req, res) => {
    try {
      const newsletter = await Newsletter.updateOne(
        { _id: req.params.newsletterId },
        {
          $set: {
            body:req.body.body
          },
        }
      );

      res.status(200).json({
        code: 200,
        message: "Newsletter updated successfully",
        data: newsletter,
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


//Add Newsletter subscription
router.post('/subscribe-newsletter', async (req,res)=>{

    try{

      const checkEmail = await NewsletterSubscription.find({email : req.body.email});
      if(checkEmail.length > 0) {
        return res.status(400).json({
          code:400,
          message:'Your are already subscribed to newsletter!',
          data:null,
          status: false
        })
      }

      const subscriptions = new NewsletterSubscription({
          email:req.body.email,
      });

        var response = await subscriptions.save();

        return res.status(200).json({
            code:200,
            message:'Subscribed to Newsletters successfully..!',
            data:response,
            status: true
        })
    } catch(err) {
      return res.status(500).json({ 
        code: 500,
        message: err,
        data: null,
        status: false 
      });
    }
})

//Send Newsletter
router.post('/send-newsletter/:newsletterId', async (req,res)=>{


  const updated = await Newsletter.updateOne(
    { _id: req.params.newsletterId },
    {
      $set: {
        status: 'Completed'
      },
    });

  const subscriptions = await NewsletterSubscription.find();
  const newsletterData = await Newsletter.find({ _id: req.params.newsletterId });
console.log(newsletterData);
  try{
      
    subscriptions.forEach(element => {
      console.log(element.email);
      if(element.email) {
        sendEmail('newsletter', {to:element.email, subject: 'New newsletter', body: newsletterData[0].body});
      }
    });

      res.status(200).json({
          code:200,
          message:'Newsletters shared successfully..!',
          data:'',
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



module.exports = router