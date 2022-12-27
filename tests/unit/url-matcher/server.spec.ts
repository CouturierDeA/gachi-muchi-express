import {
    parseQuery,
    parseParamsCurly,
    routeMatcherFnCurly,
} from '../../../src/framework/core/route-matcher';
import {queryParseTestCases} from './query-parse-test-cases'
import {paramsParseTestCases} from './qrly-bracketsparams-parse-test-cases'
import {routeMatcherTest} from './test-cases-curly'

describe('test params matcher ', () => {
    paramsParseTestCases.forEach(test => {
        it(test.it, () => {
            const res = parseParamsCurly(test.path, test.input)
            expect(res).toEqual(test.output)
        })
    })
})

describe('Query tests ', () => {
    queryParseTestCases.forEach(test => {
        it(test.it, () => {
            const res = parseQuery(test.input)
            expect(res).toEqual(test.output)
        })
    })
})


describe('Route matcher ', () => {
    routeMatcherTest.forEach(test => {
        it(test.it, () => {
            const res = routeMatcherFnCurly(test.path, test.input)
            expect(res).toEqual(test.output)
        })
    })
})
