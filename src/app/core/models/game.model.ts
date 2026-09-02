export interface Game {
    idGame: string;
    name: string;
    slug: string;
    description: string;
    minimumLevel: number;
    active: boolean;
    dailyStreak: boolean;
    createdAt: string;
    popularity: number | null;
    isNew: boolean | null;
    isUpdated: boolean | null;
    color: string | null;
    image: string | null;
    pointsReward: number;
}

export interface GameListResponse {
    type: string;
    listGame: Game[];
    listMessage: string[];
}

export interface GameCompletedResponse {
    type?: string;
    listMessage?: string[];
    listGame: Game[] | null;
}