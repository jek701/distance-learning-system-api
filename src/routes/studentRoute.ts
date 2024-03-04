import express from "express"
import Students from "../models/students"
import {v4 as uuidv4} from "uuid"
import bycrypt from "bcrypt"

const router = express.Router()

// Endpoint to get all students
router.get("/students", async (_, res) => {
    try {
        const students = await Students.findAndCountAll({
            order: [["created_at", "DESC"]]
        })
        students.rows.forEach(student => student.dataValues.password = undefined)
        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
            },
            data: students.rows
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Server xatosi"
            },
            data: []
        })
    }
})

// Endpoint to get student by id
router.get("/students/:id", async (req, res) => {
    const {id} = req.params

    if (!id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Укажите id",
                uz: "Id ni kiriting"
            },
            data: []
        })
    }

    try {
        const student = await Students.findByPk(id)
        if (student === null) {
            return res.status(204).json({
                status: false,
                message: {
                    ru: "Студент не найден",
                    uz: "Student topilmadi"
                },
                data: []
            })
        }
        student.dataValues.password = undefined

        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
            },
            data: student
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Server xatosi"
            },
            data: []
        })
    }
})

// Endpoint to create a student
router.post("/students", async (req, res) => {
    const {student_card_number, name, group_number, middle_name, profile_picture_url, surname, password, rating}: Students = req.body
    const id = uuidv4()

    const salt = 10
    const hashedPassword = await bycrypt.hash(password, salt)

    if (!student_card_number || !name || !group_number || !surname || !password) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Укажите имя, возраст и id группы",
                uz: "Ism, yosh va guruh id sini kiriting"
            },
            data: []
        })
    }

    try {
        const student = await Students.create({
            id,
            student_card_number,
            name,
            group_number,
            middle_name,
            profile_picture_url,
            surname,
            password: hashedPassword,
            rating
        })
        student.dataValues.password = undefined
        return res.status(201).json({
            status: true,
            message: {
                ru: "Студент успешно создан",
                uz: "Student muvaffaqiyatli yaratildi"
            },
            data: student
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Server xatosi"
            },
            data: []
        })
    }
})

// Endpoint to update a student
router.put("/students/:id", async (req, res) => {
    const {student_card_number, name, group_number, middle_name, profile_picture_url, surname}: Students = req.body
    const {id} = req.params

    if (!id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Укажите id",
                uz: "Id ni kiriting"
            },
            data: []
        })
    }

    try {
        const student = await Students.findByPk(id)
        if (student === null) {
            return res.status(204).json({
                status: false,
                message: {
                    ru: "Студент не найден",
                    uz: "Student topilmadi"
                },
                data: []
            })
        }

        await student.update({
            student_card_number,
            name,
            group_number,
            middle_name,
            profile_picture_url,
            surname
        })
        student.dataValues.password = undefined

        return res.status(200).json({
            status: true,
            message: {
                ru: "Студент успешно обновлен",
                uz: "Student muvaffaqiyatli yangilandi"
            },
            data: student
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Server xatosi"
            },
            data: []
        })
    }
})

// Endpoint to delete a student
router.delete("/students/:id", async (req, res) => {
    const {id} = req.params

    if (!id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Укажите id",
                uz: "Id ni kiriting"
            },
            data: []
        })
    }

    try {
        const student = await Students.findByPk(id)
        if (student === null) {
            return res.status(204).json({
                status: false,
                message: {
                    ru: "Студент не найден",
                    uz: "Student topilmadi"
                },
                data: []
            })
        }

        await student.destroy()
        return res.status(200).json({
            status: true,
            message: {
                ru: "Студент успешно удален",
                uz: "Student muvaffaqiyatli o'chirildi"
            },
            data: []
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Server xatosi"
            },
            data: []
        })
    }
})

export default router