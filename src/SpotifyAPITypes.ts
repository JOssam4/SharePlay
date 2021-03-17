
type Person = {
    display_name: string,
    external_urls: {spotify: string},
    href: string,
    id: string,
}

type Playlist = {
    collaborative: boolean,
    description: string,
    external_urls: {spotify: string},
    href: string,
    id: string,
    images: {height: number | null, url: string, width: number | null}[],
    name: string,
    owner: Person,
    primary_color: unknown,
    public: boolean,
    snapshot_id: string,
    tracks: {href: string, total: number},
    type: string,
    uri: string,
}

type PlaylistJSON = {
    href: string,
        items: Playlist[],
    limit: number,
    next: unknown,
    offset: number,
    previous: unknown,
    total: number
}



export type { Person, Playlist, PlaylistJSON };