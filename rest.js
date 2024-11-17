const http = require("http");
const https = require("https");

export async function getHttp(options, onResult) {
    let output = '';

    const req = http.request(options, (res) => {
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            output += chunk;
        });

        res.on('end', () => {
            let obj = JSON.parse(output);

            onResult(res.statusCode, obj);
        });
    });

    req.on('error', (err) => {

    });

    req.end();
};