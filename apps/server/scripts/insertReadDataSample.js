import * as GridDB from "../libs/griddb.cjs"

const { collectionDb, store, conInfo } = await GridDB.initGridDbTS();

console.log(await GridDB.containersInfo(store))

const newsData = [1, "National Archives \n \n Yes, it’s that time again, folks. It’s the first Friday of the month, when for one ever-so-brief moment the interests of Wall Street, Washington and Main Street are all aligned on one thing: Jobs. \n \n A fresh update on the U.S. employment situation for January hits the wires at 8:30 a.m. New York time offering one of the most important snapshots on how the economy fared during the previous month. Expectations are for 203,000 new jobs to be created, according to economists polled by Dow Jones Newswires, compared to 227,000 jobs added in February. The unemployment rate is expected to hold steady at 8.3%. \n \n Here at MarketBeat HQ, we’ll be offering color commentary before and after the data crosses the wires. Feel free to weigh-in yourself, via the comments section. And while you’re here, why don’t you sign up to follow us on Twitter. \n \n Enjoy the show. ||||| Employers pulled back sharply on hiring last month, a reminder that the U.S. economy may not be growing fast enough to sustain robust job growth. The unemployment rate dipped, but mostly because more Americans stopped looking for work. \n \n The Labor Department says the economy added 120,000 jobs in March, down from more than 200,000 in each of the previous three months. \n \n The unemployment rate fell to 8.2 percent, the lowest since January 2009. The rate dropped because fewer people searched for jobs. The official unemployment tally only includes those seeking work. \n \n The economy has added 858,000 jobs since December _ the best four months of hiring in two years. But Federal Reserve Chairman Ben Bernanke has cautioned that the current hiring pace is unlikely to continue without more consumer spending."];

const { ok } = GridDB.insert(newsData, collectionDb);

const allData = await GridDB.queryAll(conInfo, store);
console.log(allData);

const queryByID = await GridDB.queryByID(1, conInfo, store);
console.log(queryByID)
