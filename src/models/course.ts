import {Model, DataTypes} from "sequelize"
import sequelize from "../sequelize"

class Course extends Model {
    public id!: number
    public title!: string
    public title_short!: string
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

Course.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.CHAR(255),
            allowNull: false
        },
        title_short: {
            type: DataTypes.CHAR(15)
        }
    },
    {
        sequelize,
        modelName: "Course",
        tableName: "course",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default Course