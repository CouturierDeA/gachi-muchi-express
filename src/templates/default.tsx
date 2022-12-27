import GACHI_SX from '../framework/gachi-sx';

export function defaultTemplate(body: typeof GACHI_SX) {
    return <html lang="ru">
    <head>
        <meta charset="utf-8"/>
    </head>
    <body>{body}</body>
    </html>
}
