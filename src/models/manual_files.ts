import {Model, DataTypes} from "sequelize"
import sequelize from "../sequelize"

class Manual_files extends Model {
    public id!: number
    public file_name!: string
    public file_path!: string
    public course_id!: number
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

Manual_files.init(
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
        course_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "Course",
                key: "id"
            }
        }
    },
    {
        sequelize,
        modelName: "manual_files",
        tableName: "manual_files",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default Manual_files