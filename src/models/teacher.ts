import {DataTypes, Model} from "sequelize"
import sequelize from "../sequelize"

class Teacher extends Model {
    public id!: number
    public username!: string
    public name!: string
    public surname!: string
    public middle_name!: string
    public department_id!: string
    public profile_picture_url!: string
    public password!: string
    public teaching_courses!: string[]
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

Teacher.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: DataTypes.CHAR(15),
            allowNull: false
        },
        name: {
            type: DataTypes.CHAR(30),
            allowNull: false
        },
        surname: {
            type: DataTypes.CHAR(30),
            allowNull: false
        },
        middle_name: {
            type: DataTypes.CHAR(30)
        },
        department_id: {
            type: DataTypes.UUID
        },
        profile_picture_url: {
            type: DataTypes.CHAR(255)
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        teaching_courses: {
            type: DataTypes.CHAR(4096),
            allowNull: true,
            get() {
                return this.getDataValue("teaching_courses")?.split(";")
            },
            set(value: string[]) {
                this.setDataValue("teaching_courses", value.join(";"))
            }
        }
    },
    {
        sequelize,
        tableName: "teacher",
        modelName: "Teacher",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default Teacher