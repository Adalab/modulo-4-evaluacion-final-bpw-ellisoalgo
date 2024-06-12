const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;

server.listen(PORT, ()=>{
    console.log(`Server running in port: http://localhost:${PORT}`)
});

async function getConnection(){
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
    await conn.connect();
    console.log("connection to DB " + conn.threadId)
    return conn;
};

//endpoints table: pokemon
//get all
server.get("/pokemon", async(req, res)=>{
    try{
        const conn = await getConnection();
        const select = "SELECT * FROM pokemon;";
        const [results] = await conn.query(select);
        await conn.end();
        res.status(200).json({
            info: { count: results.length},
            results: results,
        })
        await conn.end();
    } catch (error){
        res.status(400).json({ 
            success: false, 
            error: error.message 
        })
    }
});
//get by id
server.get("/pokemon/:id", async (req, res)=>{
    try {
        const {id} = req.params;
        const conn = await getConnection();
        const select = "SELECT * FROM pokemon WHERE id = ?;";
        const [result] = await conn.query(select, [id]);
        if (result.length === 0){
            res.status(400).json({message: "ID not in the database"})
        } else {
        res.status(200).json({data: result[0]});
        };
        await conn.end();
    } catch (error){
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    };
});
//add new
server.post("/pokemon", async (req, res)=>{
    try {
        const conn = await getConnection();
        const {name, photo, type, height, weight} = req.body;
        const sqlInsert = 'INSERT INTO pokemon (name, photo, type, height, weight) VALUES (?, ?, ?, ?, ?);';
        const [newPokemon] = await conn.query(sqlInsert, [
            name, 
            photo, 
            type, 
            height, 
            weight
        ]);
        res.status(200).json({
            success: true,
            id: newPokemon.insertId
        });
        await conn.end();
    } catch (error){
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});
//edit by id
server.put('/pokemon/:id', async (req, res)=>{
    try {
        const conn = await getConnection();
        const {id} = req.params;
        const newData = req.body;

        const updateSql = 'UPDATE pokemon SET name = ?, photo = ?, type = ?, height = ?, weight = ? WHERE id = ?;';
        const [result] = await conn.query(updateSql, [
            newData.name,
            newData.photo,
            newData.type,
            newData.height,
            newData.weight,
            id
        ]);
        if (result.affectedRows > 0){
            res.status(200).json({success: true});
        } else {
            res.status(200).json({success: false, message: "ID doesn't exist"});
        }
        await conn.end();
    } catch (error){
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});
//delete by id
server.delete('/pokemon/:id', async (req, res) => {
    try {
        const conn = await getConnection();
        const { id } = req.params;
        const deleteSql = 'DELETE FROM pokemon WHERE id = ?';
        const [result] = await conn.query(deleteSql, [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(200).json({ success: false, message: "ID doesn't exist" });
        }
        await conn.end();
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    };
});

//endpoints table: users
//register new user
server.post('/signup', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const { email, name, address, password } = req.body;

        const selectEmail = 'SELECT * FROM users WHERE email = ?';
        const [emailResult] = await conn.query(selectEmail, [email]);

        if (emailResult.length === 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertUser = 'INSERT INTO users (email, name, address, password) VALUES (?, ?, ?, ?)';
            const [newUser] = await conn.query(insertUser, [email, name, address, hashedPassword]);
            res.status(201).json({ success: true, id: newUser.insertId });
        } else {
            res.status(409).json({ success: false, message: 'User already exists' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    } finally {
        if (conn) await conn.end();
    }
});

//log in
server.post('/login', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const { email, password } = req.body;
        
        // Debugging: Log email and password
        console.log("Email:", email);
        console.log("Password:", password);

        const selectUser = 'SELECT * FROM users WHERE email = ?';
        const [resultUser] = await conn.query(selectUser, [email]);
        
        // Debugging: Log resultUser
        console.log("Result User:", resultUser);

        if (resultUser.length !== 0) {
            const hashedPassword = resultUser[0].hashed_password;
            
            // Debugging: Log hashedPassword
            console.log("Hashed Password:", hashedPassword);

            const isSamePassword = await bcrypt.compare(password, hashedPassword);
            if (isSamePassword) {
                const infoToken = { email: resultUser[0].email, id: resultUser[0].id };
                const token = jwt.sign(infoToken, 'passcode', { expiresIn: '1h' });
                res.status(201).json({ success: true, token: token });
            } else {
                res.status(400).json({ success: false, message: 'incorrect password' });
            }
        } else {
            res.status(400).json({ success: false, message: 'incorrect email' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    } finally {
        if (conn) await conn.end();
    }
});
function authorize(req, res, next) {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
        res.status(400).json({ 
            success: false, 
            message: 'Unauthorized' 
        });
    } else {
        try {
            const token = tokenString.split(' ')[1];
            const verifiedToken = jwt.verify(token, 'passcode');
            req.userInfo = verifiedToken;
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                message: error 
            });
        }
        next();
    }
};
server.get('/profile', authorize, async (req, res) => {
    try {
        const conn = await getConnection();
        const userSql = 'SELECT * FROM users';
        const [result] = await conn.query(userSql);
        res.status(200).json({ 
            succes: true, 
            data: result 
        });
        conn.end();
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error 
        });
    }
  });
//log out
server.put('/logout', async (req,res) =>{
    try {
        const conn = await getConnection();
        const authHeader = req.headers["authorization"];
        jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
        if (logout) {
            res.send({msg: 'Session ended' });
        } else {
            res.send({msg:'Error'});
        };
        });
        await conn.end();
    } catch (error){
        res.status(400).json({ 
            success: false, 
            message: error 
        });
    };
});
