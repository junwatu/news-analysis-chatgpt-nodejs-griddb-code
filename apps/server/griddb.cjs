const griddb = require('griddb-node-api')

const containerName = 'MultiNews'

const initStore = async () => {
	const factory = griddb.StoreFactory.getInstance();
	try {
		// Connect to GridDB Cluster
		const store = await factory.getStore({
			host: "127.0.0.1",
			// transaction port (see in griddb config gs_cluster.json)
			port: 10001,
			clusterName: "myCluster",
			username: "admin",
			password: "admin",
		});
		return store;
	} catch (e) {
		throw e;
	}
};

// Initialize container but not yet create it
function initContainer() {
	const conInfo = new griddb.ContainerInfo({
		'name': containerName,
		'columnInfoList': [
			["id", griddb.Type.INTEGER],
			["news", griddb.Type.STRING]
		],
		'type': griddb.ContainerType.COLLECTION, 'rowKey': true
	});

	return conInfo
}

async function createContainer(store, conInfo) {
	try {
		const collectionDB = await store.putContainer(conInfo);
		return collectionDB;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

async function initGridDbTS() {
	try {
		const store = await initStore()
		const conInfo = await initContainer()
		const collectionDb = await createContainer(store, conInfo)
		return { collectionDb, store, conInfo }
	}
	catch (err) {
		console.error(err);
		throw err;
	}
}

async function containersInfo(store) {
	for (var index = 0; index < store.partitionController.partitionCount; index++) {
		store.partitionController.getContainerNames(index, 0, -1)
			.then(nameList => {
				nameList.forEach(element => {
					// Get container information
					store.getContainerInfo(element)
						.then((info) => {
							console.log("Get ContainerInfo: \nname=%s", info.name);
							if (info.type == griddb.ContainerType.COLLECTION) {
								console.log('type=Collection');
							} else {
								console.log('type=TimeSeries');
							}
							console.log("rowKeyAssigned=%s", info.rowKey.toString());
							console.log("columnCount=%d", info.columnInfoList.length);
							info.columnInfoList.forEach(
								element => console.log("column (%s, %d)", element[0], element[1])
							);
						})
					console.log(element)
				});
				return true;
			})
			.catch(err => {
				if (err.constructor.name == 'GSException') {
					for (var i = 0; i < err.getErrorStackSize(); i++) {
						console.log("[%d]", i);
						console.log(err.getErrorCode(i));
						console.log(err.getMessage(i));
					}
				} else {
					console.log(err);
				}
			});
	}
}

async function insert(data, db) {
	try {
		db.put(data);
		return { ok: true };
	} catch (err) {
		console.log(err);
		return { ok: false, error: err };
	}
}

async function multiInsert(data, db) {
	try {
		db.multiPut(data);
		return { ok: true };
	} catch (err) {
		console.log(err);
		return { ok: false, error: err };
	}
}

// Query all data
async function queryAll(db, containerName) {
	const q = `SELECT * FROM ${containerName}`;
	const query = db.query(q);
	try {
		const rowset = await query.fetch();
		const results = [];

		while (rowset.hasNext()) {
			const row = rowset.next();
			const rowData = { id: `${row[0]}`, news: row[1] };
			results.push(rowData);
		}

		return results;
	} catch (err) {
		console.log(err);
		throw err;
	}
}

// Delete container
async function dropContainer(store, containerName) {
	store.dropContainer(containerName).then(() => { return "OK" }).catch(e => { throw new Error(e) })
}

module.exports = {
	initStore,
	initContainer,
	initGridDbTS,
	createContainer,
	insert,
	multiInsert,
	queryAll,
	dropContainer,
	containersInfo,
	containerName
}

