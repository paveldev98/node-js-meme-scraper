import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// Define the directory path
const memesFolder = path.join(process.cwd(), 'memes');

// If the folder doesn't exist, create it
if (!fs.existsSync(memesFolder)) {
  fs.mkdirSync(memesFolder);
  console.log('Folder "memes" was created successfully.');
} else {
  console.log('Folder "memes" already exists.');
}

// Save the url of the page in a const
const url = 'https://memegen-link-examples-upleveled.netlify.app/';

// Async function for fetching the data
async function getMemes() {
  try {
    // Fetch the HTML content
    const response = await axios.get(url);
    // Save the html into a variable
    const html = response.data;
    // Load html into cheerio library so I can extract the src
    const $ = cheerio.load(html);
    // Extract img src attributes from each img and put them into an array
    const imgUrls = [];
    $('img').each((index, element) => {
      const src = $(element).attr('src');
      if (src) {
        imgUrls.push(src);
      }
    });

    // Limit the first 10 URLs
    const firstTenUrls = imgUrls.slice(0, 10);
    // Save each URL into its own variable imgUrl
    for (let i = 0; i < firstTenUrls.length; i++) {
      const imgUrl = firstTenUrls[i];
      // Download the image from each URL and save the response in imgResponse variable
      const imgResponse = await axios({
        url: imgUrl,
        method: 'GET',
        responseType: 'arraybuffer',
      });

      // Create file name with a leading zero
      const fileName = `${String(i + 1).padStart(2, '0')}.jpg`;
      // Save the image with file name of fileName to the memes folder
      const filePath = path.join(memesFolder, fileName);
      // Save the image response data to the filePath
      // Use writeFileSync method so that the execution is blocked until the file is written
      fs.writeFileSync(filePath, imgResponse.data);
    }
  } catch (error) {
    console.error('Error fetching the website:', error);
  }
}

getMemes();
