const express = require('express');
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers');
const { TheVideoConverter } = require('@the-/video-converter')
const fs = require('fs');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use("/uploads",express.static(__dirname + '/uploads'));
app.use("/encoded",express.static(__dirname + '/encoded'));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

app.post('/upload-video', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('convs');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select a video to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
		async function tryExample() {
			const converter = new TheVideoConverter()
			await converter.convertIntoMP4("./uploads/"+req.file.filename, "./encoded/"+req.file.filename)
		  }
		   
		  tryExample().catch((err) => console.error(err)).finally(()=> {
			unlinkAsync("./uploads/"+req.file.filename);
			setTimeout(function(){
				unlinkAsync("./encoded/"+req.file.filename);
			},300000);
			  res.send(`You have uploaded this video. Video will be available for 5 minutes. <hr/><video width="320" height="240" controls><source src="./encoded/${req.file.filename}" type="video/mp4">Your browser does not support the video tag.</video><hr /><a href="./">Upload another video.</a>`)
		  });
		/*
		hbjs.spawn({ 
			input: "./uploads/"+req.file.filename, 
			output: "./encoded/"+req.file.filename,
			encoder: "x264",
			format: "av_mp4"
		})
		.on('error', err => {
			console.log(err);
			return res.send('Error:'+err);
		})
		.on('progress', progress => {
		console.log(
		  'Percent complete: %s, ETA: %s',
		  progress.percentComplete,
		  progress.eta
		)
		})
		.on('end',complete=>{
			
			console.log(complete);
			res.send(`You have uploaded this video. Video will be available for 5 minutes. <hr/><video width="320" height="240" controls><source src="./encoded/${req.file.filename}" type="video/mp4">Your browser does not support the video tag.</video><hr /><a href="./">Upload another video.</a>`);
		})

        // Display uploaded image for user validation
        */
    });
});
/*
app.post('/upload-multiple-images', (req, res) => {
    // 10 is the limit I've defined for number of uploaded files at once
    // 'multiple_images' is the name of our file input field
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).array('convm', 10);

    upload(req, res, function(err) {
		console.log(req.files);
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.files) {
            return res.send('Please select videos to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        let result = "You have uploaded these videos. Videos will be available for 5 minutes. <hr />";
		var jobsCompleted=0;
        const files = req.files;

        // Loop through all the uploaded images and display them on frontend
        files.forEach(function(file){
			console.log(file);
			hbjs.spawn({ 
			input: "./uploads/"+file.filename, 
			output: "./encoded/"+file.filename,
			encoder: "x264",
			format: "av_mp4"
			})
			.on('error', err => {
				console.log(err);
				return res.send('Error:'+err);
			})
			.on('progress', progress => {
			console.log(
			  'Percent complete: %s, ETA: %s',
			  progress.percentComplete,
			  progress.eta
			)
			})
			.on('end',complete=>{
				unlinkAsync("./uploads/"+file.filename);
				setTimeout(function(){
					unlinkAsync("./encoded/"+file.filename);
				},300000);
				jobsCompleted++;
				result += `<video width="320" height="240" controls><source src="./encoded/${file.filename}" type="video/mp4">Your browser does not support the video tag.</video>`;
				if(jobsCompleted==files.length){
					result += '<hr/><a href="./">Upload more videos</a>';
					res.send(result);
				}
			})
        });
        
    });
});*/