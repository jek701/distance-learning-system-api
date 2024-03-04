import express from "express"
import Department from "../models/department"
import {v4 as uuidv4} from "uuid"

const router = express.Router()

// Endpoint to get all departments
router.get("/departments", async (_, res) => {
    try {
        const departments = await Department.findAndCountAll({
            order: [["created_at", "DESC"]]
        })
        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
            },
            data: departments.rows
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

// Endpoint to get department by id
router.get("/departments/:id", async (req, res) => {
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
        const department = await Department.findByPk(id)
        if (department === null) {
            return res.status(204).json({
                status: false,
                message: {
                    ru: "Кафедра не найдена",
                    uz: "Kafedra topilmadi"
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
            data: department
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

// Endpoint to create department
router.post("/departments", async (req, res) => {
    const {title, title_short}: Department = req.body
    const id = uuidv4()

    if (!title) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Укажите название",
                uz: "Nomi ni kiriting"
            },
            data: []
        })
    }

    try {
        const department = await Department.create({
            id,
            title,
            title_short
        })

        return res.status(201).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
            },
            data: department
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

// Endpoint to update department
router.put("/departments/:id", async (req, res) => {
    const {id} = req.params
    const {title, title_short}: Department = req.body

    if (!id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Укажите id",
                uz: "Idni kiriting"
            },
            data: []
        })
    }

    try {
        const department = await Department.findByPk(id)
        if (department === null) {
            return res.status(204).json({
                status: false,
                message: {
                    ru: "Кафедра не найдена",
                    uz: "Kafedra topilmadi"
                },
                data: []
            })
        }

        department.title = title
        department.title_short = title_short
        await department.save()

        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli"
            },
            data: department
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

// Endpoint to delete department
router.delete("/departments/:id", async (req, res) => {
    const {id} = req.params

    if (!id) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Укажите id",
                uz: "Idni kiriting"
            },
            data: []
        })
    }

    try {
        const department = await Department.findByPk(id)
        if (department === null) {
            return res.status(204).json({
                status: false,
                message: {
                    ru: "Кафедра не найдена",
                    uz: "Kafedra topilmadi"
                },
                data: []
            })
        }

        await department.destroy()

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