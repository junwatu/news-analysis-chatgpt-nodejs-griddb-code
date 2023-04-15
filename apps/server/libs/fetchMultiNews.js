
async function fetchMultiNews() {
	const url = "https://datasets-server.huggingface.co/first-rows?dataset=multi_news&config=default&split=train";

	try {
		const response = await fetch(url);
		if (response.ok) {
			const data = await response.json();
			return data.rows
		} else {
			console.error('Error fetching dataset', response.statusText);
			return response.statusText;
		}
	} catch (error) {
		console.error('Error:', error);
		throw new Error(error);
	}
}


export { fetchMultiNews }