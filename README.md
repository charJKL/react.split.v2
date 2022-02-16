# React split.epub


## Bugs
- `useResolveObjectBeingHovered` doesn't work as expected, allows select line even outside dekstop 
- function `areFilesEqual` in `store/thunk.loadFiles.tx` is not accurate enougth. There should be comparsion of content hash.
- preserve image resource in entire program session, not only for project. It's annoying to load images every time after project changes.
- there is bug with working tesseract, during project change.

## Available Scripts
In the project directory, you can run:
### `npm start`
