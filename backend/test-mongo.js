const mongoose = require("mongoose");

mongoose
    .connect("mongodb+srv://youssiefmok_db_user:KOpdSO2ZrhHQ6jvw@cluster0.dp3gg2v.mongodb.net/?appName=Cluster0")
    .then(() => {
        console.log("Connected!");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });