export interface PSNTrophy {
    trophyId: number,
    trophyHidden: boolean,
    trophyType: string,
    trophyName: string,
    trophyDetail: string,
    trophyIconUrl: string,
    trophyGroupId: string,
    trophyEarned: boolean | undefined,
    trophyEarnedDate: string | undefined
}

export interface PSNGame {
    npCommunicationId: string | undefined
    name: string,
    boxArt: string,
    platform: string,
    progress: number | undefined,
    trophies: PSNTrophy[]
}

export const trophyRarity: string[] = ["bronze", "silver", "gold", "platinum"]

export function hasEarnedPlatinum(game: PSNGame): boolean {
    for (const trophy of game.trophies) {
        if (trophy.trophyEarned && trophy.trophyType == "platinum") {
            return true
        }
    }

    return false
}