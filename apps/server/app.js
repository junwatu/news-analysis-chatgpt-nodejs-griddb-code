
import cors from 'cors';
import express from 'express';
import { multiNewsRouter } from './routes/multiNews.js';
import { genTagsRouter } from './routes/genTags.js';
import * as GridDB from "./libs/griddb.cjs";

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
	origin: 'http://localhost:3001',
};

const { collectionDb, store, conInfo } = await GridDB.initGridDbTS();
console.log(await GridDB.containersInfo(store))

app.use(cors(corsOptions));
app.use(express.json());

app.use('/multinews', multiNewsRouter);
app.use('/gentags', genTagsRouter);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
