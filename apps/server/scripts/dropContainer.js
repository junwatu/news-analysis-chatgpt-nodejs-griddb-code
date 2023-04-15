import * as GridDB from "../libs/griddb.cjs"

const { collectionDb, store, conInfo } = await GridDB.initGridDbTS();
await GridDB.dropContainer(store, GridDB.containerName)

