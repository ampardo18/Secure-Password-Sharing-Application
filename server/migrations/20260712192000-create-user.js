/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [8, 200], 
          is: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ 
      }
    },
    encryption_key: {
      type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [8, 200]
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
        unique: true,
        validate: {
          isEmail: true
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Users')
}