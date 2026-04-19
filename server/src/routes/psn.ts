import axios from "axios"
import { Router } from "express"
import {
    exchangeNpssoForAccessCode,
    exchangeAccessCodeForAuthTokens,
    exchangeRefreshTokenForAuthTokens,
    getUserTitles,
    getUserTrophiesEarnedForTitle,
    getTitleTrophies,
    makeUniversalSearch
} from "psn-api"

export const psnRouter = Router()

psnRouter.get("/auth", async (req, res) => {
    const npsso = req.query.npsso as string
    const psnName = req.query.psnName as string

    const accessCode = await exchangeNpssoForAccessCode(npsso)
    const auth = await exchangeAccessCodeForAuthTokens(accessCode)

    if (psnName !== "me") {
        const {domainResponses} = await makeUniversalSearch(
            {
                accessToken: auth.accessToken
            },
            psnName,
            "SocialAllAccounts"
        )

        const accountID = domainResponses[0].results[0].socialMetadata.accountId
        return res.redirect(`/psn/getGames?accessToken=${auth.accessToken}&accountID=${accountID}`)
    }

    return res.redirect(`/psn/getGames?accessToken=${auth.accessToken}&accountID=me`)
})

psnRouter.get("/getGames", async (req, res) => {
    const accessToken = req.query.accessToken as string
    const accountID = req.query.accountID as string

    const {trophyTitles} = await getUserTitles(
        {
            accessToken: accessToken
        },
        accountID
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
                accountID,
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