import { fakerDE as faker } from '@faker-js/faker';
import { env,exit } from 'process';
import { URL } from 'url';

const authors = [1,2,3,4,5,6,7,8,9,10];
const genres = [1,2,3];
const instruments = [1,2,3,4];

const randomSubset = (arr, maxItems = undefined) => arr.map((a) => [a, Math.random()])
  .sort((a,b) => a[1] < b[1] ? -1 : 1)
  .slice(0, Math.max(0, Math.round(Math.random() * Math.max(maxItems || arr.length))))
  .map(a => a[0]);

const token = env.TOKEN;
if (!token) {
  // eslint-disable-next-line no-console
  console.error('Failed to read TOKEN environment variable. Stopping.');
  exit(1);
}

const baseUrlStr = env.BASE_URL;
if (!baseUrlStr) {
  // eslint-disable-next-line no-console
  console.error('Failed to read BASE_URL environment variable. Stopping.');
  exit(1);
}
const baseUrl = new URL(baseUrlStr);

const generateSong = () => ({
  title: faker.music.songName(),
  text: faker.lorem.paragraph({ min: 5, max: 10 }),
  pdf: null,
  audio: null,
  preview_image: null,
  authors: randomSubset(authors, 3).map((id) => ({authors_id: { id }})),
  genres: randomSubset(genres, 2).map((id) => ({genres_id: { id }})),
  instruments: randomSubset(instruments).map((id) => ({instruments_id: { id }})),
});

for (let i = 0; i < 100; i++) {
  const song = generateSong();
  baseUrl.pathname = 'items/songs/';
  await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify(song),
    headers: {
      'Authorization': `bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    return response.json();
  }).then((content) => {
    if (content.errors) {
      // eslint-disable-next-line no-console
      console.error(content);
      return;
    }
    // eslint-disable-next-line no-console
    console.log(`Added song named "${song.title}".`, JSON.stringify(song));
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('error', error);
  });
}
