const application = {
    domain: process.env.DOMAIN || 'localhost',
    port: process.env.PORT,
    cors: {
        whiteList: [
            'http://localhost:3000',
            `http://${process.env.DOMAIN}:${process.env.PORT}`,
        ],
    }
}

export {
    application
}