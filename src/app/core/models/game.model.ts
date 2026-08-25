export interface Game {
    idGame: string;
    name: string;
    slug: string;
    description: string;
    minimumLevel: number;
    active: boolean;
    dailyStreak: boolean;
    releaseDate: string;
    popularity: number;
    isNew: boolean;
    isUpdated: boolean;
    color: string;
}

export interface GameListResponse {
    type: string;
    listGame: Game[];
    listMessage: string[];
}