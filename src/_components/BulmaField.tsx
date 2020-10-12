import {Field} from "formik";
import classnames from "classnames";
import React from "react";

interface Props {
    id: string;
    type?: string;
    initialValue?: string | null;
    label: string;
    errors: string | undefined;
    touched: boolean | undefined;
}

export function BulmaField({id, type, initialValue, label, errors, touched}: Props) {
    return <div className="field">
        <label htmlFor="password" className="label">{label}:</label>
        <div className="control">
            <Field
                type={type ? type : 'text'}
                id={id}
                name={id}
                value={initialValue || undefined}
                placeholder={label}
                className={
                    classnames("input", {
                        'is-success': touched && !errors,
                        'is-danger': touched && errors
                    })
                }
            />
            {errors && <p className="help is-danger">{errors}</p>}
        </div>
    </div>;
}
