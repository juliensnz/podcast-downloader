import axios from 'axios';
import xml2js from 'xml2js';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const rssFeedUrl = 'https://radiofrance-podcast.net/podcast09/rss_19721.xml';

async function downloadPodcastEpisodes() {
    try {
        // Fetch the RSS feed
        const response = await axios.get(rssFeedUrl);
        const rssData = response.data;

        // Parse the RSS feed
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(rssData);

        // Get the list of episodes
        const episodes = result.rss.channel[0].item;

        for (const episode of episodes) {
            // Get the episode title and enclosure URL
            const title = episode.title[0];
            const enclosure = episode.enclosure[0].$.url;
            const filename = path.basename(enclosure);

            // Download the episode
            const res = await fetch(enclosure);
            const dest = fs.createWriteStream(`episodes/${title.replaceAll('"', '')}.mp3`);

            res.body.pipe(dest);
            console.log(`Downloading: ${title}`);
        }

        console.log('All episodes downloaded.');
    } catch (error) {
        console.error('Error downloading podcast episodes:', error);
    }
}

downloadPodcastEpisodes();
