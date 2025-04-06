import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './client/App'; 

export function render() {
  const appHtml = ReactDOMServer.renderToString(<App />);
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Sentomment</title>
        <script type="module" src="/src/main.js"></script>
      </head>
      <body>
        <div id="root">${appHtml}</div>
      </body>
    </html>
  `;
  return html;
}