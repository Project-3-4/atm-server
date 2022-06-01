require('dotenv').config()
const express = require("express");
const cors = require('cors');
const {execute, get, table, where, update} = require("./database");

const app = express();
const router = express.Router();
const secret = process.env;

const config = require("./config.json");
const PORT = config.port;
let balanceColumn = config.balanceColumn;

let authKey = undefined;
let pinCode = 1111;
/**
 * @brief Promise to (setup and) check the midleware
 */
router.use((req, res, next) => {
    console.log("[info]\t\tMiddleware ingeschakeld!");
    next();
});

/**
 * @brief Setup the authentication key (system)
 * Check if an authentication key is provided and if so, if this an admin key
 */
router.param("authKey", async (req, res, next, id) => {
    console.log("[info]\t\tRouter param aangeroepen");

    // table("account");
    // where(['rekeningID', '=', authKey]);
    // get();
    // let q = await execute();

    // let dbUserPass = q[0]?.password; // Needs to be equal to PIN
    // let dbRekeningId = q[0]?.rekeningID; // Needs to be equal to authKey

    authKey = req.params.authKey;

    if (authKey === secret.ADMIN_AUTH_KEY || (authKey === dbRekeningId && pinCode === dbUserPass)) {
        next();
    } else {
        console.log("[error]\t\tU heeft niet de juiste bevoegdheid om de API te gebruiken!");
        res.redirect("/api/error/401");
    }
});

router.options('*', cors())

/**
 * @brief Load user's balance from db and show it as a JSON
 * Returns JSON with status code and current balance
 */
router.get("/api/:authKey/balance/get", async (req, res, next) => {
    // When auth key is provided and balance is requested
    table("rekening");
    where([`IBAN`, '=', authKey]);
    get([balanceColumn]);
    let q = await execute();

    let balanceAmount = q[0]?.current;

    res.json([{
        balance: balanceAmount,
        request: 200,
        message: "Success"
    }])
});

/**
 * @brief Trigger withdrawal
 * When called we will update our _current_ balance to 'withdraw' money
 */
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

/**
 * @brief Forbidden page
 * Create a page we can redirect to if access is forbidden
 */
router.get("/api/error/401", (req, res, next) => {
    res.json({
        request: 401,
        message: "Not authorized"
    });
});

/**
 * @brief Fallback page
 * When a non existent url is called we will return our handy teapot as a JSON message with status code 418.
 */
router.get('*', function(req, res){
    res.status(418).json({
        request: 418,
        message: "I'm a teapot (so I couldn't find your page)"
    })
});

/**
 * @brief Functie voor het runnen van de webserver
 * Actually run the API server
 */
app.use('/', router);
app.listen(PORT, () => {
    console.log(`[info]\t\tServer is running on port: ${PORT}`);
    console.log(`[info]\t\thttp://localhost:${PORT}`)
});
