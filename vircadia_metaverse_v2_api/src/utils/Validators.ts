import { SArray } from './vTypes';
import { isValidArray } from './Utils';
import { IsNotNullOrEmpty, IsNullOrEmpty } from './Misc';
import Joi from '@hapi/joi';
export async function sArraySetter(
    pField: any,
    pEntity: any,
    pVal: any,
    updates: any
): Promise<void> {
    let val: string[] = (pEntity as any)[pField] ?? [];

    if (typeof val === 'string') {
        val = [val];
    }

    if (typeof pVal === 'string') {
        SArray.add(val, pVal);
    } else {
        if (isValidArray(pVal)) {
            val = pVal;
        } else {
            if (
                typeof pVal === 'object' &&
                (pVal.set || pVal.add || pVal.remove)
            ) {
                if (pVal.set) {
                    val = typeof pVal.set === 'string' ? [pVal.set] : pVal.set;
                }
                if (pVal.add) {
                    if (Array.isArray(pVal.add)) {
                        for (const aVal of pVal.add) {
                            SArray.add(val, aVal);
                        }
                    } else {
                        SArray.add(val, pVal.add);
                    }
                }
                if (pVal.remove) {
                    if (Array.isArray(pVal.remove)) {
                        for (const aVal of pVal.remove) {
                            SArray.remove(val, aVal);
                        }
                    } else {
                        SArray.remove(val, pVal.remove);
                    }
                }
            } else {
                console.log('value is not string');
            }
        }
    }
    updates[pField] = val;
}

export async function simpleSetter(
    fieldName: any,
    pEntity: any,
    pVal: any,
    updates: any
): Promise<void> {
    updates[fieldName] = pVal;
}

export async function noOverwriteSetter(
    pField: any,
    pEntity: any,
    pVal: any,
    updates: any
): Promise<void> {
    // Don't overwrite a value with a null or empty value.
    if (IsNotNullOrEmpty(pVal)) {
        if (Array.isArray(pVal)) {
            if (pVal.length > 0) {
                simpleSetter(pField, pEntity, pVal, updates);
            }
        } else {
            simpleSetter(pField, pEntity, pVal, updates);
        }
    }
}
export async function isBooleanValidator(value: any): Promise<any> {
    let validity: boolean;

    const schema = Joi.boolean();
    const { error } = schema.validate(value);

    if (error) {
        validity = false;
        throw new Error(error.message);
    } else {
        validity = true;
    }
    return validity;
}

export async function isSArraySet(pValue: any): Promise<any> {
    if (isValidSArraySet(pValue)) {
        return true;
    } else {
        throw new Error('field value must be an array of strings');
    }
}

export async function isNumberValidator(value: any): Promise<any> {
    let validity: boolean;

    const schema = Joi.number().integer().positive();
    const { error } = schema.validate(value);

    if (error) {
        validity = false;
        throw new Error(error.message);
    } else {
        validity = true;
    }
    return validity;
}

export async function isPathValidator(value: any): Promise<any> {
    let validity: boolean;

    const schema = Joi.string()
        .trim()
        .regex(
            /^\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?$/
        );
    const { error } = schema.validate(value);

    if (error) {
        validity = false;
        throw new Error(error.message);
    } else {
        validity = true;
    }
    return validity;
}

export async function simpleGetter(value: any, field: any): Promise<any> {
    if (value && value.hasOwnProperty(field)) {
        return value[field];
    }
    return undefined;
}
export type ValidCheckFunction = (pVal: string) => Promise<boolean>;

export async function verifyAllSArraySetValues(
    pValue: any,
    pCheckFunction: ValidCheckFunction
): Promise<boolean> {
    let retValue = false;
    if (IsNotNullOrEmpty(pCheckFunction) && isValidSArraySet(pValue)) {
        retValue = true;

        for (const aVal of walkSArraySetter(pValue)) {
            if (!(await pCheckFunction(aVal))) {
                retValue = false;
                break;
            }
        }
    }
    return retValue;
}

export function isValidSArraySet(pValue: any): boolean {
    let ret = false;
    if (typeof pValue === 'string') {
        ret = true;
    } else {
        if (isValidSArray(pValue)) {
            ret = true;
        } else {
            if (pValue && (pValue.set || pValue.add || pValue.remove)) {
                let eachIsOk = true;
                if (eachIsOk && pValue.set) {
                    eachIsOk =
                        typeof pValue.set === 'string' ||
                        isValidSArray(pValue.set);
                }
                if (eachIsOk && pValue.add) {
                    eachIsOk =
                        typeof pValue.add === 'string' ||
                        isValidSArray(pValue.add);
                }
                if (eachIsOk && pValue.remove) {
                    eachIsOk =
                        typeof pValue.remove === 'string' ||
                        isValidSArray(pValue.remove);
                }
                ret = eachIsOk;
            }
        }
    }
    return ret;
}

export function* walkSArraySetter(pValue: any): Generator<string> {
    if (IsNotNullOrEmpty(pValue)) {
        if (typeof pValue === 'string') {
            yield pValue as string;
        } else {
            if (Array.isArray(pValue)) {
                for (const aVal of pValue) {
                    yield aVal;
                }
            } else {
                for (const manipulationSection of ['set', 'add', 'remove']) {
                    if (pValue.hasOwnProperty(manipulationSection)) {
                        const sectionVal = pValue[manipulationSection];
                        if (Array.isArray(sectionVal)) {
                            for (const aVal of sectionVal) {
                                yield aVal;
                            }
                        } else {
                            yield sectionVal;
                        }
                    }
                }
            }
        }
    }
}

export function isValidSArray(pValue: any): boolean {
    let ret = false;
    if (pValue) {
        if (Array.isArray(pValue)) {
            let allStrings = true;
            for (const val of pValue) {
                if (typeof val !== 'string') {
                    allStrings = false;
                    break;
                }
            }
            ret = allStrings;
        }
    }

    return ret;
}

export async function isStringValidator(value: any): Promise<any> {
    let validity: boolean;

    const schema = Joi.string().trim();
    const { error } = schema.validate(value);

    if (error) {
        validity = false;
        throw new Error(error.message);
    } else {
        validity = true;
    }
    return validity;
}

export async function isDateValidator(value: any): Promise<any> {
    let validity: boolean;
    if (value instanceof Date) {
        validity = true;
    } else {
        validity = false;
    }
    return validity;
}
