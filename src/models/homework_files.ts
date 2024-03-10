import {DataTypes, Model} from "sequelize"
import sequelize from "../sequelize"

class Homework_files extends Model {
    public id!: number
    public file_name!: string
    public file_path!: string
    public student_id!: string
    public group_id!: number
    public course_id!: number
    public status!: string
    public mark!: number
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

Homework_files.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        file_name: {
            type: DataTypes.CHAR(255),
            allowNull: false
        },
        file_path: {
            type: DataTypes.CHAR(255),
            allowNull: false
        },
        student_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        group_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        course_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("uploaded", "accepted", "declined"),
            allowNull: false,
            defaultValue: "uploaded"
        },
        mark: {
            type: DataTypes.TINYINT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: "homework_files",
        tableName: "homework_files",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default Homework_files