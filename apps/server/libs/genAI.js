import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv'
import { truncateWords } from './utils.js'

dotenv.config()

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateTagsFromNews(news) {
	const prompt = `Generate five tags, less than 3 words, and give numbers for the tags from this news:\n\n${news}`;
	try {
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			max_tokens: 2000,
			messages: [{ role: "user", content: prompt }],
		});
		return completion.data.choices[0].message;
	} catch (error) {
		console.error("Error occurred while generating tags:", error);
		// Handle the error as needed, or return a suitable error message
		return "An error occurred while generating tags.";
	}
}

async function generateTitle(news) {
	const simplifyData = truncateWords(news, 1000);
	const prompt = `Generate the best short title less than 7 words from this news:\n ${simplifyData}`;
	try {
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			max_tokens: 2000,
			messages: [{ role: "user", content: prompt }],
		});
		return completion.data.choices[0].message;
	} catch (error) {
		console.error("Error occurred while generatiing title:", error);
		// Handle the error as needed, or return a suitable error message
		return "An error occurred while generating title.";
	}
}

export { generateTagsFromNews, generateTitle };