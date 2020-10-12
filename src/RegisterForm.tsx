import React from 'react';

export function RegisterForm() {
    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">Registrieren</h1>

            <form>
                <div className="field">
                    <label htmlFor="username" className="label">Nutzername:</label>
                    <div className="control">
                        <input type="text" className="input" required={true}/>
                    </div>
                </div>
            </form>
        </div>
    )
}
