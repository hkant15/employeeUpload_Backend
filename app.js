import 'dotenv/config';
import express from 'express';
import { sequelize } from './Utils/dbConnection.js';
import { setupSwagger } from './swagger.js';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import All_Relations from './Utils/All_Realtions.js';
import { registerAllRoutes } from './Utils/All_Routes.js';
import cookieParser from 'cookie-parser';


const app = express();
const PORT = process.env.PORT;

app.use(cors(
  {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
  useTempFiles: false
}));

app.get('/',(req,res)=>{
  res.send(`<h1 style="color:black ;text-align:center;font-size:50px;font-weight:bold; margin-top:100px;">Welcome to the Employee Document Upload Backend API</h1>`)
})

setupSwagger(app);

sequelize.sync().then(() => {
	console.log('Database & tables created!');
}).catch((error) => {
	console.error('Unable to create tables, error:', error);
});

All_Relations();

registerAllRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

