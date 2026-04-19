import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PSNGame, PSNTrophy, trophyRarity } from "@/lib/types/psn";
import TrophyCell from "./trophy_cell";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { useState } from "react";

interface GameDialogProps {
    open: boolean,
    handleClose: () => void,
    trigger: React.ReactNode,
    game: PSNGame
}

export default function GameDialog(props: GameDialogProps) {
    const {open, handleClose, trigger, game} = props

    const [trophies, setTrophies] = useState<PSNTrophy[]>(game.trophies)

    const sortingMethods = ["ID (Ascending)", "ID (Descending)", "Rarity (Ascending)", "Rarity (Descending)"]
    const sortTrophies = (method: string) => {
        const t = trophies.slice(0)
        switch(method) {
            case "ID (Ascending)": {
                t.sort((a, b) => a.trophyId - b.trophyId)
                break
            }
            case "ID (Descending)": {
                t.sort((a, b) => b.trophyId - a.trophyId)
                break
            }
            case "Rarity (Ascending)": {
                t.sort((a, b) => trophyRarity.indexOf(a.trophyType) - trophyRarity.indexOf(b.trophyType))
                break
            }
            case "Rarity (Descending)": {
                t.sort((a, b) => trophyRarity.indexOf(b.trophyType) - trophyRarity.indexOf(a.trophyType))
                break
            }
        }
        setTrophies(t)
    }

    return (
        <Dialog open={open}>
            {trigger}
            <DialogContent className="sm:max-w-7xl" onInteractOutside={handleClose} showCloseButton={false}>
                <DialogHeader className="flex justify-self-center items-center">
                    <DialogTitle className="text-2xl">{game.name}</DialogTitle>
                    <br />
                    <Combobox items={sortingMethods} onValueChange={(val) => sortTrophies(val as string)}>
                        <ComboboxInput placeholder="Sort by" />
                        <ComboboxContent>
                            <ComboboxEmpty>No sort found.</ComboboxEmpty>
                            <ComboboxList>
                                {(sort) => (
                                    <ComboboxItem key={sort} value={sort}>
                                        {sort}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </DialogHeader>
                <Separator orientation="horizontal" />
                <div className="flex flex-col gap-4 justify-self-center w-300 h-200 overflow-y-scroll no-scrollbar border-4 p-4">
                    {trophies.map((trophy) => (
                        <TrophyCell key={trophy.trophyId} trophy={trophy} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}