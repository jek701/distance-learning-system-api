import express from "express"
import Group from "../models/group"
import {v4 as uuidv4} from "uuid"
import Department from "../models/department"

const router = express.Router()

// Endpoint to get all groups
router.get("/groups", async (_, res) => {
    try {
        const {rows: groups} = await Group.findAndCountAll({
            order: [["created_at", "DESC"]]
        })
        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
            },
            data: groups
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

// Endpoint to get group by id
router.get("/groups/:id", async (req, res) => {
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
        const group = await Group.findByPk(id)
        if (group === null) {
            return res.status(204).json({
                status: false,
                message: {
                    ru: "Группа не найдена",
                    uz: "Guruh topilmadi"
                },
                data: []
            })
        }

        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
            },
            data: group
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

// Endpoint to create group
router.post("/groups", async (req, res) => {
    const {number, department_id}: Group = req.body
    const id = uuidv4()

    if (!number || !department_id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Укажите номер и id отдела",
                uz: "Raqam va bo'lim id sini kiriting"
            },
            data: []
        })
    }

    const department = await Department.findByPk(department_id)
    if (department === null) {
        return res.status(204).json({
            status: false,
            message: {
                ru: "Отдел не найден",
                uz: "Bo'lim topilmadi"
            },
            data: []
        })
    }

    try {
        const group = await Group.create({
            id,
            number,
            department_id
        })
        return res.status(201).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
            },
            data: group
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

// Endpoint to update group
router.put("/groups/:id", async (req, res) => {
    const {id} = req.params
    const {number, department_id}: Group = req.body

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

    if (!number && !department_id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Не предоставлены данные для обновления",
                uz: "Yangilash uchun ma'lumotlar berilmagan"
            },
            data: []
        })
    }

    try {
        await Group.update({number, department_id}, {where: {id}})
        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
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

// Endpoint to change group courses
router.post("/groups/:id/courses", async (req, res) => {
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
        const group = await Group.findByPk(id)
        if (group === null) {
            return res.status(204).json({
                status: false,
                message: {
                    ru: "Группа не найдена",
                    uz: "Guruh topilmadi"
                },
                data: []
            })
        }

        const newGroup = Group.build({studying_courses: course_ids})
        await group.update({studying_courses: newGroup.studying_courses})
        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
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

// Endpoint to delete group
router.delete("/groups/:id", async (req, res) => {
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
        await Group.destroy({where: {id}})
        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
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