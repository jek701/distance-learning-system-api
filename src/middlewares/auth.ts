// auth.ts

import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"
import "dotenv/config"
import {StudentJWTEncoded, TeacherJWTEncoded} from "../types/jwtEndcode"
import Students from "../models/students"
import Homework_files from "../models/homework_files"

const jwtSecret = process.env.JWT_SECRET || ""

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            status: false,
            message: {
                ru: "Токен отсутствует",
                uz: "Token mavjud emas",
            },
            data: []
        })
    }

    // const decoded = jwt.verify(token, jwtSecret) as (TeacherJWTEncoded | StudentJWTEncoded)

    jwt.verify(token, jwtSecret, (err) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: {
                    ru: "Неверный токен",
                    uz: "Noto'g'ri token",
                },
                data: []
            })
        }
        next()
    })
}

export const isStudent = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            status: false,
            message: {
                ru: "Токен отсутствует",
                uz: "Token mavjud emas",
            },
            data: []
        })
    }

    const decoded = jwt.verify(token, jwtSecret) as StudentJWTEncoded

    if (!decoded.student_card_number) {
        return res.status(403).json({
            status: false,
            message: {
                ru: "Доступ запрещен",
                uz: "Kirish taqiqlangan",
            },
            data: []
        })
    }
    next()
}

// Check, if student can change file, req.params.id is the file id
export const isStudentFileOwner = async (req: Request, res: Response, next: NextFunction) => {
const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    const {id} = req.params

    if (!token) {
        return res.status(401).json({
            status: false,
            message: {
                ru: "Токен отсутствует",
                uz: "Token mavjud emas",
            },
            data: []
        })
    }

    const decoded = jwt.verify(token, jwtSecret) as StudentJWTEncoded

    const student = await Students.findOne({where: {id: decoded.id}})
    if (!student) {
        return res.status(404).json({
            status: false,
            message: {
                ru: "Пользователь не найден",
                uz: "Foydalanuvchi topilmadi",
            },
            data: []
        })
    }

    const file = await Homework_files.findOne({where: {id}})
    if (!file) {
        return res.status(404).json({
            status: false,
            message: {
                ru: "Файл не найден",
                uz: "Fayl topilmadi",
            },
            data: []
        })
    }

    if (file.student_id !== student.id) {
        return res.status(403).json({
            status: false,
            message: {
                ru: "Доступ запрещен",
                uz: "Kirish taqiqlangan",
            },
            data: []
        })
    }
    next()
}

export const isTeacher = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            status: false,
            message: {
                ru: "Токен отсутствует",
                uz: "Token mavjud emas",
            },
            data: []
        })
    }

    const decoded = jwt.verify(token, jwtSecret) as TeacherJWTEncoded

    if (!decoded.username) {
        return res.status(403).json({
            status: false,
            message: {
                ru: "Доступ запрещен",
                uz: "Kirish taqiqlangan",
            },
            data: []
        })
    }
    next()
}