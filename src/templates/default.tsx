import GACHI_SX from '../framework/gachi-sx';
type HtmlPageProps = {
    title?: string,
    lang?: string,
    charset?: string,
}
export function HtmlPage(
    props: HtmlPageProps,
    content: typeof GACHI_SX,
) {
    const { title, lang, charset } = props || {}
    return <html lang={lang || 'en'}>
    <head>
        <meta charset={charset || 'utf-8'}/>
        {title && <title>{title}</title>}
    </head>
    <body>{content}</body>
    </html>
}

