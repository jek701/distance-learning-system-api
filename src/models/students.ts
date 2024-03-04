import {DataTypes, Model} from "sequelize"
import sequelize from "../sequelize"

class Students extends Model {
    public id!: string
    public student_card_number!: number
    public password!: string
    public name!: string
    public surname!: string
    public middle_name: string | undefined
    public group_number!: number
    public profile_picture_url: string | undefined
    public rating: number | undefined
}

Students.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        student_card_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.CHAR(255),
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
        group_number: {
            type: DataTypes.CHAR(10),
            allowNull: false
        },
        profile_picture_url: {
            type: DataTypes.CHAR(255),
        },
        rating: {
            type: DataTypes.INTEGER,
        }
    },
    {
        sequelize,
        modelName: "Students",
        tableName: "student",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default Students