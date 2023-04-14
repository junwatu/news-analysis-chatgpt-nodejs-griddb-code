import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv'

dotenv.config()

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateTagsFromNews(news) {
	const prompt = `Generate five tags from this news with each tag is less than 2 words:\n\n${news}`;
	try {
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: prompt }],
		});
		return completion.data.choices[0].message;
	} catch (error) {
		console.error("Error occurred while generating tags:", error);
		// Handle the error as needed, or return a suitable error message
		return "An error occurred while generating tags.";
	}
}

export { generateTagsFromNews };