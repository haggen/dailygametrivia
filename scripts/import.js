/* eslint-disable no-console */

/**
 * Script to import data from IGDB.
 * @see https://api-docs.igdb.com/
 */

import fs from "fs/promises";

const selectedCategories = [
  0, // Main Game
  4, // Expansion
];

const selectedPlatformIds = [
  6, // PC (Microsoft Windows)

  11, // Xbox
  12, // Xbox 360
  49, // Xbox One
  169, // Xbox Series X|S

  7, // PlayStation
  8, // PlayStation 2
  9, // PlayStation 3
  48, // PlayStation 4
  167, // PlayStation 5

  19, // SNES
  33, // Game Boy
  22, // Game Boy Color
  4, // Nintendo 64
  24, // Game Boy Advance
  21, // Nintendo GameCube
  41, // Wii U
  130, // Nintendo Switch
];

const minimumRating = 50;
const minimumRatingCount = 100;

const criteria = `
  category = (${selectedCategories}) & platforms = (${selectedPlatformIds}) &
  total_rating > ${minimumRating} & total_rating_count > ${minimumRatingCount} &
  version_parent = null & name != null & first_release_date != null & genres != null &
  player_perspectives != null & involved_companies != null & game_modes != null`;

const fields = `
  name, url, first_release_date, genres.name, player_perspectives.name,
  involved_companies.company.name, platforms.name, platforms.abbreviation,
  game_engines.name, game_modes.name, collection.name, total_rating, total_rating_count`;

const headers = {
  "Client-ID": process.env.CLIENT_ID,
  Authorization: `Bearer ${process.env.TOKEN}`,
};

async function getCount({ headers, criteria }) {
  const response = await fetch("https://api.igdb.com/v4/games/count", {
    method: "POST",
    headers,
    body: `where ${criteria};`,
  });
  const data = await response.json();
  return data.count;
}

async function getMultiQuery({ headers, count, fields, criteria }) {
  const body = [];
  const pages = Math.ceil(count / 500);

  if (pages >= 10) {
    throw new Error("Too many pages");
  }

  for (let i = 0; i < pages; i++) {
    body.push(`
      query games "Page ${i + 1}" {
        fields ${fields};
        where ${criteria};
        sort first_release_date;
        limit 500;
        offset ${i * 500};
      };
    `);
  }

  const response = await fetch(`https://api.igdb.com/v4/multiquery`, {
    method: "POST",
    headers,
    body: body.join("\n"),
  });

  const data = await response.json();
  return data;
}

function toCamelCase(value) {
  return value.replace(/_([a-z])/g, ([, initial]) => initial.toUpperCase());
}

function mapToCamelCaseKeys(object) {
  if (typeof object !== "object" || object === null) {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(mapToCamelCaseKeys);
  }

  return Object.fromEntries(
    Object.keys(object).map((key) => [
      toCamelCase(key),
      mapToCamelCaseKeys(object[key]),
    ])
  );
}

async function getGames() {
  const count = await getCount({ headers, criteria });
  const data = await getMultiQuery({ headers, count, fields, criteria });
  const games = {};

  for (const { result } of data) {
    for (const game of result) {
      // Make sure there's a collection.
      if (!game.collection) {
        game.collection = { id: game.id, name: game.name };
      }

      // Make sure there's an engine.
      if (!game.game_engines) {
        game.game_engines = [{ id: 0, name: "Unknown engine" }];
      }

      // Remove duplicate companies.
      const companyIds = [];
      game.involved_companies = game.involved_companies.filter(
        ({ company: { id } }) => {
          if (companyIds.includes(id)) {
            return false;
          }
          companyIds.push(id);
          return true;
        }
      );

      // Remove uninteresting platforms.
      // game.platforms = game.platforms.filter(({ id }) =>
      //   selectedPlatformIds.includes(id)
      // );

      // Desambiguate homonimous.
      // if (
      //   Object.values(games).some(
      //     ({ name, id }) => name === game.name && id !== game.id
      //   )
      // ) {
      //   const release = new Date(game.first_release_date * 1000);
      //   game.originalName = game.name;
      //   game.name = `${game.name} (${release.getFullYear()})`;
      // }

      // Map release timestamp to year.
      const releaseDate = new Date(game.first_release_date * 1000);
      game.releaseYear = releaseDate.getFullYear();
      delete game.first_release_date;

      games[game.id] = mapToCamelCaseKeys(game);
    }
  }

  return { games, count };
}

const data = await getGames();
await fs.writeFile(
  "./src/database.json",
  JSON.stringify(data, null, 2),
  "utf-8"
);

console.log(`${data.count} games imported`);
