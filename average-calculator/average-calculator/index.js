const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;
const MAX_WINDOW = 10;

let rollingNumbers = [];

const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzODI5NzM4LCJpYXQiOjE3NDM4Mjk0MzgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJhYWM0NzA4LWEwNGYtNDg5Ni04ZDkwLWNjZDgzM2VjYTM4OCIsInN1YiI6Ijk5MjIxMDMyMzlAbWFpbC5qaWl0LmFjLmluIn0sImVtYWlsIjoiOTkyMjEwMzIzOUBtYWlsLmppaXQuYWMuaW4iLCJuYW1lIjoibWVocmFtam90IHNvZWkiLCJyb2xsTm8iOiI5OTIyMTAzMjM5IiwiYWNjZXNzQ29kZSI6IlNyTVFxUiIsImNsaWVudElEIjoiYmFhYzQ3MDgtYTA0Zi00ODk2LThkOTAtY2NkODMzZWNhMzg4IiwiY2xpZW50U2VjcmV0IjoicUNySmN3QnptYUtiY1J2ZyJ9.R3-29Qh8kpwT7CcGeMr217DqTuFqEm-ea8wffezRv_E";

const endpoints = {
    p: "http://20.244.56.144/evaluation-service/primes",
    f: "http://20.244.56.144/evaluation-service/fibo",
    e: "http://20.244.56.144/evaluation-service/even",
    r: "http://20.244.56.144/evaluation-service/rand",
};

const getNumbers = async (typeKey) => {
    if (!endpoints[typeKey]) return [];

    try {
        const cancelToken = axios.CancelToken.source();
        setTimeout(() => cancelToken.cancel(), 500);

        const res = await axios.get(endpoints[typeKey], {
            headers: {
                Authorization: AUTH_TOKEN,
            },
            timeout: 500,
            cancelToken: cancelToken.token
        });

        return res.data?.numbers || [];

    } catch (err) {
        console.warn(`Request failed for ${typeKey}:`, err.message);
        return [];
    }
};

app.get("/numbers/:numberid", async (req, res) => {
    const type = req.params.numberid;

    if (!endpoints[type]) {
        return res.status(400).json({ error: "Unknown type requested" });
    }

    const previous = [...rollingNumbers];

    const fetched = await getNumbers(type);
    console.log("Fetched:", fetched);

    for (let val of fetched) {
        if (!rollingNumbers.includes(val)) {
            rollingNumbers.push(val);
            if (rollingNumbers.length > MAX_WINDOW) {
                rollingNumbers.shift();
            }
        }
    }

    let avg = 0;
    if (rollingNumbers.length > 0) {
        avg = rollingNumbers.reduce((acc, curr) => acc + curr, 0) / rollingNumbers.length;
    }

    res.json({
        windowPrevState: previous,
        windowCurrState: rollingNumbers,
        numbers: fetched,
        avg: +avg.toFixed(2)
    });
});

app.listen(PORT, () => {
    console.log(`Server live at http://localhost:${PORT}`);
});
