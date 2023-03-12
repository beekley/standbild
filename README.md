# Standbild

Standbild is an open-source tool for making [story-driven mystery games](https://store.steampowered.com/app/1677770/The_Case_of_the_Golden_Idol/).

## Installation

1. Install [Node](https://nodejs.org/en/).
1. Clone the repository.
    ```
    git clone https://github.com/beekley/standbild.git
    cd standbild
    ```
1. Install the dependencies.
    ```
    npm install
    ```
1. Build and run the dev server.
    ```
    npm run dev
    ```
1. Open the URL provided by the dev server.

## Developer's Guide

The project is split into two main components: The data that make up chapters and scenes,
and the that generates the game from that data.

### Creating chapters and scenes

Chapters represent a single, complete story and consist of one or more scenes. Scenes are
each a single view into a part of a chapter, consisting of an image and a set of clickable
areas in an [imagemap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map).
They have the following folder structure:

```
└─public
  └─scenes
    ├─chapter1
    │ ├─story.txt -- The story for the entire shapter.
    │ ├─scene1.jpeg -- The image for one scene in the chapter.
    │ ├─scene1.html -- The HTML imagemap for one scene in the chapter.
    │ └─...
    └─...
```

To create a new chapter:

1. Create a folder within `public/scenes` with the name of the chapter.
1. Create a `story.txt` within this folder.
    1. Write a brief story in this file.
    1. Wrap key words in curly braces to mark them as `answers` in the game, which the
       player must find and fill in (e.g. `the {king} opened the {door}`).
1. For each scene in the chapter:
    1. Add an image, named `${scene name}.jpeg`.
    1. Create an imagemap using a tool like image-map.net and paste the `<map>` element
       into `${scene name}.jpeg`.
1. Run the dev server and you should see your scenes at
   `http://${hostname}/scene/${chaptername}/${scenename}`

## Deploying changes

To deploy changes to the default domain, run:

```
npm run build
npm run deploy
```

To deploy chanes to another domain, you must set up github pages to point to that domain
and update the `deploy` command to use that domain.
