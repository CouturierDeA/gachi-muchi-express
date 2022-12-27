export const validations = {
    required: (value: any) => {
        return !!value
    },
    min: (min: number) => (value: any) => {
        return value ? value.length >= min : true;
    },
    max: (max: number) => (value: any) => {
        return value ? value.length <= max : true;
    },
}

export interface ValidationFn {
    (value: any): boolean
}

type Rule = {
    validator: ValidationFn,
    message: string
}

type ErrorState<T> = {
    [key in keyof T]: string | undefined
}


export class CommonValidator<T> {
    constructor(
        protected rules: {
            [key in keyof T]: Rule[]
        },
        protected errState: ErrorState<T> = {} as ErrorState<T>
    ) {

    }

    private disabledKeys = [] as Array<keyof T>

    hasError = (key: keyof T): boolean => {
        return !!(this.errState as { [key in keyof T]: string })[key]
    }

    toggleValidation = (name: keyof T, state: boolean) => {
        if (state) {
            this.disabledKeys = this.disabledKeys.filter(key => key !== name)
        } else {
            if (!this.disabledKeys.includes(name)) {
                this.disabledKeys.push(name);
            }
        }
        this.afterToggle(name, state);
    }

    protected afterToggle(name: keyof T, state: boolean) {

    }

    private hasErrors = (keys?: Array<keyof T>): boolean => {
        return (Object.keys(this.errState) as Array<keyof T>)
            .filter(key => keys ? keys.includes(key) : true)
            .some(key => !!this.errState[key])
    }

    validate = (name: keyof T, valueArg: T[keyof T]) => {
        const value = valueArg;
        const validationDisabled = this.disabledKeys.includes(name)
        let ruleList = validationDisabled ? [] : this.rules[name];

        const errors = (ruleList || []).map(rule => {
            const valid = rule.validator(value)
            return !valid && rule.message;
        }).filter(v => !!v);

        const first = errors[0] || undefined;
        this.errState[name] = first;

        return first;
    }

    private getKeys = (obj: T) => {
        return Object.keys(obj) as Array<keyof T>
    }

    validateAll = (obj: T) => {
        return this.getKeys(obj)
            .map((key) => this.validate(key, obj[key]))
            .filter(Boolean)
    }
}

export class Validator<T> extends CommonValidator<T> {
    constructor(
        protected rules: {
            [key in keyof T]: Rule[]
        },
        protected obj: T,
        errState: ErrorState<T> = {} as ErrorState<T>
    ) {
        super(
            rules,
        );
    }

    validate = (name: keyof T) => {
        return super.validate(name, this.obj[name])
    }

    validateAll = () => {
        return super.validateAll(this.obj)
    }
}
