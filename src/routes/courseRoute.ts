import express from "express"
import Course from "../models/course"
import {v4 as uuidv4} from "uuid"
import Manual_files from "../models/manual_files"
import Group from "../models/group"
import Teacher from "../models/teacher"

const router = express.Router()

// Endpoint to get all courses
router.get("/courses", async (_, res) => {
    try {
        const courses = await Course.findAndCountAll({
            order: [["created_at", "DESC"]]
        })
        return res.status(200).json({
            status: true,
            message: {
                ru: "Список курсов успешно получен",
                uz: "Kurslar ro'yxati muvaffaqiyatli olingan"
            },
            data: courses.rows
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            error: error,
            data: null
        })
    }
})

// Endpoint to get a course by id
router.get("/courses/:id", async (req, res) => {
    const {id} = req.params
    try {
        const course = await Course.findByPk(id)
        if (!course) {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Курс не найден",
                    uz: "Kurs topilmadi"
                },
                data: null
            })
        }
        course.dataValues.manual_files = await Manual_files.findAll({where: {course_id: id}})
        return res.status(200).json({
            status: true,
            message: {
                ru: "Курс успешно получен",
                uz: "Kurs muvaffaqiyatli olingan"
            },
            data: course
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            data: null
        })
    }
})

// Endpoint to get all courses for specific group
router.get("/courses/group/:group_id", async (req, res) => {
    const {group_id} = req.params

    try {
        const courseIds = await Group.findOne({where: {id: group_id}, attributes: ["studying_courses"]})
        if (!courseIds) {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Группа не найдена",
                    uz: "Guruh topilmadi"
                },
                data: null
            })
        }

        const courses = await Course.findAll({where: {id: courseIds.studying_courses}})
        return res.status(200).json({
            status: true,
            message: {
                ru: "Список курсов успешно получен",
                uz: "Kurslar ro'yxati muvaffaqiyatli olingan"
            },
            data: courses
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            data: null
        })

    }
})

// Endpoint to get all courses of the teacher
router.get("/courses/teacher/:teacher_id", async (req, res) => {
    const {teacher_id} = req.params

    try {
        const courseIds = await Teacher.findOne({where: {id: teacher_id}, attributes: ["teaching_courses"]})

        if (!courseIds) {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Преподаватель не найден",
                    uz: "O'qituvchi topilmadi"
                },
                data: null
            })
        }

        const courses = await Course.findAll({where: {id: courseIds.teaching_courses}})

        return res.status(200).json({
            status: true,
            message: {
                ru: "Список курсов успешно получен",
                uz: "Kurslar ro'yxati muvaffaqiyatli olingan"
            },
            data: courses
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            data: null
        })

    }
})


// Endpoint to create a course
router.post("/courses", async (req, res) => {
    const {title, title_short}: Course = req.body
    const id = uuidv4()

    if (!title) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Поле title обязательно",
                uz: "title maydoni majburiy"
            },
            data: null
        })
    }

    const courseExists = await Course.findOne({where: {title}})

    if (courseExists) {
        return res.status(409).json({
            status: false,
            message: {
                ru: "Курс уже существует",
                uz: "Kurs mavjud"
            },
            data: null
        })
    }

    try {
        const course = await Course.create({title, title_short, id})
        return res.status(201).json({
            status: true,
            message: {
                ru: "Курс успешно создан",
                uz: "Kurs muvaffaqiyatli yaratildi"
            },
            data: course
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            data: null
        })
    }
})

// Endpoint to update a course
router.put("/courses/:id", async (req, res) => {
    const {id} = req.params
    const {title, title_short}: Course = req.body

    if (!title && !title_short) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Не указаны поля для обновления",
                uz: "Yangilash uchun maydonlar kiritilmagan"
            },
            data: null
        })
    }

    try {
        const course = await Course.findByPk(id)
        if (!course) {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Курс не найден",
                    uz: "Kurs topilmadi"
                },
                data: null
            })
        }
        await course.update({title, title_short})
        return res.status(200).json({
            status: true,
            message: {
                ru: "Курс успешно обновлен",
                uz: "Kurs muvaffaqiyatli yangilandi"
            },
            data: course
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Serverda xatolik"
            },
            data: null
        })
    }
})

// Endpoint to delete a course
router.delete("/courses/:id", async (req, res) => {
    const {id} = req.params
    try {
        const course = await Course.findByPk(id)
        if (!course) {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Курс не найден",
                    uz: "Kurs topilmadi"
                },
                data: null
            })
        }
        await course.destroy()
        return res.status(200).json({
            status: true,
            message: {
                ru: "Курс успешно удален",
                uz: "Kurs muvaffaqiyatli o'chirildi"
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
            data: null
        })
    }
})

export default router