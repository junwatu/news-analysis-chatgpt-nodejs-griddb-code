
async function fetchMultiNews() {
	const url = "https://datasets-server.huggingface.co/first-rows?dataset=multi_news&config=default&split=train";

	try {
		const response = await fetch(url);
		if (response.ok) {
			const data = await response.json();

			const newsData = []

			data.rows.forEach(element => {
				newsData.push(`${element.row.document}`)
			});

			return newsData

		} else {
			console.error('Error fetching dataset', response.statusText);
		}
	} catch (error) {
		console.error('Error:', error);
	}
}


export { fetchMultiNews }