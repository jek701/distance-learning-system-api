import {DataTypes, Model} from "sequelize"
import sequelize from "../sequelize"

class Group extends Model {
    public id!: string
    public number!: string
    public department_id!: string
    public studying_courses!: string[]
}

Group.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        number: {
            type: DataTypes.CHAR(10),
            allowNull: false
        },
        department_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        studying_courses: {
            type: DataTypes.CHAR(4096),
            allowNull: true,
            get() {
                return this.getDataValue("studying_courses")?.split(";")
            },
            set(value: string[]) {
                this.setDataValue("studying_courses", value.join(";"))
            }
        }
    },
    {
        sequelize,
        modelName: "Groups",
        tableName: "group",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default Group