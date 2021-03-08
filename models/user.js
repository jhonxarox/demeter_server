var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }
    else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (email, password) VALUES (?,?)'
                db.run(insert, ["admin@example.com",md5("admin123456")])
                db.run(insert, ["user@example.com",md5("user123456")])
            }
        });  
    }
});

// let db = new sqlite3.Database(DBSOURCE, (err) => {
//     if (err) {
//       // Cannot open database
//       console.error(err.message)
//       throw err
//     }
//     else {
//         db.exec("drop table user",
//         (err) => {
//             if (err) {
//                 console.log(err);
//                 console.log('FAIL Deleting Table.')
//             }else{
//                 console.log('Deleting Table.')
//             }
//         });  
//     }
// });


module.exports = db
