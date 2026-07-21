'use strict'

import { Sequelize, Model } from "sequelize"
import valaidator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.UserPassword, {foreignKey: 'ownerUserId'})
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true 
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required"
        },
        isAlphanumeric: {
          msg: "Name can only contain letters"
        },
        len: {
          args: [2, 100],
          msg: "Name must be between 2 and 100 characters"
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required"
        },
        isAlphanumeric: {
          msg: "Name can only contain letters"
        },
        len: {
          args: [2, 100],
          msg: "Name must be between 2 and 100 characters"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 200],
          msg: "Password must be between 8 and 200 characters"
        },
        isStrongPassword(value) {
          const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
          if (!strongPassword.test(value)) {
            throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
          }
        }
      }
    },
    encryption_key: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 200],
          msg: "Encryption key must be between 8 and 200 characters"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please enter a valid email address"
        },
        notEmpty: {
          msg: "Email is required"
        },
        isLowercase: {
          msg: "Email must be in lowercase"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  })

  User.verifyToken = async function (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findByPk(decoded.user_id)
      if (!user) throw new Error('User not found')
      return user
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
  return User
}