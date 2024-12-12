# Blakes Project

Hello this is my project!

To run this website you must first follow a few short steps. 

# Commands
1. Open the terminal and run 'npm install' to generate node_modules.
2. Run 'npm build' or 'npx @11ty/eleventy' to build the project.
3. Run 'npm dev' or 'npx @11ty/eleventy --serve' to serve the site and begin hosting locally.
4. View the site at hhtp://localhost:8080/

# Only if necessary
1. Run 'npm init' to create a package.json file.
2. Run 'npm install @11ty/eleventy' to install eleventy.
3. Run 'npm install sass'
4. Run 'npm install dotenv'
5. Run 'npm install --save @sendgrid/mail'

# IMPORTANT DISCLAIMER
This site is intended to be ran on Netlify and environment variables are stored there. Attempting to run this site locally will limit functionality.

## Overview

This project is a web application built using the static site generator Eleventy. The project features a homepage, about, terms of service, web development research and more. The application utilizes pagination for browsing through animal data in animal.md and showcases images, descriptions, and other relevant information.

## Features

- **Homepage**: Welcome message and information about the project.

- **Blog**: Blog page powered with Contentful CMS. Features personal interests and research content. Filters by date.

- **Web Development Research / Lab 1**: Find vast information on templating engines, SSG applications, front matter and more!

- **Web Development Research / Lab 2**: Find vast information on 5 popular Headless CMS options!

- **CMS with Filtering**: Browse through a list of apples with details such as name, taste, colour and an accompanying image. Filter table based on apple colour.

## Technologies Used

- **Eleventy (11ty)**: Static site generator.
- **HTML/CSS**: For structure and styling of the website.
- **Liquid**: Templating language used in Eleventy for dynamic rendering.
- **Contentful**: CMS to store and retrieve data.


# Important Links

Eleventy documentation: https://www.11ty.dev/docs/

# Data

https://www.11ty.dev/docs/data-global/

All data is stored in the Contentful CMS and can be fetched with an API request like the following:

const response = await fetch(`https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=apple`);
        const data = await response.json();


NA - The contents of the file _data/animal.json is available to the templates using the pagination keyword 'animals'.

# Pagination - Currently NA

https://www.11ty.dev/docs/pages-from-data/

In order to seperate our animals into 3 per page, we use the following template at animal.md

    pagination:
      data: animals
      size: 3
      alias: animal

# Collections - Currently NA

https://www.11ty.dev/docs/collections/

The following pagination configuration was set up in eleventy.config to add all json data to a collection

     // Add data to the collection from your JSON file
     eleventyConfig.addCollection("animals", function(collectionApi) {
        return collectionApi.getAll().filter(item => item.inputPath && item.inputPath.endsWith('.json'));
    });

    This allows the program to access each animals data in the animal.json

    {% for animal in animal %}

# Layouts

https://www.11ty.dev/docs/layouts/

/layouts/base.liquid is used to create a template for each page. THis base layout includes a header and footer located under _includes/_partials. To incorperate a layout into a page the following front matter is used:

layout: layouts/base.liquid


# Ignore

https://www.11ty.dev/docs/ignores/

To ignore any files that should not be processed use the .eleventyignore file and list the files to ignore


# Maintaining Project

1. You can update apple, blog, or page data on the Contentful website. Add or modify apple entries as needed. Contentful is utilized inside apple.md

2. To create new pages, add new Markdown files in the src directory and set the front matter for title and layout. Content can be stored and fetched from the Contentful CMS.

3. Update the CSS files located in the src/css directory to modify the look and feel of the website.

4. Site hosted on netlify through GitHub. Serverless functions and environment variables are managed by netlify. Modify /netlify/functions to add serverless functions. 

5. This site is utilizing SendGrid to send emails in contact.md.