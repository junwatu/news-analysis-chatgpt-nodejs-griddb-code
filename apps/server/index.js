import cors from 'cors';
import express from 'express';
import * as GridDB from "./libs/griddb.cjs";
import { generateTagsFromNews, generateTitle } from './libs/genAI.js';
import { fetchMultiNews } from './libs/fetchMultiNews.js';
import { truncateWords, formatData } from "./libs/utils.js";
import { logger } from "./libs/logger.js";

const app = express();
const port = process.env.PORT || 4000;
const corsOptions = { origin: ['http://localhost:5173', 'http://127.0.1:4000'] };
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

	saveForEach(newsDataArray); //⚠️
	return newsDataObject;
}

async function generateData(newsDataObject) {
	const keys = Object.keys(newsDataObject);
	const randomKey = keys[Math.floor(Math.random() * keys.length)];
	let newsDataSelected = { id: randomKey, news: newsDataObject[randomKey] };
	let title = await generateTitle(newsDataSelected.news);
	let tags = await generateTagsFromNews(truncateWords(newsDataSelected.news, 1000))
	newsDataSelected.title = title.content;
	newsDataSelected.tags = extractTags(tags.content);
	return newsDataSelected;
}

function extractTags(input) {
	const regex = /\d+\.\s*([^\n]+)/g;
	const tags = [];
	let match;

	while ((match = regex.exec(input)) !== null) {
		tags.push(match[1].toLocaleLowerCase());
	}

	return tags;
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

		const cont = await store.putContainer(conInfo)
		const query = await cont.query("SELECT *");
		const rowset = await query.fetch();
		const results = [];

		while (rowset.hasNext()) {
			const row = rowset.next();
			const rowData = { id: `${row[0]}`, news: row[1] };
			results.push(rowData);
		}

		let newsDataSelected;

		if (Array.isArray(results) && results.length == 0) {
			logger.info('Database Empty...initialized!');
			const newsDataObject = saveNewsData(newsData);
			newsDataSelected = await generateData(newsDataObject)
		} else {
			const newsDataObject2 = formatData(newsData);
			newsDataSelected = await generateData(newsDataObject2);
		}

		res.status(200).json(newsDataSelected);

	} catch (error) {
		res.status(400).json({ error });
	}
});


app.get('/gentags/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const cont = await store.putContainer(conInfo)
		const dataByID = await cont.get(parseInt(id))
		const words1500 = truncateWords(dataByID[1], 1000);
		const tags = await generateTagsFromNews(words1500);
		res.status(200).json({ tags: tags.content });
	} catch (error) {
		res.status(400).json({ error })
	}
})

app.listen(port, () => {
	logger.info(`🖥️  Server Port: ${port} ✅`);
});

