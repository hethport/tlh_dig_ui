import {ErrorMessage, Field, FieldProps} from "formik";
import classNames from "classnames";
import React from "react";

interface CustomFieldProps extends FieldProps {
    label: string;
    id: string;
    asTextArea?: boolean;
}

export function BulmaField({label, id, asTextArea, field, ...props}: CustomFieldProps): JSX.Element {
    const classes = classNames(
        asTextArea ? 'textarea' : 'input',
        {
            'is-success': props.form.touched[field.name] && !props.form.errors[field.name],
            'is-danger': props.form.touched[field.name] && !!props.form.errors[field.name],
        });

    return (
        <div className="field">
            <label htmlFor="id" className="label">{label}:</label>
            <div className="control">
                {asTextArea

                    ? <Field as="textarea" {...props} {...field} id={id} className={classes} placeholder={label}/>
                    : <Field  {...props} {...field} id={id} className={classes} placeholder={label}/>
                }
            </div>
            <ErrorMessage name={field.name}>{msg => <p className="help is-danger">{msg}</p>}</ErrorMessage>
        </div>
    );
}