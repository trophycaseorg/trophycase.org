import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PSNGame } from "@/lib/types/psn";
import TrophyCell from "./trophy_cell";

interface GameDialogProps {
    open: boolean,
    handleClose: () => void,
    trigger: React.ReactNode,
    game: PSNGame
}

export default function GameDialog(props: GameDialogProps) {
    const {open, handleClose, trigger, game} = props

    return (
        <Dialog open={open}>
            {trigger}
            <DialogContent className="sm:max-w-7xl" onInteractOutside={handleClose} showCloseButton={false}>
                <DialogHeader className="flex justify-self-center items-center">
                    <DialogTitle>{game.name}</DialogTitle>
                </DialogHeader>
                <Separator orientation="horizontal" />
                <div className="flex flex-col gap-4 justify-self-center w-300 h-200 overflow-y-scroll no-scrollbar border-4 p-4">
                    {game.trophies.map((trophy) => (
                        <TrophyCell trophy={trophy} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}