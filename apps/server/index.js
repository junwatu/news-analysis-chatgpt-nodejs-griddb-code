import express from 'express';
import cors from 'cors';
import { fetchMultiNews } from './fetchMultiNews.js';

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
	origin: 'http://localhost:3001',
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/multinews', async (req, res) => {
	try {
		const newsData = await fetchMultiNews();
		res.status(200).json(newsData);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching multi news' });
	}
});

app.get('/gentags', async (req, res) => {
	res.json({ action: "not implmented yet!" })
})

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
