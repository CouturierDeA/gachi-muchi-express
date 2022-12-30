function createElement(name: string | Function, props: { [id: string]: string | Function }, ...content: string[]) {
    props = props || {};
    const propsstr = Object.keys(props)
        .map(key => {
            const value = props[key];
            if (typeof value === 'function') return `${key}="(${value.toString()})()"`
            if (key === "className") return `class=${value}`;
            else return `${key}=${value}`;
        })
        .join(' ');
    const attrs = propsstr.length ? ` ${propsstr}` : '';
    const joinedContent = content
        .flat()
        .filter(Boolean)
        .join('');
    if (!name) return joinedContent
    if (name instanceof Function) return name(props, ...content);
    return `<${name}${attrs}>${joinedContent}</${name}>`;
}

export const GSX = {
    createElement
};

export default GSX;
