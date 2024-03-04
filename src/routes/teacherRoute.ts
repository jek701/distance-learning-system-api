import express from "express"
import Teacher from "../models/teacher"
import {v4 as uuid4} from "uuid"
import bycrypt from "bcrypt"

const router = express.Router()
const saltRounds = 10

// Endpoint to get all teachers
router.get("/teachers", async (_, res) => {
    try {
        const teachers = await Teacher.findAndCountAll({
            order: [["created_at", "DESC"]]
        })
        teachers.rows.map(teacher => teacher.dataValues.password = undefined)
        return res.status(200).json({
            status: true,
            message: {
                ru: "Учителя успешно найдены",
                uz: "O'qituvchilar muvaffaqiyatli topildi"
            },
            data: teachers.rows
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            data: error
        })
    }
})

// Endpoint to get teacher by id
router.get("/teachers/:id", async (req, res) => {
    const {id} = req.params

    if (!id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Отсутствует ID учителя",
                uz: "O'qituvchi ID si mavjud emas"
            },
            data: null
        })
    }

    try {
        const teacher = await Teacher.findByPk(id)
        if (teacher) {
            teacher.dataValues.password = undefined
            return res.status(200).json({
                status: true,
                message: {
                    ru: "Учитель успешно найден",
                    uz: "O'qituvchi muvaffaqiyatli topildi"
                },
                data: teacher
            })
        } else {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Учитель не найден",
                    uz: "O'qituvchi topilmadi"
                },
                data: null
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            data: error
        })
    }
})

// Endpoint to create teacher
router.post("/teachers", async (req, res) => {
    const {name, password, middle_name, profile_picture_url, department_id, surname, username}: Teacher = req.body
    const id = uuid4()

    if (!name || !password || !surname || !username) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Отсутствуют обязательные поля",
                uz: "Majburiy maydonlar mavjud emas"
            },
            data: null
        })
    }

    const teacher = await Teacher.findOne({
        where: {
            username
        }
    })

    if (teacher) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Учитель с таким логином уже существует",
                uz: "Bu login bilan o'qituvchi mavjud"
            },
            data: null
        })
    }

    try {
        const hashedPassword = bycrypt.hashSync(password, saltRounds)
        const teacher = await Teacher.create({
            id,
            name,
            password: hashedPassword,
            middle_name,
            profile_picture_url,
            department_id,
            surname,
            username
        })
        teacher.dataValues.password = undefined
        return res.status(201).json({
            status: true,
            message: {
                ru: "Учитель успешно создан",
                uz: "O'qituvchi muvaffaqiyatli yaratildi"
            },
            data: teacher
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            data: error
        })
    }
})

// Endpoint to update teacher
router.put("/teachers/:id", async (req, res) => {
    const {name, middle_name, profile_picture_url, department_id, surname, username}: Teacher = req.body
    const {id} = req.params

    if (!id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Отсутствует ID учителя",
                uz: "O'qituvchi ID si mavjud emas"
            },
            data: null
        })
    }

    try {
        const teacher = await Teacher.findByPk(id)

        if (teacher === null) {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Учитель не найден",
                    uz: "O'qituvchi topilmadi"
                },
                data: null
            })
        }

        await teacher.update({
            name,
            middle_name,
            profile_picture_url,
            department_id,
            surname,
            username
        })
        return res.status(200).json({
            status: true,
            message: {
                ru: "Учитель успешно обновлен",
                uz: "O'qituvchi muvaffaqiyatli yangilandi"
            },
            data: null
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            data: error
        })
    }
})

// Endpoint to update teacher teaching courses
router.post("/teachers/:id/courses", async (req, res) => {
    const {id} = req.params
    const {course_ids}: {course_ids: string[]} = req.body

    if (!id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Не предоставлен id",
                uz: "Id berilmagan"
            },
            data: []
        })
    }

    if (!course_ids) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Не предоставлены курсы",
                uz: "Kurslar berilmagan"
            },
            data: []
        })
    }

    try {
        const teacher = await Teacher.findByPk(id)
        if (teacher === null) {
            return res.status(204).json({
                status: false,
                message: {
                    ru: "Учитель не найден",
                    uz: "O'qituvchi topilmadi"
                },
                data: []
            })
        }
        const newTeacher = Teacher.build({teaching_courses: course_ids})
        await teacher.update({teaching_courses: newTeacher.teaching_courses})
        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
            },
            data: []
        })
    } catch (error) {
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

// Endpoint to delete teacher
router.delete("/teachers/:id", async (req, res) => {
    const {id} = req.params

    if (!id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Отсутствует ID учителя",
                uz: "O'qituvchi ID si mavjud emas"
            },
            data: null
        })
    }

    const teacher = await Teacher.findByPk(id)

    if (!teacher) {
        return res.status(404).json({
            status: false,
            message: {
                ru: "Учитель не найден",
                uz: "O'qituvchi topilmadi"
            },
            data: null
        })
    }

    try {
        await Teacher.destroy({
            where: {
                id
            }
        })
        return res.status(200).json({
            status: true,
            message: {
                ru: "Учитель успешно удален",
                uz: "O'qituvchi muvaffaqiyatli o'chirildi"
            },
            data: null
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            data: error
        })
    }
})

export default router