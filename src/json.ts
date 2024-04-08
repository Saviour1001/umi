import { readFileSync, writeFileSync } from "fs";

const data = readFileSync("data.txt", "utf-8");

// there is collection name and collection address in the data
// last string in each line is the collection address
// everything before that is the collection name
const lines = data.split("\n");
// remove the extra characters such as /t and /r and convert the data into json array
// with collection name and collection address

// trim the extra space at the end of the line
const trimmedLines = lines.map((line) => line.trim());

// everything after the "\t" is the collection address
// everything before the "\t" is the collection name
// convert it into json array

const json = trimmedLines.map((line) => {
  const [name, address] = line.split("\t");
  return { name, address };
});

// write it to a file

let collectionAddress;

let options = {
  method: "GET",
  headers: {
    "X-API-KEY": "KEY",
  },
};

// fetch the data from the api for each collection address

let allData = [{}];

for (let i = 0; i < json.length; i++) {
  console.log(i);
  let collectionAddress = json[i].address;

  let newJson = {};
  let url = `https://api.simplehash.com/api/v0/nfts/collection/${collectionAddress}?limit=1`;
  await fetch(url, options)
    .then((res) => res.json())
    .then((data: any) => {
      try {
        // get the collection image uri
        let collectionImage = data.nfts[0].collection.image_url;

        // create a new json object with collection name, collection address and collection image
        newJson = {
          name: json[i].name,
          address: json[i].address,
          image: collectionImage,
        };
        console.log(i, newJson);
      } catch (err) {
        // if there is an error, skip the collection and move to the next one and continue
        console.log("Error: ", err);
      }
    });

  allData.push(newJson);
}

console.log(allData);

// write the data to a file

writeFileSync("data.json", JSON.stringify(allData));
