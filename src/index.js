const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 9000;


/**
 *@brief Promise voor het handelen van de home routing

 */
app.get('/', (req, res) => {
	res.send('Hellow, World');
});


/**
 * @brief Functie voor het runnen van de webserver
 *
 */
const server = app.listen(PORT, () => {
	console.log(`[info]\t\tServer is running on port: ${PORT}`);
});
