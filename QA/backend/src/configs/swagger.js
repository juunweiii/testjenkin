const swaggerOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
    openapi: {
        openapi: "3.0.0",
        info: { 
            title: "Stimstim7 - ThreadHub",
            description: "Backend APIs",
            version: "0.0.1",
        },
        license: {
            name: "GNU GPL",
            url: "https://github.com/Ik0nw/ICT2216-SSD"
        },
        servers: [
            {
                url: "http://localhost:3010",
                description: "Development server"
            },
            {
                url: "https://localhost:3010",
                description: "Development server with HTTPS"
            }
        ],
        host: "localhost:3010/",
        basePath: "/api",
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [
            { name: "auth", description: "Authentication APIs" },
            { name: "topics", description: "Forum Topics APIs" },
            { name: "subtopics", description: "Forum Subtopics APIs" },
            { name: "threads", description: "Forum Threads APIs" },
            { name: "users", description: "Forum Users APIs" },
        ],
        components: {
            securitySchemes: {
                // httpOnly cookie pass through cookie instead of req.headers.Authorization
                jwt: {
                    type: "apiKey",
                    in: "header",
                    name: "Cookie"
                    // name: "Authorization",
                    // scheme: "bearer",
                    // bearerFormat: "JWT",
                },
                csrf: {
                    type: "apiKey",
                    in: "header",
                    // name: "Csrf-Token",
                    name: "Cookie",
                },
                csrfSecret: {
                    type: "apiKey",
                    in: "header",
                    name: "Cookie",
                }
            },
        },
    },

    refResolver: {
        buildLocalReference (json, baseUri, fragment, i) {
            return `${json.$id}Model` || `fragment-${i}`
        }
    }
}

module.exports = { swaggerOptions };