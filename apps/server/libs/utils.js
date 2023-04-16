import { logger } from "./logger.js"

function truncateWords(inputString, maxWords) {
	const words = inputString.split(/\s+/);
	logger.info(`Words Count: ${words.length}`);
	if (words.length > maxWords) {
		return words.slice(0, maxWords).join(' ');
	}
	return inputString;

}

function formatData(newsData) {
	const newsDataObject = {}
	newsData.forEach((element, index) => {
		const news = element?.row?.document;
		newsDataObject[index + 1] = news;
	});
	return newsDataObject;
}

export { truncateWords, formatData }