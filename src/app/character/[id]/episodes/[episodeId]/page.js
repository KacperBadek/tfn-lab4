import axios from 'axios';

export async function generateMetadata({params}) {
    const {id, episodeId} = await params;
    try {
        const characterResponse = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
        const character = characterResponse.data;

        const episodeIds = character.episode.map(ep => ep.substring(ep.lastIndexOf('/') + 1));

        if (!episodeIds.includes(episodeId)) {
            {
                return {title: "Postać nie występuje w tym odcinku"};
            }
        }

        const episodeResponse = await axios.get(`https://rickandmortyapi.com/api/episode/${episodeId}`);
        const episode = episodeResponse.data;

        return {
            title: episode.name,
            description: `Odcinek: ${episode.name}, Data emisji: ${episode.air_date}`
        };
    } catch (error) {
        return {title: "Brak danych o tym odcinku"};
    }


}

export default async function Page({params}) {
    const {id, episodeId} = await params;
    let episode = ''
    let error = ''

    const fetchEpisode = async () => {
        try {
            const response = await axios.get(`https://rickandmortyapi.com/api/episode/${episodeId}`);
            return response.data
        } catch (e) {
            error = "Brak danych o tym odcinku.";
        }
    }

    try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
        const episodeIds = response.data.episode.map((ep) => ep.substring(ep.lastIndexOf('/') + 1));

        if (episodeIds.includes(episodeId)) {
            episode = await fetchEpisode();
        } else {
            error = "Postać nie występuje w tym odcinku.";
        }
    } catch (e) {
        error = e.message;
    }

    return (
        <div>
            {error && <p>{error}</p>}
            {episode.name && <p>Nazwa: {episode.name}</p>}
            {episode.air_date && <p>Data emisji: {episode.air_date}</p>}
            {episode.episode && <p>Odcinek: {episode.episode}</p>}
        </div>
    );
}