const mysql = require("mysql2");


const DATABASE_DOMAIN = "127.0.0.1";
const DATABASE_SCHEMA = "bankserver";
const DATABASE_USER = "dev";
const DATABASE_PASSWORD = "dev";

let queryStr = "";
let whereStr = "";
let tableStr = "";
let whereCount = 0;


/**
 * =====================|
 *            |
 * Database connection  |
 *            |
 * =====================|
 */
const connection = mysql.createConnection({
    host: DATABASE_DOMAIN,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_SCHEMA,
    insecureAuth: false,
});

connection.connect(error => {
    if (error) throw error;
    console.log("[success]\tConnection with database successfull!");
});


/**
 * ================|
 *                 |
 * Query functions |
 *                 |
 * ================|
 */

/**
 * @brief Functie voor het toevoegen van data aan de database
 * @param params
 */
function insert(params) {
    if (params.length == 0) {
        console.log("[error]\t\tEr zijn geen waardes aan de database gegeven!");
        return;
    }

    if (tableStr.length == 0) {
        console.log("[error]\t\tEr is geen tabelnaam gezet!");
        return;
    }

    queryStr = "INSERT INTO " + tableStr + " ( ";
    let objectKeys = Object.keys(params);
    let objectValues = Object.values(params);

    if (objectKeys > 0 && objectValues > 0) {
        for (let i = 0; i < objectKeys.length; i++) {
            queryStr += objectKeys[i];

            if (i != objectKeys.length - 1) {
                queryStr += ", ";
            }
        }

        queryStr += ") VALUES (";

        for (let i = 0; i < objectValues.length; i++) {
            queryStr += `"${objectValues[i]}"`;

            if (i != objectValues.length - 1) {
                queryStr += ", ";
            }
        }

        queryStr += ");";
    } else {
        return;
    }
}

/**
 * @brief Functie voor het ophalen van de data uit de database
 * @param params
 * @returns void
 */
function get(params = {}) {
    queryStr = "SELECT ";

    if (Object.values(params).length != 0) {
        for (let i = 0; i < params.length; i++) {
            queryStr += params[i];

            if (i != params.length - 1) {
                queryStr += ", ";
            }
        }
    } else {
        queryStr += "*";
    }

    if (tableStr.length == 0) {
        console.log("[error]\t\tEr is geen tabel naam toegevoegd!");
        return;
    }

    queryStr += " FROM " + tableStr + "  " + whereStr + " ;";
};

/**
 * @brief Functie voor het updaten van regels in de database
 *
 * @param params
 */
function update(params) {
    if (params.length == 0) {
        console.log("[error]\t\tEr zijn geen waardes aan de database gegeven!");
        return;
    }

    if (tableStr.length == 0) {
        console.log("[error]\t\tEr is geen tabelnaam gezet!");
    }

    queryStr = "UPDATE " + tableStr + " SET ";
    objectKeys = Object.keys(params);
    objectValues = Object.values(params);

    if (objectKeys.length > 0 && objectValues.length > 0) {
        for (let i = 0; i < objectKeys.length; i++) {
            queryStr += `${objectKeys[i]} = "${objectValues[i]}"`;

            if (i != objectKeys.length - 1) {
                queryStr += ", ";
            }
        }
    } else {
        return;
    }
}


/**
 * @brief Functie voor het verwijderen van data uit de database
 */
function remove() {
    if (tableStr.length = 0) {
        console.log("[error]\t\tEr is geen tabelnaam gezet!");
        return;
    }

    queryStr = "DELETE FROM " + tableStr + " " + whereStr;
}


/**
 * @brief Functie voor het zetten van de table
 * @param table
 */
function table(table) {
    tableStr = table;
}


/**
 * @brief Functie voor het bouwen van de where query
 *
 */
function where(params) {
    if (whereCount > 0) {
        whereStr += " AND ";
    } else {
        whereStr = " WHERE "
    }

    for (let i = 0; i < params.length; i++) {
        whereStr += params[i] + " ";
    }
}


/**
 * @brief Functie voor het uitvoeren van de database transacties
 *
 */
function execute() {
    console.log(queryStr);
    return new Promise((resolve, reject) => {
        connection.query(queryStr, (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
            dispose();
        });
    });
}


/**
 * @brief functie voor het legen van een variabele
 * @param variabele
 * @returns void
 */
function empty(variable) {
    if (variable == null) {
        return;
    }

    variable = null;
}


/**
 * @brief Functie voor het legen van de query variabelen
 *
 */
function dispose() {
    empty(queryStr);
    empty(whereStr);
    empty(tableStr);
    whereCount = 0;
}


/**
 * @brief  Export functions
 */
module.exports = {
    get,
    insert,
    update,
    remove,
    table,
    where,
    execute,
};
