import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

import './Main.css';

import api from '../services/api';

import logo from '../assets/images/logo.svg';
import like from '../assets/images/like.svg';
import dislike from '../assets/images/dislike.svg';
import itsmatch from '../assets/images/itsamatch.png';

export default function Main({ match }) {

    const [ users, setUsers ] = useState([]); 
    const [ matchDev, setMatchDev ] = useState(null);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id,
                }
            })

            setUsers(response.data);
        }

        loadUsers();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        });

    }, [match.params.id]);

    async function handleLike(id) {
        await api.post(`/devs/${id}/likes/`, null, {
            headers: {
                user: match.params.id,
            }
        })

        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDeslike(id) {
        await api.post(`/devs/${id}/deslikes/`, null, {
            headers: {
                user: match.params.id,
            }
        })

        setUsers(users.filter(user => user._id !== id));
    }

    function shuffle(array) {
        let i = array.length - 1;
        for (; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
        
           { users.length > 0 ? (
                <ul>
                { shuffle(users).map(user => (

                    <li key={user._id}>
                        <img className="imgCard" src={user.avatar} alt={user.name} />
                        <footer>
                            <strong>{user.name}</strong>
                            <p>{user.bio}</p>
                        </footer>

                        <div className="buttons">
                            <button type="button" onClick={() => handleDeslike(user._id)}>
                                <img src={dislike} alt="Dislike" />
                            </button>
                            <button type="button" onClick={() => handleLike(user._id)}>
                                <img src={like} alt="Like" />
                            </button>
                        </div>
                    </li>

                )) }             
                </ul>
           ) : (
                <div className="empty">Acabou :(</div>   
           )}

           { matchDev && (
               <div className="match-container">
                   <img className="itsmatch" src={itsmatch} alt="" />
                   <img className="avatar" src={matchDev.avatar} alt="" />
                   <strong>{matchDev.name}</strong>
                   <p>{matchDev.bio}</p>

                   <button type="button" onClick={() => setMatchDev(null)}>Fechar</button>
               </div>
           ) }
        </div>
    )

}