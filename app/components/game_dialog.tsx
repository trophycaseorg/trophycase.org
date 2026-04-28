import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PSNGame, PSNTrophy, trophyRarity } from "@/lib/types/psn";
import TrophyCell from "./trophy_cell";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as converter from "json-2-csv"
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

interface GameDialogProps {
    open: boolean,
    handleClose: () => void,
    trigger: React.ReactNode,
    game: PSNGame
}

enum DataExportType {
    JSON = 0,
    CSV = 1
}

export default function GameDialog(props: GameDialogProps) {
    const {open, handleClose, trigger, game} = props

    const [trophies, setTrophies] = useState<PSNTrophy[]>(game.trophies)
    const [showHidden, setShowHidden] = useState(true)

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

    const exportingMethods = ["JSON", "CSV"]
    const [exportMethod, setExportMethod] = useState<DataExportType>(DataExportType.JSON)
    const exportGameData = async () => {
        switch (exportMethod) {
            case DataExportType.JSON: {
                const dataString = JSON.stringify(game, null, 4)
                const blob = new Blob([dataString], {type: "application/json"})

                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `${game.name}_data.json`
                document.body.appendChild(link)
                link.click()

                document.body.removeChild(link)
                URL.revokeObjectURL(url)

                break
            }
            case DataExportType.CSV: {
                const csv = await converter.json2csv([game])
                const blob = new Blob([csv], {type: "text/plain"})

                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `${game.name}_data.csv`
                document.body.appendChild(link)
                link.click()

                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            }
        }
    }

    return (
        <Dialog open={open}>
            {trigger}
            <DialogContent className="sm:max-w-7xl" onInteractOutside={handleClose} showCloseButton={false}>
                <DialogHeader className="flex justify-self-center items-center">
                    <DialogTitle className="text-2xl">{game.name}</DialogTitle>
                    <br />
                    <div className="flex flex-row gap-4">
                        <Combobox items={sortingMethods} onValueChange={(val) => sortTrophies(val as string)}>
                            <ComboboxInput placeholder="Sort by" />
                            <ComboboxContent>
                                <ComboboxEmpty>No sort found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(sort) => (
                                        <ComboboxItem key={sort} value={sort} className="pointer-events-auto">
                                            {sort}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <Combobox items={exportingMethods} onValueChange={(val) => setExportMethod(val as DataExportType)}>
                            <ComboboxInput placeholder="Export as" value={exportingMethods.at(exportMethod as number)} />
                            <ComboboxContent>
                                <ComboboxEmpty>No method found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(exportType) => (
                                        <ComboboxItem key={exportType} value={exportingMethods.indexOf(exportType) as DataExportType} className="pointer-events-auto">
                                            {exportType}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <Button className="cursor-pointer" onClick={exportGameData}>Export</Button>
                    </div>
                    <br />
                    <div className="border-gray-600 border p-4 px-8">
                        <Field orientation="horizontal">
                            <Checkbox id="show-hidden-trophies-checkbox" name="show-hidden-trophies-checkbox" checked={showHidden} onCheckedChange={(e) => setShowHidden(e.valueOf() as boolean)} />
                            <Label htmlFor="show-hidden-trophies-checkbox">Show Hidden Trophies</Label>
                        </Field>
                    </div>
                </DialogHeader>
                <Separator orientation="horizontal" />
                <div className="flex flex-col gap-4 justify-self-center w-300 h-175 overflow-y-scroll no-scrollbar border-4 p-4">
                    {trophies.map((trophy) => (
                        <TrophyCell key={trophy.trophyId} trophy={trophy} showHidden={showHidden} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}