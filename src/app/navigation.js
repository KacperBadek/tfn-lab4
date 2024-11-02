'use client';

import { useRouter } from 'next/navigation';

export default function Navigation() {
    const router = useRouter();

    const navigateTo = (path) => {
        router.push(path);
    };

    return (
        <nav>
            <button onClick={() => navigateTo('/character/1')}>
                Characters
            </button>
            <br/><br/>
            <button onClick={() => navigateTo('/character/1/episodes/1')}>
                Episodes
            </button>
            <br/><br/>
            <button onClick={() => navigateTo('/episode-list?season=S01&sort=episode_asc')}>
                Episode lists
            </button>
        </nav>
    );
}