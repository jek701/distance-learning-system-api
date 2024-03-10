import express from "express"
import Homework_files from "../models/homework_files"
import {multerHomeworkFilePath, uploadHomeworkFiles} from "../multerConfig"
import {v4 as uuidv4} from "uuid"
import * as fs from "fs"
import path from "path"
import {authenticateToken, isStudent, isStudentFileOwner, isTeacher} from "../middlewares/auth"
import jwt from "jsonwebtoken"
import {StudentJWTEncoded, TeacherJWTEncoded} from "../types/jwtEndcode"
import Students from "../models/students"
import Group from "../models/group"

const router = express.Router()
const jwtSecret = process.env.JWT_SECRET || ""

// Endpoint for uploading files
router.post("/homework-files", isStudent, uploadHomeworkFiles.single("file"), async (req, res) => {
    try {
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(" ")[1]
        const {file} = req
        const {course_id} = req.body
        const id = uuidv4()

        if (!token) {
            res.status(401).json({
                status: false,
                message: {
                    ru: "Токен отсутствует",
                    uz: "Token mavjud emas",
                },
                data: []
            })
            return
        }

        const decoded = jwt.verify(token, jwtSecret) as StudentJWTEncoded
        const student = await Students.findByPk(decoded.id)

        if (!student) {
            res.status(404).json({
                status: false,
                message: {
                    ru: "Пользователь не найден",
                    uz: "Foydalanuvchi topilmadi",
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

        const group_id = await Group.findOne({where: {number: student?.group_number}})

        const manualFile = await Homework_files.create({
            file_name: file.filename,
            file_path: multerHomeworkFilePath + file.filename,
            course_id,
            student_id: student.id,
            group_id,
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

// Endpoint to update a file
router.put("/homework-files/:id", isStudentFileOwner, uploadHomeworkFiles.single("file"), async (req, res) => {
    try {
        const {file} = req
        const {id} = req.params

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

        const manualFile = await Homework_files.findByPk(id)

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
        manualFile.file_name = file.filename
        manualFile.file_path = multerHomeworkFilePath + file.filename
        await manualFile.save()
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
                ru: "Не удалось обновить файл",
                uz: "Faylni yangilash muvaffaqiyatli emas",
            },
            data: error
        })
    }
})

// Endpoint to update homework mark and status
router.put("/homework-files/:id/mark", isTeacher, async (req, res) => {
    try {
        const {id} = req.params
        const {mark, status}: Homework_files = req.body

        const manualFile = await Homework_files.findByPk(id)

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

        manualFile.mark = mark
        manualFile.status = status
        await manualFile.save()
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
                ru: "Не удалось обновить оценку и статус домашнего задания",
                uz: "Vazifa bahosi va holatini yangilash muvaffaqiyatli emas",
            },
            data: error
        })
    }
})

// Endpoint to delete a file
router.delete("/homework-files/:id", isStudentFileOwner, async (req, res) => {
    try {
        const {id} = req.params
        const manualFile = await Homework_files.findByPk(id)

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

// Endpoint to get all files by course
router.get("/homework-files/course/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params
        const manualFiles = await Homework_files.findAll({where: {course_id: id}})
        res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli",
            },
            data: manualFiles
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: {
                ru: "Не удалось получить файлы",
                uz: "Fayllarni olish muvaffaqiyatli emas",
            },
            data: error
        })
    }
})

export default router