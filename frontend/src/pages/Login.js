import React, { useState } from 'react';
import './Login.css';

import api from '../services/api'

import logo from '../assets/images/logo.svg';


export default function Login({ history }){
    const [ username, setUsername ] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await api.post('/devs', {
            username,
        });

        const { _id } = response.data;

        console.log(response);

        history.push(`/dev/${_id}`);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
            <img src={logo} alt="Tindev" />
                <input 
                    placeholder="Digite seu usúario" 
                    value={username}
                    onChange={e => setUsername(e.target.value)} />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}
