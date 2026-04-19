import { Progress } from "@/components/ui/progress";
import { hasEarnedPlatinum, PSNGame } from "@/lib/types/psn";

interface GameCellProps {
    game: PSNGame
}

export default function GameCell(props: GameCellProps) {
    const {game} = props

    const showPlatinumIcon = () => {
        if (hasEarnedPlatinum(game)) {
            return (
                <img src={`/platinum_trophy.png`} className="w-10 h-10" />
            )
        }
    }

    return (
        <div className="flex gap-4 flex-wrap w-250px h-45px border-4 border-gray-800 p-4 items-center">
            <div className="flex flex-row w-full h-fit gap-4 justify-center items-center">
                <img src={game.boxArt} width={100} height={50} />
                <div className="flex-col h-fit w-full">
                    <div className="flex flex-row gap-4 items-center">
                        <h5 className={`scroll-m-20 text-lg tracking-tight font-bold`}>
                            {game.name}
                        </h5>
                        <div className="w-fit h-fit bg-indigo-900 p-1 px-2 justify-self-center">
                            <h5 className={`scroll-m-20 text-md tracking-tight font-extrabold`}>
                                {game.platform}
                            </h5>
                        </div>
                        {showPlatinumIcon()}
                    </div>
                    <p className={`leading-7`}>
                        {game.trophies.length} Trophies
                    </p>
                    <div className="flex flex-row items-center gap-4">
                        <Progress value={game.progress} />
                        <p className={`leading-7`}>
                            {game.progress}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}