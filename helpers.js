const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(mp4|MP4|avi|AVI|mov|MOV)$/)) {
        req.fileValidationError = 'Only video files are allowed!';
        return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
};
exports.imageFilter = imageFilter;