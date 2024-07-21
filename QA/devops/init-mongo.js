db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD);
db = db.getSiblingDB(process.env.DB_NAME);
db.createUser(
    {
        user: process.env.DB_USER,
        pwd: process.env.DB_PASSWORD,
        roles: [
            {
                role: process.env.DB_ROLE,
                db: process.env.DB_NAME,
            }
        ]
    }
);

db.createUser(
    {
        user: process.env.DB_SUPER_USER,
        pwd: process.env.DB_SUPER_PASSWORD,
        roles: [
            {
                role: process.env.DB_SUPER_ROLE,
                db: process.env.DB_NAME,
            }
        ]
    }
);