import multer from "multer"
import path from "path"
import process from "process"

export const multerManualFilePath = process.env["MULTER_MANUAL_FILE_PATH"] || "/uploads/manuals/"
export const multerProfilePicturePath = process.env["MULTER_PROFILE_PICTURE_PATH"] || "/uploads/profile_pictures/"
export const multerHomeworkFilePath = process.env["MULTER_HOMEWORK_FILE_PATH"] || "/uploads/homeworks/"

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, multerManualFilePath)) // Uploads will be stored in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname) // Rename files with current timestamp
    }
})

// Multer configuration for profile picture
const profilePictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, multerProfilePicturePath)) // Uploads will be stored in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname) // Rename files with current timestamp
    }
})

const homeworkStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, multerHomeworkFilePath)) // Uploads will be stored in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname) // Rename files with current timestamp
    }
})

const uploadManualFiles = multer({storage: storage})
const uploadProfilePicture = multer({storage: profilePictureStorage})
const uploadHomeworkFiles = multer({storage: homeworkStorage})

export {uploadManualFiles, uploadProfilePicture, uploadHomeworkFiles}
