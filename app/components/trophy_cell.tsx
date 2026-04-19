import { PSNTrophy } from "@/lib/types/psn";

interface TrophyCellProps {
    trophy: PSNTrophy
}

export default function TrophyCell(props: TrophyCellProps) {
    const {trophy} = props

    return (
        <div className={`flex flex-row gap-4 flex-wrap w-250px h-45px border-4 ${trophy.trophyEarned ? "border-green-500/25" : "border-red-500/25"} p-4 items-center`}>
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
}