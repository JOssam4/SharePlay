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

type externalUrl = {
    spotify: string
}

type imageType = {
    height: number,
    url: string,
    width: number,
}

type ArtistType = {
    external_urls: externalUrl,
    followers: {
        href: string | null,
        total: number,
    },
    genres: string[],
    href: string,
    id: string,
    images: imageType[],
    name: string,
    popularity: number,
    type: string,
    uri: string,
}

/**
 * Like the ArtistType, but returned under artist field in track objects (Minimum Artist Type)
 * */
type MinArtistType = {
    external_urls: externalUrl,
    followers: {
        href: string | null,
        total: number,
    },
    genres: string[],
    href: string,
    id: string,
    images: imageType[],
    name: string,
    popularity: number,
    type: string,
    uri: string,
}

type TrackArtistType = {
    external_urls: externalUrl,
    href: string,
    id: string,
    name: string,
    type: string,
    uri: string,
}

type AlbumType = {
    album_type: string,
    artists: MinArtistType[],
    available_markets: string[],
    external_urls: externalUrl,
    href: string,
    id: string,
    images: imageType[],
    name: string,
    release_date: string,
    release_date_precision: string,
    total_tracks: number,
    type: string,
    uri: string,

}

type TrackType = {
    album: AlbumType,
    artists: MinArtistType[],
    available_markets: string[],
    disc_number: number
    duration_ms: number
    explicit: boolean,
    external_ids: {
        isrc: string,
    },
    external_urls: externalUrl,
    href: string,
    id: string,
    is_local: boolean,
    name: string,
    popularity: number,
    preview_url: string,
    track_number: number,
    type: string,
    uri: string,
}

type TrackItems = {
    added_at: string,
    track: TrackType,
}

type TracksRespWithAddedTime = {
    href: string,
    items: TrackItems[],
    limit: number
    next: string,
    offset: number,
    previous: any,
    total: number,
}

type TracksRespWithoutAddedTime = {
    href: string,
    items: TrackType[],
    limit: number
    next: string,
    offset: number,
    previous: any,
    total: number,
}

export type {
  Person, Playlist, PlaylistJSON, TrackType, ArtistType, MinArtistType, TrackArtistType, AlbumType, TrackItems, TracksRespWithAddedTime, TracksRespWithoutAddedTime,
};
