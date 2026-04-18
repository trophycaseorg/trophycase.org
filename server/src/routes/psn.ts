import { Router } from "express"
import {
    exchangeNpssoForAccessCode,
    exchangeAccessCodeForAuthTokens,
    exchangeRefreshTokenForAuthTokens,
    getUserTitles,
    getUserTrophiesEarnedForTitle,
    getTitleTrophies
} from "psn-api"

export const psnRouter = Router()

psnRouter.get("/auth", async (req, res) => {
    const npsso = req.query.npsso as string

    const accessCode = await exchangeNpssoForAccessCode(npsso)
    const auth = await exchangeAccessCodeForAuthTokens(accessCode)

    return res.redirect(`/psn/getGames?accessToken=${auth.accessToken}`)

    /*
    const {trophyTitles} = await getUserTitles(
        {
            accessToken: auth.accessToken
        },
        "me"
    );

    console.log(`Found ${trophyTitles.length} games with trophies`)

    const results = []
    const title = trophyTitles[0]
    const {trophies} = await getUserTrophiesEarnedForTitle(
        {
            accessToken: auth.accessToken
        },
        "me",
        title.npCommunicationId,
        "all",
        {
            npServiceName: title.trophyTitlePlatform !== "PS5" ? "trophy" : "trophy2"
        }
    )

    const betterTrophies = []
    for (const trophy of trophies) {
        const trophyObject = {
            "trophyName": trophy.trophyRewardName,
            "trophyId": trophy.trophyId,
            "trophyHidden": trophy.trophyHidden,
            "earned": trophy.earned,
            "earnedDateTime": trophy.earnedDateTime,
            "trophyType": trophy.trophyType,
            "trophyRare": trophy.trophyRare,
            "trophyEarnedRate": trophy.trophyEarnedRate,
        }
        betterTrophies.push(trophyObject)
    }

    const gameObject = {
        game: title.trophyTitleName,
        boxArt: title.trophyTitleIconUrl,
        platform: title.trophyTitlePlatform,
        progress: title.progress,
        trophies: betterTrophies,
    }
    results.push(gameObject)

    /* for (const title of trophyTitles) {
        try {
            const {trophies} = await getUserTrophiesEarnedForTitle(
                {
                    accessToken: auth.accessToken
                },
                "me",
                title.npCommunicationId,
                "all",
                {
                    npServiceName: title.trophyTitlePlatform !== "PS5" ? "trophy" : "trophy2"
                }
            )

            const gameObject = {
                game: title.trophyTitleName,
                platform: title.trophyTitlePlatform,
                progress: title.progress,
                trophies,
            }

            results.push(gameObject);

            await new Promise((r) => setTimeout(r, 300))
        } catch (error) {
            continue
        }
    }

    return res.json({
        "trophies": results
    })
    */
})

psnRouter.get("/getGames", async (req, res) => {
    const accessToken = req.query.accessToken as string

    const {trophyTitles} = await getUserTitles(
        {
            accessToken: accessToken
        },
        "me"
    );

    console.log(`Found ${trophyTitles.length} games with trophies`)

    const results = []
    for (const title of trophyTitles) {
        try {
            const gameTrophies = await getTitleTrophies(
                {
                    accessToken: accessToken
                },
                title.npCommunicationId,
                "all",
                {
                    npServiceName: title.trophyTitlePlatform !== "PS5" ? "trophy" : "trophy2"
                }
            )

            const userTrophies = await getUserTrophiesEarnedForTitle(
                {
                    accessToken: accessToken
                },
                "me",
                title.npCommunicationId,
                "all",
                {
                    npServiceName: title.trophyTitlePlatform !== "PS5" ? "trophy" : "trophy2"
                }
            )

            const fullTrophyData = []
            for (const trophy of gameTrophies.trophies) {
                const userTrophy = userTrophies.trophies.at(gameTrophies.trophies.indexOf(trophy))
                const trophyObject = {
                    "trophyId": trophy.trophyId,
                    "trophyHidden": trophy.trophyHidden,
                    "trophyType": trophy.trophyType,
                    "trophyName": trophy.trophyName,
                    "trophyDetail": trophy.trophyDetail,
                    "trophyIconUrl": trophy.trophyIconUrl,
                    "trophyGroupId": trophy.trophyGroupId,
                    "trophyEarned": userTrophy?.earned,
                    "trophyEarnedDate": userTrophy?.earnedDateTime
                }
                fullTrophyData.push(trophyObject)
            }

            const gameObject = {
                name: title.trophyTitleName,
                boxArt: title.trophyTitleIconUrl,
                platform: title.trophyTitlePlatform,
                progress: title.progress,
                trophies: fullTrophyData,
            }

            results.push(gameObject);

            await new Promise((r) => setTimeout(r, 300))
        } catch (error) {
            continue
        }
    }

    return res.json({
        results
    })
})