require('dotenv').config()
const express = require("express");
const {execute, get, table, where, update} = require("./database");

const app = express();
const router = express.Router();
const secret = process.env;

const config = require("./config.json");
const PORT = config.port;
let balanceColumn = config.balanceColumn;
let authKey = undefined;

/**
 * @brief Promise voor het instellen van de router
 *
 */
router.use((req, res, next) => {
    console.log("[info]\t\tMiddleware ingeschakeld!");
    next();
});

router.param("authKey", (req, res, next, id) => {
    console.log("[info]\t\tRouter param aangeroepen");

    authKey = req.params.authKey;

    if (req.params.authKey === secret.ADMIN_AUTH_KEY) {
        next();
    } else {
        console.log("[error]\t\tU heeft niet de juiste bevoegdheid om de API te gebruiken!");
        res.redirect("/api/error/401");
    }
});

/**
 *@brief Promise voor het handelen van de home routing
 *
 */
router.get("/api/:authKey/balance/get", async (req, res, next) => {
    // When auth key is provided and balance is requested
    table("rekening");
    where([`IBAN`, '=', authKey]);
    get([balanceColumn]);
    let q = await execute();

    let balanceAmount = q[0]?.current;

    res.json({
        balance: balanceAmount,
        request: 200,
        message: "Success"
    })
});

router.post("/api/:authKey/withdraw/post", async (req, res, next) => {
    // When auth key is provided and user wants to withdraw money
    table("rekening");
    where([`IBAN`, '=', authKey]);
    get([balanceColumn]);

    let q = await execute();

    let withdrawAmount = 10; // Connect to ATM!!
    let oldBalanceAmount = q[0].current; // Connect to DB

    table("rekening")
    where([`IBAN`, '=', authKey]);
    update({
        'current': oldBalanceAmount - withdrawAmount
    });

    q = await execute();

    res.json({
        withdraw: withdrawAmount,
        oldBalance: oldBalanceAmount,
        newBalance: q,
        request: 200,
        message: "Success"
    })
});

router.get("/api/error/401", (req, res, next) => {
    res.json({
        request: 401,
        message: "Not authorized"
    });
});

router.get('*', function(req, res){
    res.status(418).json({
        request: 418,
        message: "I'm a teapot (so I couldn't find your page)"
    })
});

/**
 * @brief Functie voor het runnen van de webserver
 *
 */
app.use('/', router);

app.listen(PORT, () => {
    console.log(`[info]\t\tServer is running on port: ${PORT}`);
    console.log(`[info]\t\thttp://localhost:${PORT}`)
});
