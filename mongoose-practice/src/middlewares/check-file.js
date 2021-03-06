const { ErrorHandler, errors: { TOO_BIG_FILE, WRONG_FILE_EXTENSION } } = require('../errors');
const {
    constants: {
        PHOTO_MAX_SIZE, DOC_MAX_SIZE, PHOTOS_MIMETYPES, DOCS_MIMETYPES
    }
} = require('../configs');

module.exports = (req, res, next) => {
    try {
        const { files } = req;

        const docs = [];
        const photos = [];

        const allFiles = Object.values(files);

        for (let i = 0; i < allFiles.length; i++) {
            const { mimetype, size } = allFiles[i];

            if (DOCS_MIMETYPES.includes(mimetype)) {
                if (size > DOC_MAX_SIZE) {
                    throw new ErrorHandler(TOO_BIG_FILE.message, TOO_BIG_FILE.code);
                }

                docs.push(allFiles[i]);
            } else if (PHOTOS_MIMETYPES.includes(mimetype)) {
                if (size > PHOTO_MAX_SIZE) {
                    throw new ErrorHandler(TOO_BIG_FILE.message, TOO_BIG_FILE.code);
                }

                photos.push(allFiles[i]);
            } else {
                throw new ErrorHandler(WRONG_FILE_EXTENSION.message, WRONG_FILE_EXTENSION.code);
            }
        }

        req.photos = photos;
        req.docs = docs;

        next();
    } catch (e) {
        next(e);
    }
};
