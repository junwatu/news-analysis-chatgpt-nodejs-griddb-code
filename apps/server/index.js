import cors from 'cors';
import pino from 'pino';
import express from 'express';
import * as GridDB from "./libs/griddb.cjs";
import { generateTagsFromNews } from './libs/genTags.js';
import { fetchMultiNews } from './libs/fetchMultiNews.js';

const app = express();
const logger = pino();
const port = process.env.PORT || 4000;
const corsOptions = { origin: ['http://localhost:4001', 'http://127.0.1:4000'] };
const { collectionDb, store, conInfo } = await GridDB.initGridDbTS();

logger.info(await GridDB.containersInfo(store))

app.use(cors(corsOptions));
app.use(express.json());

function saveForEach(array) {
	for (const item of array) {
		GridDB.insert(item, collectionDb);
	}
}

function saveNewsData(newsData) {
	const newsDataObject = {}
	const newsDataArray = []
	newsData.forEach((element, index) => {
		const news = element?.row?.document;
		newsDataObject[index + 1] = news;
		newsDataArray.push([index, news]);
	});

	//⚠️
	saveForEach(newsDataArray);
	return newsDataObject;
}

function formatData(newsData) {
	const newsDataObject = {}
	newsData.forEach((element, index) => {
		const news = element?.row?.document;
		newsDataObject[index + 1] = news;
	});
	return newsDataObject;
}

app.use((req, res, next) => {
	logger.info(req);
	next();
})

app.get("/", async (req, res) => {
	res.json({ app: "Auto News Tagging" })
})

app.get('/multinews', async (req, res) => {
	try {
		const newsData = await fetchMultiNews();
		logger.info(`News Data: ${newsData.length}`);

		//const allData = await GridDB.queryAll(collectionDb, GridDB.containerName);
		//logger.info(`News Data Length: ${allData.length}`);
		const cont = await store.putContainer(conInfo)
		const query = await cont.query("SELECT *");
		const rowset = await query.fetch();
		const results = [];

		while (rowset.hasNext()) {
			const row = rowset.next();
			const rowData = { id: `${row[0]}`, news: row[1] };
			results.push(rowData);
		}

		if (Array.isArray(results) && results.length == 0) {
			logger.info('Database Empty...initialized!');
			const newsDataObject = saveNewsData(newsData);
			res.status(200).json(newsDataObject);
		} else {
			const newsDataObject2 = formatData(newsData);
			res.status(200).json(newsDataObject2);
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});

app.get('/gentags/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const cont = await store.putContainer(conInfo)
		const dataByID = await cont.get(parseInt(id))
		const words1500 = truncateWords(dataByID[1], 1500);
		const tags = await generateTagsFromNews(words1500);
		res.status(200).json({ tags: tags.content });
	} catch (error) {
		res.status(400).json({ error })
	}
})

app.listen(port, () => {
	logger.info(`🖥️  Server Port: ${port} ✅`);
});

function truncateWords(inputString, maxWords) {
	const words = inputString.split(/\s+/);
	logger.info(`Words Count: ${words.length}`);
	if (words.length > maxWords) {
		return words.slice(0, maxWords).join(' ');
	}
	return inputString;
}