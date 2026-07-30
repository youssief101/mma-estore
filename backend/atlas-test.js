require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

console.log("Connection String:");
console.log(process.env.MONGODB_URI);

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        console.log("\nConnecting to Atlas...");

        await client.connect();

        console.log("Connected successfully!");

        const result = await client.db("admin").command({ ping: 1 });

        console.log("Ping Result:");
        console.log(result);

        console.log("\nSUCCESS: Atlas connection works.");
    } catch (error) {
        console.error("\nFAILED:");
        console.error(error);
    } finally {
        await client.close();
        console.log("\nConnection closed.");
    }
}

run();