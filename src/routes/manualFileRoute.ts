import express from "express"
import Manual_files from "../models/manual_files"
import {multerManualFilePath, uploadManualFiles} from "../multerConfig"
import {v4 as uuidv4} from "uuid"
import Course from "../models/course"
import * as fs from "fs"
import path from "path"

const router = express.Router()

// Endpoint for uploading files
router.post("/manual-files/:course_id", uploadManualFiles.single("file"), async (req, res) => {
    try {
        const {file} = req
        const {course_id} = req.params
        const id = uuidv4()
        const course = await Course.findByPk(course_id)

        if (!course) {
            res.status(404).json({
                status: false,
                message: {
                    ru: "Курс не найден",
                    uz: "Kurs topilmadi",
                },
                data: []
            })
            return
        }

        if (!file) {
            res.status(400).json({
                status: false,
                message: {
                    ru: "Пожалуйста, загрузите файл",
                    uz: "Iltimos, faylni yuklang",
                },
                data: []
            })
            return
        }

        const manualFile = await Manual_files.create({
            file_name: file.filename,
            file_path: multerManualFilePath + file.filename,
            course_id,
            id
        })
        res.status(201).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli",
            },
            data: manualFile
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: {
                ru: "Не удалось загрузить файл",
                uz: "Faylni yuklab bo'lmadi",
            },
            data: error
        })
    }
})

// Endpoint to delete a file
router.delete("/manual-files/:id", async (req, res) => {
    try {
        const {id} = req.params
        const manualFile = await Manual_files.findByPk(id)

        if (!manualFile) {
            res.status(404).json({
                status: false,
                message: {
                    ru: "Файл не найден",
                    uz: "Fayl topilmadi",
                },
                data: []
            })
            return
        }

        fs.unlinkSync(path.join(__dirname, "..", manualFile.file_path))
        await manualFile.destroy()
        res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli",
            },
            data: manualFile
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: {
                ru: "Не удалось удалить файл",
                uz: "Faylni o'chirib bo'lmadi",
            },
            data: error
        })
    }
})

export default router