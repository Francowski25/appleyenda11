export interface LoginResponse {
    type?: string;
    token: string;
    refreshToken: string;
    idUser: string;
    name: string;
    avatar: string | null;
    nickName: string;
    email: string;
    userType: string;
    level: number;
    totalPoints: number;
    idLevel: string | null;
    levelName: string | null;
    levelIcon: string | null;
    levelPosition: number | null;
    levelMin: number | null;
    levelMax: number | null;
    listMessage?: string[];
}

export interface LevelInfo {
    idLevel: string | null;
    levelName: string | null;
    levelIcon: string | null;
    levelPosition: number | null;
    levelMin: number | null;
    levelMax: number | null;
}

export interface UpdateLevelPoints extends LevelInfo {
    level: number;
    totalPoints: number;
}