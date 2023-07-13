const db = require('../db')
const tablesQueries = require('../queries/tables')

const init = async () => {
  try {
    await db.query(tablesQueries.createUsers())
    await db.query(tablesQueries.createCategories())
    await db.query(tablesQueries.createFinances())
    console.log('Successfuly created tables')
    await db.end()
    return
  } catch (error) {
    throw new Error('Error configuring to database', error)
  }
}

init()
