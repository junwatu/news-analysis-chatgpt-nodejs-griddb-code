import express from 'express';
import cors from 'cors';
import { fetchMultiNews } from './libs/fetchMultiNews.js';
import { generateTagsFromNews } from './libs/genTags.js';
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
		newsDataArray.push([index, news])
	});

	//⚠️
	saveForEach(newsDataArray)
	return newsDataObject
}

app.get('/multinews', async (req, res) => {
	try {
		const newsData = await fetchMultiNews();
		const newsDataObject = saveNewsData(newsData);
		res.status(200).json(newsDataObject);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching multi news' });
	}
});

app.get('/gentags', async (req, res) => {
	const newsData = await fetchMultiNews();
	const sampleNews = newsData[3].row.document;
	const tags = await generateTagsFromNews(sampleNews)

	res.json({ news: sampleNews, tags: tags.content })
})

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
