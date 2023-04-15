import express from 'express';
import * as GridDB from '../libs/griddb.cjs';
import { fetchMultiNews } from '../libs/fetchMultiNews.js';
import { saveNewsData, formatData } from '../handlers/multiNewsHandlers.js';

const multiNewsRouter = express.Router();

multiNewsRouter.get('/', async (req, res) => {
	try {
		const newsData = await fetchMultiNews();
		const allData = await GridDB.queryAll(GridDB.collectionDb, GridDB.containerName);

		if (Array.isArray(allData) && allData.length == 0) {
			const newsDataObject = saveNewsData(newsData);
			res.status(200).json(newsDataObject);
		} else {
			const newsDataObject2 = formatData(newsData);
			res.status(200).json(newsDataObject2);
		}
	} catch (error) {
		res.status(500).json({ error: 'Error fetching multi news' });
	}
});

export { multiNewsRouter };
