const express = require('express')
const router = express.Router()
const db = require('../db')

const findByEmail = email => {
  return (query = {
    name: 'fetch-category',
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email]
  })
}

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body
    if (name.length < 3) {
      return res
        .status(400)
        .json({ error: 'Nome deve conter mais de 3 caracteres!' })
    }

    if (email.length < 5 || !email.includes('@')) {
      return res
        .status(400)
        .json({ error: 'E-mail invalido, deve conter mais de 5 caracteres!' })
    }

    const query = findByEmail(email)
    const alreadyExists = await db.query(query)
    if (alreadyExists.rows[0]) {
      return res.status(403).json({ error: 'Usuario já existe' })
    }

    const text = 'INSERT INTO users(name, email) VALUES($1,$2) RETURNING *'
    const values = [name, email]
    const createResponse = await db.query(text, values)
    if (!createResponse.rows[0]) {
      return res.status(400).json({ error: 'User não criado!' })
    }
    return res.status(200).json(createResponse.rows[0])
  } catch (error) {
    return res.status(500).json(error)
  }
})

// ATUALIZAÇÃO DE USUARIO
router.put('/', async (req, res) => {
  try {
    const oldEmail = req.headers.email
    const { name, email } = req.body
    if (name.length < 3) {
      return res
        .status(400)
        .json({ error: 'Nome deve conter mais de 3 caracteres!' })
    }

    if (email.length < 5 || !email.includes('@')) {
      return res
        .status(400)
        .json({ error: 'E-mail invalido, deve conter mais de 5 caracteres!' })
    }

    if (oldEmail.length < 5 || !oldEmail.includes('@')) {
      return res
        .status(400)
        .json({ error: 'E-mail invalido, deve conter mais de 5 caracteres!' })
    }

    const query = findByEmail(oldEmail)
    const alreadyExists = await db.query(query)
    if (!alreadyExists.rows[0]) {
      return res.status(404).json({ error: 'Usuario não existe!' })
    }

    const text = 'UPDATE users SET name=$1, email=$2 WHERE email=$3 RETURNING *'
    const values = [name, email, oldEmail]

    const updateResponse = await db.query(text, values)
    if (!updateResponse.rows[0]) {
      return res.status(400).json({ error: 'User not updated' })
    }

    return res.status(200).json(updateResponse.rows[0])
  } catch (error) {
    return res.status(500).json(error)
  }
})

module.exports = router
