import express from 'express';
import { fetchMultiNews } from '../libs/fetchMultiNews.js';
import { generateTagsFromNews } from '../libs/genTags.js';

const genTagsRouter = express.Router();

genTagsRouter.get('/', async (req, res) => {
	const newsData = await fetchMultiNews();
	const sampleNews = newsData[3].row.document;
	const tags = await generateTagsFromNews(sampleNews);

	res.json({ news: sampleNews, tags: tags.content });
});

export { genTagsRouter };
