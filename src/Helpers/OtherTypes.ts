import { MinArtistType, TrackArtistType } from './SpotifyAPITypes';

type MinifiedTrackType = {
    id: string,
    name: string,
    artists: string[],
};

type MapTrackValue = {
    name: string,
    artists: MinArtistType[],
};

type MapArtistValue = {
    name: string,
    id: string,
}

type LoadArtistTrackType = {
    track: {
        artists: TrackArtistType[],
        id: string,
        name: string,
    }
}

// eslint-disable-next-line import/prefer-default-export
export type {
  MinifiedTrackType, MapTrackValue, LoadArtistTrackType, MapArtistValue,
};
