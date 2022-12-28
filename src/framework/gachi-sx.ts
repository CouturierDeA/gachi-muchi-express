function createElement(name: string | Function, props: { [id: string]: string | Function }, ...content: (string)[]) {
    props = props || {};
    const propsstr = Object.keys(props)
        .map(key => {
            const value = props[key];
            if (typeof value === 'function') return `${key}="(${value.toString()})()"`
            if (key === "className") return `class=${value}`;
            else return `${key}=${value}`;
        })
        .join(' ');
    const joinedContent = content.filter(Boolean).join("");
    if (!name) return `${joinedContent}`
    if (name instanceof Function) return name(props, ...content);
    return `<${name} ${propsstr}>${joinedContent}</${name}>`;
}

export default {
    createElement,
};
