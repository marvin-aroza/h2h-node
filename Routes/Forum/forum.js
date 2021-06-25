const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')

//Forum schema import
const Forum = require("../../Model/forum");
const User = require("../../Model/user");
const { Category } = require("../../Model/master");
const validateToken = require("../../Middleware/auth-middleware").validateToken;

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

//get Forum list
router.get("/admin-list/:categoryId?", async (req, res) => {
	try {
		let matchCondition = (req.params.categoryId != null) ? {categoryId:mongoose.Types.ObjectId(req.params.categoryId)} : {}
		const forum = await Forum.aggregate([
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
			message: "Forum list fetched successfully",
			data: forum,
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

//get Forum list
router.get("/:categoryId?", async (req, res) => {
	try {
		let matchCondition = (req.params.categoryId != null) ? {categoryId:mongoose.Types.ObjectId(req.params.categoryId), isActive: true} : {isActive: true}
		const forum = await Forum.aggregate([
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
			message: "Forum list fetched successfully",
			data: forum,
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

//get individual forum details
router.get("/detail/:forumId", async (req, res) => {
	try {
        console.log(req.params.forumId);
		// const forum = await Forum.findById(req.params.forumId);
		const forum = await Forum.aggregate([
            {$match: {_id:mongoose.Types.ObjectId(req.params.forumId)}},
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
			message: "Forum details fetched successfully",
			data: forum,
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

//Delete forum
router.delete("/:forumId", async (req, res) => {
	try {
		const forum = await Forum.deleteOne({ _id: req.params.forumId });
		res.status(200).json({
			code: 200,
			message: "Forum deleted successfully",
			data: forum,
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

//Add Forum
router.post("/", upload.any("image"), validateToken, async (req, res) => {
	console.log(req.files);

	const forum = new Forum({
		title: req.body.title,
		categoryId: req.body.categoryId,
		body: req.body.body,
		image: req?.files[0]?.path,
		createdBy: req.decoded._id,
	});

	try {
		var response = await forum.save();
		res.status(200).json({
			code: 200,
			message: "Forum added successfully..!",
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

//update forum info
router.patch("/:forumId", upload.any(), async (req, res) => {
	try {

		let imageLink = null;
		if(req.files) {
			req.files.forEach(element => {
				if(element.fieldname == 'image')
				  imageLink = element.path;
			  });
		}
		

		const forum = await Forum.updateOne(
			{ _id: req.params.forumId },
			{
				$set: {
					title: req.body.title,
					categoryId: req.body.categoryId,
					body: req.body.body,
					image: (imageLink !== null) ? imageLink : req.body.image,
				},
			}
		);

		res.status(200).json({
			code: 200,
			message: "Forum updated successfully",
			data: forum,
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

//update forum info
router.patch("/update-status/:forumId", upload.any(), async (req, res) => {
	try {
		const forum = await Forum.updateOne(
			{ _id: req.params.forumId },
			{
				$set: {
					isActive: true,
				},
			}
		);

		res.status(200).json({
			code: 200,
			message: "Forum accepted successfully",
			data: forum,
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

module.exports = router;
