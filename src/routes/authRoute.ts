import express, {Request, Response} from "express"
const router = express.Router()
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import "dotenv/config"
import {authenticateToken} from "../middlewares/auth"
import Students from "../models/students"
import {StudentJWTEncoded, TeacherJWTEncoded} from "../types/jwtEndcode"
import Teacher from "../models/teacher"

const jwtSecret = process.env.JWT_SECRET || ""

// router.post("/register", isSuperAdmin, async (req: Request, res: Response) => {
//     const {password, phone_number, name}: Admin = req.body
//
//     if (!phone_number || !password || !name) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing needed params"
//         })
//     }
//
//     if (phone_number.split("").length !== 13) {
//         return res.status(400).json({
//             success: false,
//             message: "Incorrect phone number format"
//         })
//     }
//
//     if (!jwtSecret) {
//         return res.status(500).json({
//             success: false,
//             message: "Server error"
//         })
//     }
//
//     try {
//         // Check if the user already exists
//         const existingUser = await Admin.findOne({where: {phone_number}})
//
//         if (existingUser) {
//             return res.status(409).json({
//                 success: false,
//                 message: "User already exists"
//             })
//         }
//
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, saltRounds)
//
//         // Insert the new user into the database using the User model
//         const newUser = await Admin.create({
//             name,
//             password: hashedPassword,
//             phone_number
//         })
//
//         // Generate a JWT token
//         const token = jwt.sign({
//             id: newUser.id,
//             login: newUser.name,
//             role: newUser.role,
//             phone_number: newUser.phone_number
//         }, jwtSecret, {
//             expiresIn: "365d"
//         })
//
//         // Send a response with the new user's ID and the JWT token
//         return res.status(201).json({id: newUser.id, token})
//     } catch (err: any) {
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         })
//     }
// })

router.post("/login/student", async (req: Request, res: Response) => {
    const {student_card_number, password}: Students = req.body

    if (!student_card_number || !password) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Не предоставлены данные",
                uz: "Ma'lumotlar berilmagan",
            }
        })
    }

    try {
        const student = await Students.findOne({where: {student_card_number}})

        if (!student) {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Пользователь не найден",
                    uz: "Foydalanuvchi topilmadi"
                }
            })
        }

        // Check if the provided password matches the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, student.password)

        if (!passwordMatch) {
            return res.status(401).json({
                status: false,
                message: {
                    ru: "Неверный пароль",
                    uz: "Noto'g'ri parol"
                }
            })
        }

        // Generate a JWT token
        const token = jwt.sign({id: student.id, student_card_number: student.student_card_number, name: student.name}, jwtSecret, {
            expiresIn: "365d"
        })

        // Send the JWT token, user info, and addresses in the response
        return res.status(200).json({token})
    } catch (err: any) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Server xatosi",
            }
        })
    }
})

router.post("/login/teacher", async (req: Request, res: Response) => {
    const {username, password}: Teacher = req.body

    if (!username || !password) {
        return res.status(400).json({
            status: false,
            message: {
                ru: "Не предоставлены данные",
                uz: "Ma'lumotlar berilmagan",
            }
        })
    }

    try {
        const teacher = await Teacher.findOne({where: {username}})

        if (!teacher) {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Пользователь не найден",
                    uz: "Foydalanuvchi topilmadi"
                }
            })
        }

        // Check if the provided password matches the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, teacher.password)

        if (!passwordMatch) {
            return res.status(401).json({
                status: false,
                message: {
                    ru: "Неверный пароль",
                    uz: "Noto'g'ri parol"
                }
            })
        }

        // Generate a JWT token
        const token = jwt.sign({id: teacher.id, username: teacher.username, name: teacher.name}, jwtSecret, {
            expiresIn: "365d"
        })

        // Send the JWT token, user info, and addresses in the response
        return res.status(200).json({token})
    } catch (err: any) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Server xatosi",
            }
        })
    }
})

router.get("/student/me", authenticateToken, async (req, res) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            status: false,
            message: {
                ru: "Не авторизован",
                uz: "Avtorizatsiyadan o'tilmagan"
            },
            data: []
        })
    }

    const decoded = jwt.verify(token, jwtSecret) as StudentJWTEncoded

    try {
        const user = await Students.findOne({where: {id: decoded.id}})

        if (!user) {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Пользователь не найден",
                    uz: "Foydalanuvchi topilmadi"
                }
            })
        }

        delete user.dataValues.password

        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli",
            },
            data: user
        })
    } catch (err: any) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Server xatosi",
            }
        })
    }
})

router.get("/teacher/me", authenticateToken, async (req, res) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            status: false,
            message: {
                ru: "Не авторизован",
                uz: "Avtorizatsiyadan o'tilmagan"
            },
            data: []
        })
    }

    const decoded = jwt.verify(token, jwtSecret) as TeacherJWTEncoded

    try {
        const user = await Teacher.findOne({where: {id: decoded.id}})

        if (!user) {
            return res.status(404).json({
                status: false,
                message: {
                    ru: "Пользователь не найден",
                    uz: "Foydalanuvchi topilmadi"
                }
            })
        }

        delete user.dataValues.password

        return res.status(200).json({
            status: true,
            message: {
                ru: "Успешно",
                uz: "Muvaffaqiyatli",
            },
            data: user
        })
    } catch (err: any) {
        return res.status(500).json({
            status: false,
            message: {
                ru: "Ошибка сервера",
                uz: "Server xatosi",
            }
        })
    }
})

export default router