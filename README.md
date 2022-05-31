# atm-server
Includes API

## Setup

### Installation
```
git clone https://github.com/Project-3-4/atm-server-ukip atm-server-ukip
cd atm-server-ukip
npm i
```

### Secrets
Add a .env file to the root of your folder with the following content (change lines where needed)
```
DATABASE_DOMAIN="127.0.0.1"
DATABASE_SCHEMA="bankserver"
DATABASE_USER="user"
DATABASE_PASSWORD="pass"
ADMIN_AUTH_KEY="admin_key"
```

Keep this information private (and change credentials if someone else gets the content of the .env file)!

The 'ADMIN_AUTH_KEY' can always be used and accessed all parts of the API.

### Config

```
{
  "port": 9000,                 // Port the API is listening on
  "balanceColumn": "current",   // Column which will be used for balance related calls
  "printQuery": false           // Prints the whole query (so including the users's AUTH_KEY) when true - turn off for production!
}
```