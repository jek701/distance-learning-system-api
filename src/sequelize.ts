import {Sequelize} from "sequelize"
import "dotenv/config"
import * as process from "process"

const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env["HOST"],
    username: process.env["DB_USER"],
    password: process.env["DB_PASS"],
    database: process.env["DB"],
    port: Number(process.env["DB_PORT"])
})

export default sequelize