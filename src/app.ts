import express from "express"
import "dotenv/config"
import sequelize from "./sequelize"
import cors from "cors"
import bodyParser from "body-parser"

import groupRoute from "./routes/groupRoute"
import departmentRoute from "./routes/departmentRoute"
import studentRoute from "./routes/studentRoute"
import teacherRoute from "./routes/teacherRoute"
import courseRoute from "./routes/courseRoute"
import manualFileRoute from "./routes/manualFileRoute"
import homeworkFileRoute from "./routes/homeworkFileRoute"

const app = express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use("/api", groupRoute)
app.use("/api", departmentRoute)
app.use("/api", studentRoute)
app.use("/api", teacherRoute)
app.use("/api", courseRoute)
app.use("/api", manualFileRoute)
app.use("/api", homeworkFileRoute)

app.use((_, res) => {
    res.status(404).json({
        status: false,
        message: "Route not found",
        data: []
    })
})

sequelize.sync()
    .then(() => {
        console.log("База данных успешно синхронизирована")
    })
    .catch((error) => {
        console.error("Ошибка синхронизации базы данных:", error)
    })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
})