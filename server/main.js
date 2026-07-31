import express from 'express'
import cors from 'cors'
import * as models from './models/index.js'
import * as bodyParser from 'body-parser'
import bcrypt from 'bcryptjs'
import * as JWT from 'jsonwebtoken'
import {expressjwt} from 'express-jwt'
import crypto from 'crypto'

const COOKIE_NAME = 'authToken'

const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

app.use(bodyParser.default.json())
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}))

app.use(
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    getToken: (req) => {
      const authHeader = req.headers.authorization
      if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7)
      }

      const cookieHeader = req.headers.cookie || ''
      const authCookie = cookieHeader
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`))

      if (!authCookie) {
        return null
      }

      return decodeURIComponent(authCookie.slice(COOKIE_NAME.length + 1))
    }
  }).unless({ path: ["/login", "/register", "/logout"]})
)

app.post("/register", async (req, res, next) => {
    const { email, password, first_name, last_name, encryption_key } = req.body
    console.log("Received body:", req.body) 
    const modelsObj=await models.default
    try {
        const emailExists = await modelsObj.User.findOne({where: { email } })
        if (emailExists) {
          res.status(400)
          return res.json({ message: "Email already exists" })
        }
        const hashedPassword = await hashStr(password)
        const result = await modelsObj.User.create({ 
          email, 
          password: hashedPassword, 
          encryption_key: await hashStr(encryption_key), 
          first_name, 
          last_name 
        });
        res.json({ message: "Sign up is successful" })
    } catch (error) {
        console.error('Error during  sign up', error)
        res.status(500)
    }
})

app.post('/login', async (req, res, next) => {
    const { email, password, encryption_key } = req.body
    const modelsObj = await models.default
    try {
        const user = await modelsObj.User.findOne({ where: { email } })
        if (!user) {
            res.status(400);
            return res.json({ message: "Invalid email" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(400)
            return res.json({ message: "Invalid password" })
        }
        const isEncryptionKeyValid = await bcrypt.compare(encryption_key, user.encryption_key)
        if (!encryption_key){
            res.status(400)
            return res.json({message: 'Invalid Password'})
        }
        const token = await generateJWT(user)
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 1000 * 60 * 60 * 8
        })
        res.json({ message: "Login successful" })
    } catch (error) {
        console.error("Error during login:", error)
        res.status(500)
    }
})

app.post('/logout', (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true, 
        sameSite: 'lax',
        secure: false
    })
    res.json({message: 'Logged out successfully'})
})

app.get('/user', async (req, res) => {
    try {
        const modelsObj = await models.default
        const userID = req.auth?.id
        const user = await modelsObj.User.findByPk(userID, {
            attributes: ['first_name', 'last_name', 'email']
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.json({
            message: 'Success',
            user: {
                firstname: user.first_name,
                lastname: user.last_name,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Error loading user:', error)
        return res.status(500).json({ message: 'Server error' })
    }
})

app.post('/passwords/save', async (req, res) => {
    try{
        const { url, password, encryption_key, label } = req.body
        const userID = req.auth?.id
        const modelsObj = await models.default
        const userRecord = await modelsObj.User.findOne({
            attributes: ['encryption_key', 'email'], where: {id: userID}
        })
        
        if(!userRecord){
            res.status(400);
            return res.json({ message: 'Unable to find the account' })
        }

        const matched = await bcrypt.compare(encryption_key, userRecord.encryption_key)
        if(!matched){
            res.status(400);
            return res.json({ message: 'Incorrect encryption key' })
        }
        if(!(password && url)) {
            res.status(400);
            return res.json({ message: 'Missing parameters' })
        }

        const encryptedEmail = encrypt(userRecord.email, encryption_key)
        const encryptedPassword = encrypt(password, encryption_key)
        const result = await modelsObj.UserPassword.create({
                ownerUserId: userID, password: encryptedPassword, email: encryptedEmail, url, label
            })
        res.status(200)
        res.json({message: 'Password is saved'})
    }catch(error){
        console.error(error)
        res.status(500)
    }
})

app.post('/passwords/list', async (req, res) => {
    const userId = req.auth?.id
    const encryptionKey = req.body.encryption_key
    const modelsObj = await models.default
    let passwords = await modelsObj.UserPassword.findAll({
        attributes: ['id', 'url', 'email', 'password', 'label', 'weak_encryption', 'sharedByUserId'],
        where: { ownerUserId: userId },
        order: [['id', 'DESC']]
    });
    const userRecord = await modelsObj.User.findOne({
        attributes: ['encryption_key'], where: { id: userId }
    });
    const matched = await bcrypt.compare(encryptionKey, userRecord.encryption_key)
    if (!matched) {
        res.status(400)
        return res.json({message: 'Incorrect encryption key'})
    }
    const passwordsArr = await Promise.all(
        passwords.map(async (element) => {
            await upgradeWeakEncryption(element, userRecord, encryptionKey)
            element.password = decrypt(element.password, encryptionKey)
            element.email = decrypt(element.email, encryptionKey)
            if(element.sharedByUserId){
                const sharer = await modelsObj.User.findOne({
                    attributes: ['email'], where: { id: element.sharedByUserId }
                })
                element.owner = sharer?.email
            } else {
                element.owner = 'Self'
            }
            return { ...element.toJSON(), owner: element.owner }
        })
    );
    res.status(200)
    res.json({message: 'Success', data: passwordsArr})
})

app.post('/passwords/share-password', async (req, res) => {
    try {
        const {password_id, encryption_key, email} = req.body
        const userId = req.auth?.id
        const modelsObj = await models.default
        const passwordRow = await modelsObj.UserPassword.findOne({
            attributes: ['label', 'url', 'email', 'password'], where: { id: password_id, ownerUserId: userId}
        });
        if (!passwordRow) {
            res.status(400)
            return res.json({message: 'Incorrect password_id'})
        }
        const userRecord = await modelsObj.User.findOne({
            attributes: ['encryption_key'], where: { id: userId }
        });
        const matched = await bcrypt.compare(encryption_key, userRecord.encryption_key);
        if (!matched) {
            res.status(400)
            return res.json({message: 'Incorrect encryption key'})
        }
        const shareUserObj = await modelsObj.User.findOne({attributes: ['id', 'encryption_key'], where: { email } })
        if (!shareUserObj) {
            res.status(400)
            return res.json({message: 'User with whom you want to share password does not exist'})
        }
        const existingSharedPassword = await modelsObj.UserPassword.findOne({
            attributes: ['id'], where: { source_password_id: password_id, ownerUserId: shareUserObj.id}
        });
        if (existingSharedPassword) {
            res.status(400)
            return res.json({message: `This password is already shared with the user`})
        }
        const decryptedEmail = decrypt(passwordRow.email, encryption_key)
        const encryptedSharedEmail = encrypt(decryptedEmail, shareUserObj.encryption_key)
        const decryptedPassword = decrypt(passwordRow.password, encryption_key)
        const encryptedSharedPassword = encrypt(decryptedPassword, shareUserObj.encryption_key)
        const newPassword = {
            ownerUserId: shareUserObj.id,
            label: passwordRow.label,
            url: passwordRow.url,
            email: encryptedSharedEmail,
            password: encryptedSharedPassword,
            sharedByUserId: userId,
            weak_encryption: true,
            source_password_id: password_id
        };
        await modelsObj.UserPassword.create(newPassword)
        return res.json({message: 'Password shared successfully'})
    } catch (e) {
        console.error(e)
        res.status(500)
        return res.json({message: 'An error occurred.'})
    }
})

async function hashStr(str){
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(str, salt)
}

function generateJWT(user) {
  return new Promise((resolve, reject) => {
    JWT.default.sign({id: user.id}, process.env.JWT_SECRET, { algorithm: 'HS256'}, function(err, token) {
      if (err) {
        console.error("Error signing JWT:", err)
        return reject(err)
      }
      resolve(token)
    })

  })
}

function encrypt(unenrypted_string, key) {
    const algorithm = 'aes-256-ctr';
    const iv = crypto.randomBytes(16)
    const encKey = crypto.createHash('sha256').update(String(key)).digest('base64').slice(0, 32)
    const cipher = crypto.createCipheriv(algorithm, encKey, iv)
    let crypted = cipher.update(unenrypted_string,'utf-8',"base64") + cipher.final("base64")
    return `${crypted}-${iv.toString('base64')}`
}

function decrypt(encStr, key) {
    const algorithm = 'aes-256-ctr'
    const encArr = encStr.split('-')
    const encKey = crypto.createHash('sha256').update(String(key)).digest('base64').slice(0, 32)
    const decipher = crypto.createDecipheriv(algorithm, encKey, Buffer.from(encArr[1], 'base64'))
    let decrypted = decipher.update(encArr[0], 'base64', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
}

async function upgradeWeakEncryption(element, userRecord, encryptionKey) {
    if (element.weak_encryption) {
        const decryptedPassword = decrypt(element.password, userRecord.encryption_key)
        const decryptedEmail = decrypt(element.email, userRecord.encryption_key)
        element.password = encrypt(decryptedPassword, encryptionKey)
        element.email = encrypt(decryptedEmail, encryptionKey)
        element.weak_encryption = false
        await element.save();
    }
}