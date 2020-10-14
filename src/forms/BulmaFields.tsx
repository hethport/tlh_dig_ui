import {ErrorMessage, Field} from "formik";
import classnames from "classnames";
import React from "react";

interface BaseInputProps {
    id: string;
    errors: string | undefined;
    touched: boolean | undefined;
}

// Input

interface InputProps extends BaseInputProps {
    type?: string;
    initialValue?: string | number | null;
    label: string;
    autoFocus?: boolean;
}

export function BulmaFieldWithLabel({id, type, initialValue, label, errors, touched, autoFocus}: InputProps): JSX.Element {
    const classes = classnames("input", {
        'is-success': touched && !errors,
        'is-danger': touched && errors
    });

    return (
        <div className="field">
            <label htmlFor="password" className="label">{label}:</label>
            <div className="control">
                <Field type={type || 'text'} id={id} name={id} value={initialValue || undefined}
                       placeholder={label} autoFocus={!!autoFocus} className={classes}/>
                <ErrorMessage name={id}>{msg => <p className="help is-danger">{msg}</p>}</ErrorMessage>
            </div>
        </div>
    );
}

// Select

export interface SelectOption {
    value: string;
    description: string;
}

interface SelectProps extends BaseInputProps {
    initialValue?: string;
    isFullwidth?: boolean;
    options: SelectOption[];
}

export function BulmaSelect({id, isFullwidth, options, errors, touched}: SelectProps): JSX.Element {

    const classes = classnames('select', {
        'is-fullwidth': isFullwidth,
        'is-success': touched && !errors,
        'is-danger': touched && errors
    });

    return (
        <div className={classes}>
            <Field as="select" id={id} name={id}>
                {options.map((opt) =>
                    <option key={opt.value.toString()} value={opt.value.toString()}>{opt.description}</option>
                )}
            </Field>
        </div>
    );
}
