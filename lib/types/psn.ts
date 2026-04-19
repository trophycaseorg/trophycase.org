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

export function hasEarnedPlatinum(game: PSNGame): boolean {
    for (const trophy of game.trophies) {
        if (trophy.trophyEarned && trophy.trophyType == "platinum") {
            return true
        }
    }

    return false
}