const express = require("express");
const query = require("./database");

const config = require("./config.json");
const PORT = config.port;

const app = express();
const router = express.Router();


/**
 * @brief Promise voor het instellen van de router
 *
 */
router.use((req, res, next) => {
    console.log("[info]\t\tMiddleware ingeschakeld!");
    query.table("rekening");
    query.get();

    let q = query.execute();
    console.log(q);

    next();
});

router.param("authKey", (req, res, next, id) => {
    console.log("[info]\t\tRouter param aangeroepen");

    if (req.params.authKey == 400) {
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
router.get("/api/:authKey/balance/get", (req, res, next) => {
    // When auth key is provided and balance is requested
    res.json({balance: 123.45})
});

router.post("/api/:authKey/balance/post", (req, res, next) => {
    // When auth key is provided and balance is requested
});

router.get("/api/:authKey/withdraw/get", (req, res, next) => {
    // When auth key is provided and user wants to withdraw money
    res.send("Money, money money");
});

router.post("/api/:authKey/withdraw/post", (req, res, next) => {
    // When auth key is provided and user wants to withdraw money
    res.send("Henkie henkie henkie");
});

router.get("/api/error/401", (req, res, next) => {
    res.json({
        401: "Not authorized",
        request: "failed"
    });
});


/**
 * @brief Functie voor het runnen van de webserver
 *
 */
app.use('/', router);
const server = app.listen(PORT, () => {
    console.log(`[info]\t\tServer is running on port: ${PORT}`);
    console.log(`[info]\t\thttp://localhost:${PORT}`)
});
