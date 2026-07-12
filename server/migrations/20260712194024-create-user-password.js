/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('UserPasswords', {
    id: {
      allowNull: false,
      primaryKey: true,
      defualtValue: Sequelize.UUIDV4,
      type: Sequelize.UUID
    },
    ownerUserId: {
      type: Sequelize.UUID
    },
    url: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    sharedByUserId: {
      type: Sequelize.UUID
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
  await queryInterface.dropTable('UserPasswords')
}