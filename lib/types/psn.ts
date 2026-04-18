export interface PSNTrophy {
    trophyId: number,
    trophyHidden: boolean,
    trophyType: string,
    trophyName: string,
    trophyDetail: string,
    trophyIconUrl: string,
    trophyGroupId: string,
    trophyEarned: boolean,
    trophyEarnedDate: string
}

export interface PSNGame {
    name: string,
    boxArt: string,
    platform: string,
    progress: number,
    trophies: PSNTrophy[]
}