import {
  createSignerFromKeypair,
  generateSigner,
  PublicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createV1, createCollectionV1 } from "@metaplex-foundation/mpl-core";
import { secretKey } from "./consts";

const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=b8faf699-a3b6-4697-9a58-31d044390459"
);

const myKeypair = umi.eddsa.createKeypairFromSecretKey(
  Uint8Array.from(secretKey)
);
const publicKey = "5jp89HoRMqyrPNcBfLD3LkAo1g1Rmhvatn3yvtqzASZH";

const myKeypairSigner = createSignerFromKeypair(umi, myKeypair);

umi.use(signerIdentity(myKeypairSigner));

// create a function for creating a collection
async function createCollection() {
  const collectionSigner = generateSigner(umi);
  console.log("Collection Address", collectionSigner.publicKey.toString());
  await createCollectionV1(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://ipfs.moralis.io:2053/ipfs/QmWHnPjenBcPpjrjZ5yrRfHyJ5nrNGMQpRyucL3F8Wgd9m",
  }).sendAndConfirm(umi);
}

// createCollection();

async function createNFTOfCollection(
  collectionAddress: string,
  newOwner: string
) {
  const asset = generateSigner(umi);
  const result = await createV1(umi, {
    asset: asset,
    name: "My Nft",
    uri: "https://ipfs.moralis.io:2053/ipfs/QmWHnPjenBcPpjrjZ5yrRfHyJ5nrNGMQpRyucL3F8Wgd9m",
    collection: collectionAddress as PublicKey,
    owner: newOwner as PublicKey,
  }).sendAndConfirm(umi);
  console.log("NFT", result);
}

// createNFTOfCollection(
//   "88gBicCpxVJQt6hvmqyaMyMz9whNbVVLqEysaLgvchN8", // collection address
//   "BGfybQ2uFGPmCscCPAgJtBFXDWc5GNqzymSq3AAo6Nvi" // user address
// );
