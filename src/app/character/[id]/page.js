import axios from 'axios';

export async function generateMetadata({params}) {
    const {id} = await params

    try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
        const character = response.data;

        return {
            title: character.name,
            description: `opis postaci: ${character.name}`
        }
    } catch (e) {
        return {title: "Brak danych o tej postaci"};
    }
}

export default async function Page({params}) {
    const {id} = await params
    let character = '';
    let error = '';

    try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
        character = response.data;
    } catch (e) {
        console.error(e.message);
        error = "Brak danych o tej postaci.";
    }

    return (
        <div>
            {error && <p>{error}</p>}
            {character.name && <p>Nazwa: {character.name}</p>}
            {character.status && <p>Status: {character.status}</p>}
            {character.species && <p>Gatunek: {character.species}</p>}
            {character.image && <img src={character.image} alt={character.name}></img>}
        </div>
    );
}