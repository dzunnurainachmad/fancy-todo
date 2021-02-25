'use strict';
const {
  Model
} = require('sequelize');
let date = new Date()
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User)
    }
  };
  Todo.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "title cannot be empty"
        }
      }
    },
    description: DataTypes.STRING,
    status: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: {
          msg: "status cannot be empty"
        }
      }
    },
    due_date: {
      type: DataTypes.DATE,
      validate: {
        isAfter: {
          args: new Date(date.setDate(date.getDate() - 1)).toDateString(),
          msg: "due_date cannot be yesterday"
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Todo',
  });
  Todo.addHook('beforeCreate', (todo, opt) => {
    todo.status = false
  })
  return Todo;
};