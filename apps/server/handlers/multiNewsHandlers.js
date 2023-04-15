import * as GridDB from '../libs/griddb.cjs';

function saveForEach(array) {
	for (const item of array) {
		GridDB.insert(item, GridDB.collectionDb);
	}
}

function saveNewsData(newsData) {
	const newsDataObject = {};
	const newsDataArray = [];
	newsData.forEach((element, index) => {
		const news = element?.row?.document;
		newsDataObject[index + 1] = news;
		newsDataArray.push([index, news]);
	});

	saveForEach(newsDataArray);
	return newsDataObject;
}

function formatData(newsData) {
	const newsDataObject = {};
	newsData.forEach((element, index) => {
		const news = element?.row?.document;
		newsDataObject[index + 1] = news;
	});
	return newsDataObject;
}

export { saveNewsData, formatData };
