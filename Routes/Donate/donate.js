const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')

//Donate schema import
const { Donate, DonateRequest } = require("../../Model/donate");
const User = require("../../Model/user");
const { Category } = require("../../Model/master");
const validateToken = require("../../Middleware/auth-middleware").validateToken;
const sendEmail = require('../../Middleware/mailer');

//Packages
var multer = require("multer"); // Package to upload image
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/images");
	},
	filename: (req, file, cb) => {
		console.log(file);
		var filetype = "";
		if (file.mimetype === "image/gif") {
			filetype = "gif";
		}
		if (file.mimetype === "image/png") {
			filetype = "png";
		}
		if (file.mimetype === "image/jpeg") {
			filetype = "jpg";
		}
		cb(null, "image-" + Date.now() + "." + filetype);
	},
});
var upload = multer({ storage: storage });

//get Donate list
router.get("/:categoryId?", async (req, res) => {
	try {
		let matchCondition = (req.params.categoryId != null) ? {categoryId:mongoose.Types.ObjectId(req.params.categoryId)} : {}
		const donate = await Donate.aggregate([
			{$match: matchCondition},
			{
				$lookup: {
					from: User.collection.name,
					localField: "createdBy",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$lookup: {
					from: Category.collection.name,
					localField: "categoryId",
					foreignField: "_id",
					as: "category",
				},
			},
			{ $sort: { _id: -1 } },
		]);
		res.status(200).json({
			code: 200,
			message: "Donate list fetched successfully",
			data: donate,
			status: true,
		});
	} catch (error) {
		res.status(500).json({
			code: 500,
			message: error,
			data: null,
			status: false,
		});
	}
});

//get individual Donate details
router.get("/detail/:donateId", async (req, res) => {
	try {
        console.log(req.params.donateId);
		const donate = await Donate.aggregate([
            {$match: {_id:mongoose.Types.ObjectId(req.params.donateId)}},
			{
				$lookup: {
					from: User.collection.name,
					localField: "createdBy",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$lookup: {
					from: Category.collection.name,
					localField: "categoryId",
					foreignField: "_id",
					as: "category",
				},
			},
		]);
		res.status(200).json({
			code: 200,
			message: "Donate details fetched successfully",
			data: donate,
			status: true,
		});
	} catch (error) {
		res.status(500).json({
			code: 500,
			message: error,
			data: null,
			status: false,
		});
	}
});

//Delete Donate
router.delete("/:donateId", async (req, res) => {
	try {
		const donate = await Donate.deleteOne({ _id: req.params.donateId });
		res.status(200).json({
			code: 200,
			message: "Donate deleted successfully",
			data: donate,
			status: true,
		});
	} catch (error) {
		res.status(500).json({
			code: 500,
			message: error,
			data: null,
			status: false,
		});
	}
});

//Add Donate
router.post("/", upload.any("image"), validateToken, async (req, res) => {
	console.log(req.files);

	const donate = new Donate({
		title: req.body.title,
		categoryId: req.body.categoryId,
		body: req.body.body,
		image: req?.files[0]?.path,
		createdBy: req.decoded._id,
	});

	try {
		var response = await donate.save();
		res.status(200).json({
			code: 200,
			message: "Donate added successfully..!",
			data: response,
			status: true,
		});
	} catch (err) {
		res.status(500).json({
			code: 500,
			message: error,
			data: null,
			status: false,
		});
	}
});

//update Donate info
router.patch("/:donateId", upload.any("image"), async (req, res) => {
	try {
		const donate = await Donate.updateOne(
			{ _id: req.params.donateId },
			{
				$set: {
					title: req.body.title,
					categoryId: req.body.categoryId,
					body: req.body.body,
					image: req.files[0].path,
				},
			}
		);

		res.status(200).json({
			code: 200,
			message: "Donate updated successfully",
			data: donate,
			status: true,
		});
	} catch (error) {
		res.status(500).json({
			code: 500,
			message: error,
			data: null,
			status: false,
		});
	}
});


//request donation
router.post("/donate-request/", validateToken, async (req, res) => {

	const donate = new DonateRequest({
		body: req.body.body,
		donateId: req.body.donateId,
		createdBy: req.decoded._id
	});

	try {
		var response = await donate.save();
		res.status(200).json({
			code: 200,
			message: "Donate request sent successfully..!",
			data: response,
			status: true,
		});
	} catch (err) {
		res.status(500).json({
			code: 500,
			message: err,
			data: null,
			status: false,
		});
	}
});


//request donation
router.get("/donate-request/list", async (req, res) => {
	const donate = await DonateRequest.aggregate([
		{$match: {isActive:true}},
		{
        	$lookup: {
				from: Donate.collection.name,
				localField: 'donateId',
				foreignField: '_id',
				as: 'donation'
			}
		},
		{
			$lookup: {
				from: User.collection.name,
				localField: "createdBy",
				foreignField: "_id",
				as: "user",
			},
		}
	]);
	try {
		res.status(200).json({
			code: 200,
			message: "Donate request list fetched successfully..!",
			data: donate,
			status: true,
		});
	} catch (err) {
		res.status(500).json({
			code: 500,
			message: err,
			data: null,
			status: false,
		});
	}
});

//request donation
router.get("/donate-request/single/:donateRequestId", async (req, res) => {
	const donate = await DonateRequest.aggregate([
		{$match: {_id:mongoose.Types.ObjectId(req.params.donateRequestId)}},
		{
			$lookup: {
				from: Donate.collection.name,
				localField: 'donateId',
				foreignField: '_id',
				as: 'donation'
			}
		},
		{
			$lookup: {
				from: User.collection.name,
				localField: "createdBy",
				foreignField: "_id",
				as: "user",
			},
		}
	]);
	try {
		res.status(200).json({
			code: 200,
			message: "Donate request list fetched successfully..!",
			data: donate,
			status: true,
		});
	} catch (err) {
		res.status(500).json({
			code: 500,
			message: err,
			data: null,
			status: false,
		});
	}
});


//request donation
router.get("/donate-request/confirm/:donateRequestId", async (req, res) => {

	const updateDonate = await DonateRequest.updateOne({_id:req.params.donateRequestId},{$set:{isActive:false}});

	const donate = await DonateRequest.aggregate([
		{$match: {_id:mongoose.Types.ObjectId(req.params.donateRequestId)}},
		{
			$lookup: {
				from: Donate.collection.name,
				localField: 'donateId',
				foreignField: '_id',
				as: 'donation'
			}
		},
		{
			$lookup: {
				from: User.collection.name,
				localField: "createdBy",
				foreignField: "_id",
				as: "user",
			},
		}
	]);
	console.log(donate[0].donation[0]._id);

	const donationDetails = await Donate.aggregate([
		{$match: {_id:mongoose.Types.ObjectId(donate[0].donation[0]._id)}},
		{
			$lookup: {
				from: User.collection.name,
				localField: "createdBy",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$lookup: {
				from: Category.collection.name,
				localField: "categoryId",
				foreignField: "_id",
				as: "category",
			},
		},
	]);

	// console.log(donationDetails);

	//send donation email
	let emailOptions = {
		to: donationDetails[0].user[0].email,
		subject: 'Donation Request Confirmed ',
		text: 'You donation has been requested. Please check details',
		requestDetails: donate[0].body,
		requestEmail: donate[0].user[0].email,
		requestName: donate[0].user[0].firstname+' '+donate[0].user[0].lastname,
		requestPhone: donate[0].user[0].phone
	  }
	  const emailResponse = await sendEmail('donation', emailOptions);

	  //send donation email
	let emailOptions1 = {
		to: donate[0].user[0].email,
		subject: 'Donation request accepted',
		text: 'Your Donation request has been confirmed',
		name: donate[0].user[0].firstname+' '+donate[0].user[0].lastname
	  }
	  const emailResponse1 = await sendEmail('donationRequest', emailOptions1);

	try {
		res.status(200).json({
			code: 200,
			message: "Donate request confirmed successfully..!",
			data: '',
			status: true,
		});
	} catch (err) {
		res.status(500).json({
			code: 500,
			message: err,
			data: null,
			status: false,
		});
	}
});

//request donation
router.get("/donation/count", async (req, res) => {
	const donate = await Donate.aggregate([
		{
			$lookup: {
				from: Category.collection.name,
				localField: "categoryId",
				foreignField: "_id",
				as: "category",
			},
		},
	]);
	// console.log(donate);


	  const groupBy = (array, key) => {
		return array.reduce((result, currentValue) => {
		  (result[currentValue.category[0].name] = result[currentValue.category[0].name] || []).push(
			currentValue
		  );
		  return result;
		}, {});
	  };
	  
	  let finalObj = [[]];
	  finalObj.push({total: donate.length});
	  const finalDonationList = groupBy(donate, "categoryId");

	  Object.entries(finalDonationList).forEach(
			([key, value]) => {
				console.log(key)
				finalObj[0].push({key:key, value:value.length, percentage: Math.round((value.length * 100 )/donate.length)});
				// finalObj[key] = value.length
			}
		);
	  res.status(200).json({
		code: 200,
		message: "Donation details fetched successfully..!",
		data: finalObj,
		status: true,
	});
	  
});

module.exports = router;
