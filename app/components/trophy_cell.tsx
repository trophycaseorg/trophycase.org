import { Button } from "@/components/ui/button";
import { PSNTrophy } from "@/lib/types/psn";
import { useState } from "react";

interface TrophyCellProps {
    trophy: PSNTrophy,
    showHidden: boolean
}

export default function TrophyCell(props: TrophyCellProps) {
    const {trophy, showHidden} = props

    const [revealHidden, setRevealHidden] = useState(false)

    if (showHidden || revealHidden || trophy.trophyEarned || !trophy.trophyHidden) {
        return (
            <div className={`flex flex-row gap-4 flex-wrap w-250px h-45px border-4 ${trophy.trophyEarned ? "border-green-500/25" : "border-red-500/25"} p-4 items-center justify-center`}>
                <img src={trophy.trophyIconUrl} width={50} height={50} />
                <div className="flex flex-col h-fit">
                    <div className="flex flex-row gap-2 h-fit items-center">
                        <img src={`/${trophy.trophyType}_trophy.png`} className="w-10 h-10" />
                        <div className="flex flex-col w-250">
                            <h5 className={`scroll-m-20 text-lg tracking-tight font-bold`}>
                                {trophy.trophyName}
                            </h5>
                            <p className={`leading-7`}>
                                {trophy.trophyDetail}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={`flex flex-row gap-8 flex-wrap w-250px h-45px border-4 ${trophy.trophyEarned ? "border-green-500/25" : "border-red-500/25"} p-4 items-center justify-center`}>
                <img src={trophy.trophyIconUrl} width={50} height={50} className="blur-lg" />
                <div className="flex flex-col h-fit">
                    <div className="flex flex-col w-225">
                        <h5 className={`scroll-m-20 text-lg tracking-tight font-bold`}>
                            Hidden Trophy
                        </h5>
                        <p className={`leading-7`}>
                            This trophy is hidden. The more you play, the more likely you are to unlock it!
                        </p>
                    </div>
                </div>
                <Button className="self-center cursor-pointer" onClick={() => setRevealHidden(true)}>Reveal</Button>
            </div>
        )
    }
}