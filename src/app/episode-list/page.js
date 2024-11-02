import axios from 'axios';

export async function generateMetadata({searchParams}) {
    searchParams = await searchParams;
    const seasonFilter = searchParams.season;
    const sortOrder = searchParams.sort;


    let title = "Rick and morty";
    if (seasonFilter) {
        title += `: sezon ${seasonFilter.replace(/"S"/g, '')}`;
    }

    return {
        title,
    }
}


export default async function Page({searchParams}) {

    searchParams = await searchParams;

    const seasonFilter = searchParams.season;
    const sortOrder = searchParams.sort;
    let episodeList = [];
    let error = '';

    try {
        const linki = [
            'https://rickandmortyapi.com/api/episode?page=1',
            'https://rickandmortyapi.com/api/episode?page=2',
            'https://rickandmortyapi.com/api/episode?page=3'
        ];

        const responses = await Promise.all(linki.map(url => axios.get(url)));
        episodeList = responses.flatMap(response => response.data.results);

        if (seasonFilter) {
            const seasonFilterUpper = seasonFilter.toUpperCase();
            episodeList = episodeList.filter(ep => ep.episode.startsWith(seasonFilterUpper));

            if(episodeList.length === 0){
                error = "Brak danych.";
            }
        }

        if (sortOrder) {
            if (sortOrder === "episode_asc") {
                episodeList.sort((a, b) => {
                    const [seasonA, episodeA] = a.episode.match(/\d+/g).map(Number);
                    const [seasonB, episodeB] = b.episode.match(/\d+/g).map(Number);
                    return seasonA - seasonB || episodeA - episodeB;
                });
            } else if (sortOrder === "episode_desc") {
                episodeList.sort((a, b) => {
                    const [seasonA, episodeA] = a.episode.match(/\d+/g).map(Number);
                    const [seasonB, episodeB] = b.episode.match(/\d+/g).map(Number);
                    return seasonB - seasonA || episodeB - episodeA;
                });
            } else if (sortOrder === "air_date_asc") {
                episodeList.sort((a, b) => new Date(a.air_date) - new Date(b.air_date));
            } else if (sortOrder === "air_date_desc") {
                episodeList.sort((a, b) => new Date(b.air_date) - new Date(a.air_date));
            }
        }

    } catch (e) {
        error = e.message;
    }

    return (
        <div>
            {error && <p>{error}</p>}
            <ul>
                {episodeList.map(episode => (
                    <li key={episode.id}>
                        <h2>Nazwa: {episode.name}</h2>
                        <p>Data emisji: {episode.air_date}</p>
                        <p>Odcinek: {episode.episode}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}