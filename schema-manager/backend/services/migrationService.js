const fs = require('fs');
const path = require('path');
const connection = require('../config/db');

const migrationsFolder = path.join(__dirname, '../migrations');

const runMigrations = () => {
    connection.query('SELECT migration_name FROM migrations', (err, results) => {
        if (err) throw err;

        const executedMigrations = results.map(row => row.migration_name);

        const files = fs.readdirSync(migrationsFolder);

        files.forEach(file => {
            if (!executedMigrations.includes(file)) {

                const filePath = path.join(migrationsFolder, file);
                const sql = fs.readFileSync(filePath, 'utf8');  // ✅ FIXED PATH

                if (!sql.trim()) {
                    console.log(`Skipping empty file: ${file}`);
                    return;
                }

                connection.query(sql, (err) => {
                    if (err) throw err;

                    connection.query(
                        'INSERT INTO migrations (migration_name) VALUES (?)',
                        [file]
                    );

                    console.log(`Executed: ${file}`);
                });
            }
        });
    });
};

module.exports = { runMigrations };