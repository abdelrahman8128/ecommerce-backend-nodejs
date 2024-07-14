const express = require('express');
const dotenv=require('dotenv');
const morgan= require('morgan');


dotenv.config({path:'config.env',});



const dbConnection = require('./config/database');
const categoryRoute=require('./routes/categoryRoute');
const subCategoryRoute=require('./routes/subCategoryRoute');
const brandRoute=require('./routes/brandRoute');
const productRoute=require('./routes/productRoute');
const ApiError = require('./utils/apiError');
const globalError=require('./middlewares/errorMiddleware');


dbConnection();
const app = express();

//middle wares

app.use(express.json());

// if (process.env.NODE_ENV === 'development'){
//     app.use(morgan('dev'));
//     console.log(`mode:${process.env.NODE_ENV}`);
// }

app.use('/api/v1/categories',categoryRoute);
app.use('/api/v1/subCategories',subCategoryRoute);
app.use('/api/v1/brands',brandRoute);
app.use('/api/v1/products',productRoute);


app.all('*',(req,res,next)=>{
    // const err =new Error(  `can't find this route ${req.originalUrl}`);
    // next(err.message);
    next(new ApiError(`Cant't find this route : ${req.originalUrl}`,400));

});

app.use(globalError);




app.get("/",(req,res)=>{
    res.send('our api v3');
});


const PORT = process.env.PORT;

const server =app.listen(PORT,()=>{
    console.log(process.env.NODE_ENV);
    console.log('app running');
}
);


//Events=> list => callback(err)
process.on('unhandledRejection',(err)=>{

    console.error(`UnhandeldRejection Erros:${err.name}|${err.message}`);

    server.close(()=>{
        console.error(`Shuting down ...`);
        process.exit(1);
    });
});


