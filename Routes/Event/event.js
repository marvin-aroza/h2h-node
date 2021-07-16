const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')

//Donate schema import
const Event = require("../../Model/event");

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

//get Event list
router.get("/", async (req, res) => {
	try {
		let filter = 'Pending';
		if(req.query.filter == 'Completed') {
			filter = req.query.filter
		}
		console.log(req.query.filter);
		const event = await Event.find({status: filter}).sort({_id: -1});
		res.status(200).json({
			code: 200,
			message: "Event list fetched successfully",
			data: event,
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

//get individual event details
router.get("/:eventId", async (req, res) => {
	try {
        // console.log(req.params.donateId);
		const event = await Event.findById({_id:req.params.eventId})
		res.status(200).json({
			code: 200,
			message: "Event details fetched successfully",
			data: event,
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

//Delete event
router.delete("/:eventId", async (req, res) => {
	try {
		const event = await Event.deleteOne({ _id: req.params.eventId });
		res.status(200).json({
			code: 200,
			message: "Event deleted successfully",
			data: event,
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

//Add event
router.post("/", upload.any(), async (req, res) => {
	console.log(req.files);

	const event = new Event({
		title: req.body.title,
		host: req.body.host,
		body: req.body.body,
		place: req.body.place,
		address: req.body.address,
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		eventDate: req.body.eventDate,
		image: req?.files[0]?.path
	});

	try {
		var response = await event.save();
		res.status(200).json({
			code: 200,
			message: "Event added successfully..!",
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

//update event info
router.patch("/:eventId", upload.any(), async (req, res) => {
	try {
		let imageLink;
		req.files.forEach(element => {
			if(element.fieldname == 'image')
				imageLink = element.path;
		});
		const event = await Event.updateOne(
			{ _id: req.params.eventId },
			{
				$set: {
					title: req.body.title,
                    host: req.body.host,
                    body: req.body.body,
                    place: req.body.place,
                    address: req.body.address,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
					eventDate: req.body.eventDate,
                    image: (imageLink) ? imageLink : req.body.image
				},
			}
		);

		res.status(200).json({
			code: 200,
			message: "Event updated successfully",
			data: event,
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

//update event status
router.patch("/status-update/:eventId", async (req, res) => {
	try {
		const event = await Event.updateOne(
			{ _id: req.params.eventId },
			{
				$set: {
					status: 'Completed'
				},
			}
		);

		res.status(200).json({
			code: 200,
			message: "Event marked as completed successfully",
			data: event,
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


router.get("/total/count",async (req, res) => {
    try {
      const event = await Event.countDocuments();

      res.status(200).json({
        code: 200,
        message: "Event count fetched successfully",
        data: event,
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

module.exports = router;
