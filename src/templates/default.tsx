import GSX from '../framework/gsx';
type HtmlPageProps = {
    title: string,
    lang?: string,
    charset?: string,
}
export function HtmlPage(
    props: HtmlPageProps,
    content: typeof GSX,
) {
    const { title, lang, charset } = props || {}
    return <html lang={lang || 'en'}>
    <head>
        <meta charset={charset || 'utf-8'}/>
        <title>{title}</title>
    </head>
    <body>{content}</body>
    </html>
}

export function ErrorPage(
    props: HtmlPageProps,
    content: typeof GSX,
) {
    return <HtmlPage {...props}>
        {content}
    </HtmlPage>
}

