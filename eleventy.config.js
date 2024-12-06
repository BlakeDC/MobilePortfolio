const fs = require('fs');
const path = require('path');
const sass = require('sass');
require('dotenv').config(); // Load .env variables

module.exports = (eleventyConfig) => {

    // Add Contentful variables as global data
    eleventyConfig.addGlobalData("contentful", {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
    });

    // Add data to the collection from your JSON file
    eleventyConfig.addCollection("animals", function(collectionApi) {
        return collectionApi.getAll().filter(item => item.inputPath && item.inputPath.endsWith('.json'));
    });

    // Copy CSS and images to the dist folder
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/img");

    // Watch for changes in the css folder
    eleventyConfig.addWatchTarget("./src/css/");
    eleventyConfig.addExtension("scss", {
        read: false,
        outputFileExtension: "css",
        compile: async (inputContent) => {
            const result = sass.renderSync({ data: inputContent });
            return result.css.toString();
        }
    });

    // Listen for before build event to clear the dist folder
    eleventyConfig.on('eleventy.before', () => {
        const distPath = path.join(__dirname, 'dist');
        fs.rmSync(distPath, { recursive: true, force: true });
    });

    return {
        dir: {
            input: "src",
            output: "_site",
        },
    };
};
