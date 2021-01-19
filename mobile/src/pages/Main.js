import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsmatch from '../assets/itsamatch.png';

export default function Main({ navigation }) {

    const id = navigation.getParam('user');
    const [ users, setUsers ] = useState([]); 
    const [ matchDev, setMatchDev ] = useState(null);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id,
                }
            })

            setUsers(response.data);
        }

        loadUsers();
    }, [id]);

    useEffect(() => {
        const socket = io('http://10.0.2.2:3333', {
            query: { user: id }
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        });

    }, [id]);

    async function handleLike() {
        const [user, ...rest] = users;
        await api.post(`/devs/${user._id}/likes/`, null, {
            headers: {
                user: id,
            }
        })

        setUsers(rest);
    }

    async function handleDeslike() {
        const [user, ...rest] = users;
        await api.post(`/devs/${user._id}/deslikes/`, null, {
            headers: {
                user: id,
            }
        })

        setUsers(rest);
    }

    async function handleLogout() {
        await AsyncStorage.clear();
        navigation.navigate('Login');
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
        <SafeAreaView style={styles.container}
        >
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>

            <View style={styles.cards}>
                { users.length > 0 ? (
                    shuffle(users).map((user, index) => (
                        <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                            <Image style={styles.avatar} source={{ uri: user.avatar}}/>
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))
                ) : (<Text style={styles.empty}>Acabou :(</Text>) }                
            </View>

            { users.length > 0 && (
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={handleDeslike} style={styles.button}>
                        <Image source={dislike} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLike} style={styles.button}>
                        <Image source={like} />
                    </TouchableOpacity>
                </View>
            )}

            { matchDev && (
               <View style={[styles.matchContainer, { zIndex: 9999999 }]}>
                   <Image style={styles.itsmatchImage} source={itsmatch} />
                   <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar}} />
                   <Text style={styles.nameMatch}>{matchDev.name}</Text>
                   <Text style={styles.bioMatch}>{matchDev.bio}</Text>

                   <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.fecharMatch}>Fechar</Text>
                   </TouchableOpacity>
               </View>
           ) }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30,
    },
    logo: {
        marginTop: 30,
    },
    
    cards: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        margin: 10,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    avatar: {
        flex: 1,
        height: 300,
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18,
    },

    buttons: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    itsmatchImage: {
        height: 60,
        resizeMode: 'contain',
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },

    nameMatch: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },

    bioMatch: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(0,0,0,0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
    }, 

    fecharMatch: {
        color: 'rgba(0,0,0,0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold',
        fontSize: 16,
    },

    itsmatchImage: {
        height: 60,
        resizeMode: 'contain',
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },

    nameMatch: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },

    bioMatch: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
    }, 

    fecharMatch: {
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase',
    },
});