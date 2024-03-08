import express from "express"
import Homework_files from "../models/homework_files"
import {multerHomeworkFilePath, uploadHomeworkFiles} from "../multerConfig"
import {v4 as uuidv4} from "uuid"
import * as fs from "fs"
import path from "path"

const router = express.Router()

// Endpoint for uploading files
router.post("/homework-files", uploadHomeworkFiles.single("file"), async (req, res) => {
    try {
        const {file} = req
        const {student_id, group_id, course_id} = req.body
        const id = uuidv4()

        if (!file) {
            res.status(400).json({
                status: false,
                message: "Please upload a file",
                data: []
            })
            return
        }

        const manualFile = await Homework_files.create({
            file_name: file.filename,
            file_path: multerHomeworkFilePath + file.filename,
            course_id,
            student_id,
            group_id,
            id
        })
        res.status(201).json({
            status: true,
            message: "File uploaded successfully",
            data: manualFile
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Failed to upload file",
            data: error
        })
    }
})

// Endpoint to update a file
router.put("/homework-files/:id", uploadHomeworkFiles.single("file"), async (req, res) => {
    try {
        const {file} = req
        const {id} = req.params

        if (!file) {
            res.status(400).json({
                status: false,
                message: "Please upload a file",
                data: []
            })
            return
        }

        const manualFile = await Homework_files.findByPk(id)

        if (!manualFile) {
            res.status(404).json({
                status: false,
                message: "File not found",
                data: []
            })
            return
        }

        fs.unlinkSync(path.join(__dirname, "..", manualFile.file_path))
        manualFile.file_name = file.filename
        manualFile.file_path = multerHomeworkFilePath + file.filename
        await manualFile.save()
        res.status(200).json({
            status: true,
            message: "File updated successfully",
            data: manualFile
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Failed to update file",
            data: error
        })
    }
})

// Endpoint to update homework mark and status
router.put("/homework-files/:id/mark", async (req, res) => {
    try {
        const {id} = req.params
        const {mark, status}: Homework_files = req.body

        const manualFile = await Homework_files.findByPk(id)

        if (!manualFile) {
            res.status(404).json({
                status: false,
                message: "File not found",
                data: []
            })
            return
        }

        manualFile.mark = mark
        manualFile.status = status
        await manualFile.save()
        res.status(200).json({
            status: true,
            message: "Homework mark and status updated successfully",
            data: manualFile
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Failed to update homework mark and status",
            data: error
        })
    }
})

// Endpoint to delete a file
router.delete("/homework-files/:id", async (req, res) => {
    try {
        const {id} = req.params
        const manualFile = await Homework_files.findByPk(id)

        if (!manualFile) {
            res.status(404).json({
                status: false,
                message: "File not found",
                data: []
            })
            return
        }

        fs.unlinkSync(path.join(__dirname, "..", manualFile.file_path))
        await manualFile.destroy()
        res.status(200).json({
            status: true,
            message: "File deleted successfully",
            data: manualFile
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Failed to delete file",
            data: error
        })
    }
})

// Endpoint to get all files by course
router.get("/homework-files/course/:id", async (req, res) => {
    try {
        const {id} = req.params
        const manualFiles = await Homework_files.findAll({where: {course_id: id}})
        res.status(200).json({
            status: true,
            message: "Files by course",
            data: manualFiles
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Failed to get files by course",
            data: error
        })
    }
})

export default router