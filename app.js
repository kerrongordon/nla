const baseUrl = "https://www.nla.gd/";

const allGames = [
  {
    title: "super-6",
    url: `${baseUrl}super-6`,
  },
  {
    title: "daily-pick-3",
    url: `${baseUrl}daily-pick-3`,
  },
  {
    title: "daily-cash-4",
    url: `${baseUrl}daily-cash-4`,
  },
  {
    title: "lotto",
    url: `${baseUrl}lotto`,
  },
  {
    title: "pay-way",
    url: `${baseUrl}pay-way`,
  },
];

import axios from "axios";
import cheerio from "cheerio";
import HtmlTableToJson from "html-table-to-json";
import fs from "fs";

const fetchData = async (index) => {
  const url = allGames[index].url;
  const title = allGames[index].title;
  const result = await axios.get(url);
  const data = {
    pageTable: cheerio.load(result.data),
    title: title,
  };
  return data;
};

for (const game in allGames) {
  fetchData(game).then(parseData);
}

const allData = [];

function parseData(d) {
  const table = d.pageTable("table").last().parent().html();
  const jsonTables = HtmlTableToJson.parse(table);
  const data = {
    title: d.title,
    timeStamp: Date.now(),
    data: jsonTables.results,
  };
  allData.push(data);
  const dataToString = JSON.stringify(allData, null, 2);
  try {
    fs.writeFileSync("nla.json", dataToString);
    console.log(`${d.title} saved`);
  } catch (error) {
    console.error(err);
  }
}
