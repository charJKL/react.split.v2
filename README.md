# react.split

Application allow you extract text from images (OCR). Uses https://github.com/naptha/tesseract.js.

## Test it online
You test it online [https://react-split-epub.netlify.app/](https://react-split-epub.netlify.app/) 

## Knowed bugs:
- `useResolveObjectBeingHovered` doesn't work as expected, allows select line even outside dekstop 
- function `areFilesEqual` in `store/thunk.loadFiles.tx` is not accurate enougth. There should be comparsion of content hash.
- preserve image resource in entire program session, not only for project. It's annoying to load images every time after project changes.
- there is bug with working tesseract, during project change.
- statuses in `store/slice.metrics` are wrong, details: `x2<x1` and `y2<y1` will be never reached. It's due to the fact that former check always will be true.

## Available Scripts
In the project directory, you can run:
### `npm start`
