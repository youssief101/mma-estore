const dns = require("dns").promises;

async function test() {
    try {
        console.log("Testing normal DNS lookup...");

        console.log(
            await dns.lookup("ac-mnnrsog-shard-00-00.dp3gg2v.mongodb.net")
        );

        console.log(
            await dns.lookup("ac-mnnrsog-shard-00-01.dp3gg2v.mongodb.net")
        );

        console.log(
            await dns.lookup("ac-mnnrsog-shard-00-02.dp3gg2v.mongodb.net")
        );

    } catch (err) {
        console.error(err);
    }
}

test();