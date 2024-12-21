import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Set up SQLite database
const db = new sqlite3.Database('./closetBaru.db', (err) => {
    if (err) {
        console.error('Failed to connect to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Debugging steps to verify database and table
db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
            console.error("Error enabling foreign keys:", err.message);
        } else {
            console.log("Foreign keys enabled.");
        }
    });

    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='PakaianBaru'", (err, row) => {
        if (err) {
            console.error("Database error:", err.message);
        } else if (!row) {
            console.error("Table 'PakaianBaru' does not exist. Please check your database schema.");
        } else {
            console.log("Database is ready, table 'PakaianBaru' exists.");
        }
    });
});

// Endpoint untuk root path (fix 'Cannot GET /')
app.get('/', (_, res) => {
    res.send('Hello, world!');
});

// GET endpoint untuk ambil semua pakaian dari table PakaianBaru dengan deskripsi
app.get('/api/pakaian', (_, res) => {
    const query = `
        SELECT
            PakaianBaru.nama, 
            PakaianBaru.desc, 
            PakaianBaru.main_color, 
            PakaianBaru.sub_color, 
            PakaianBaru.jenis, 
            PakaianBaru.brand, 
            PakaianBaru.occasion, 
            WearFrequency.description AS wear_frequency, 
            Status.description AS status,
            ROW_NUMBER() OVER (ORDER BY PakaianBaru.nama) AS bilangan
        FROM 
            PakaianBaru
        LEFT JOIN 
            WearFrequency ON PakaianBaru.wear_frequency = WearFrequency.id
        LEFT JOIN 
            Status ON PakaianBaru.status = Status.id;
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error retrieving data" });
        }
        console.log(result);  // Log the result to ensure 'bilangan' is present
        res.json({ pakaian: result });
    });
});

// POST endpoint untuk tambah pakaian ke table PakaianBaru
app.post('/api/pakaian', (req, res) => {
    const { nama, desc, main_color, sub_color, jenis, brand, occasion, wear_frequency, status } = req.body;
    const stmt = db.prepare('INSERT INTO PakaianBaru (nama, desc, main_color, sub_color, jenis, brand, occasion, wear_frequency, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(nama, desc, main_color, sub_color, jenis, brand, occasion, wear_frequency, status, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Mulakan server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});