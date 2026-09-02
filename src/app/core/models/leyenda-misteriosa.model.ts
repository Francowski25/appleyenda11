export interface RetoDiarioResponse {
    type: string;
    firstName: string | null;
    lastName: string | null;
    firstNameLength: number | null;
    lastNameLength: number | null;
    listMessage: string[];
}

export interface GameResultResponse {
    type: string;
    listMessage: string[];
}