export const queryParseTestCases = [
    {
        it: 'ParsesQueryWell',
        input: "/users/1/pictures/3?test=1,2,3&test=4,5,6,&test=7&test2=AAA",
        output: {
            test: ['1', '2', '3', '4', '5', '6', '7'],
            test2: ['AAA']
        }
    },
    {
        it: 'ParsesQueryWell',
        input: "?test=1,2,3&test=4,5,6,&test=7&test2=AAA",
        output: {
            test: ['1', '2', '3', '4', '5', '6', '7'],
            test2: ['AAA']
        }
    },
    {
        it: 'ParsesQueryWell',
        input: "?test=testStr&test=testStr",
        output: {
            test: ['testStr', 'testStr'],
        }
    },
    {
        it: 'ParsesQueryWell',
        input: "?test=testStr",
        output: {
            test: ['testStr'],
        }
    },
    {
        it: 'ParsesQueryWell',
        input: "?fq=fqv&sq=sqv",
        output: {
            fq: ['fqv'],
            sq: ['sqv'],
        }
    },
    {
        it: 'ParsesQueryWell',
        input: "test=1,2,3&test=4,5,6,&test=7&test2=AAA",
        output: {}
    }
]