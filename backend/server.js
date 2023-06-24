const app = require('./app');

const dotenv = require('dotenv');
const connectDataBase = require('./config/database');

// Handling uncaught Exception...
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1); // I am not sure this has to be this way or the way server is closed at the end.
});

// config...
dotenv.config({path: "backend/config/.env"});

//connecting database...
connectDataBase();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on port ${process.env.PORT}`);
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});


// Unhandled Promise Rejections...
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
});