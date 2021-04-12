import { MinArtistType } from './SpotifyAPITypes';

type MinifiedTrackType = {
    id: string,
    name: string,
    artists: string[],
};

type MapTrackValue = {
    name: string,
    artists: MinArtistType[],
};

// eslint-disable-next-line import/prefer-default-export
export type { MinifiedTrackType, MapTrackValue };
