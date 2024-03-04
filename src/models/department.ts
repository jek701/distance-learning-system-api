import {DataTypes, Model} from "sequelize"
import sequelize from "../sequelize"

class Department extends Model {
    public id!: string
    public title!: string
    public title_short!: string | undefined
}

Department.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
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
        modelName: "Departments",
        tableName: "department",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default Department