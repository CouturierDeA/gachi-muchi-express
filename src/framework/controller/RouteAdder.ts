import {defineRouteMeta} from "../utils/metadata";

export interface AddRouteOptions {
    url: string | RegExp
    method: string
}

export class RouteAdder {
    constructor(private options: AddRouteOptions) {
    }

    add(target: any, propertyKey: string) {
        const {url, method} = this.options;
        let routeUrl = url
        if (typeof routeUrl === 'string' && routeUrl.startsWith('/')) {
            routeUrl = routeUrl.substring(1)
        }
        target._$router = target._$router || []
        target._$router.push({
            url: routeUrl,
            method: method,
            executor: propertyKey,
        })
        defineRouteMeta(target.constructor, target._$router)
    }
}
