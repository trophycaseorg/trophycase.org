"use client"

import axios from "axios"
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";
import { API_URL } from "@/lib/utils";
import { PSNGame } from "@/lib/types/psn";
import GameCell from "./components/game_cell";
import GameDialog from "./components/game_dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
	const [openGameName, setOpenGameName] = useState<string | null>(null)
	const [npsso, setNPSSO] = useState("")
	const [optionalPSNName, setOptionalPSNName] = useState("me")
	const [games, setGames] = useState<PSNGame[]>([])

	const [isPendingData, setIsPendingData] = useState(false)
	const [isError, setIsError] = useState(false)

	const getTrophies = () => {
		setIsError(false)
		setIsPendingData(true)
		axios.get(`${API_URL}/psn/auth?npsso=${npsso}&psnName=${optionalPSNName}`).then((res) => {
			setIsPendingData(false)
			setGames(res.data.results)
		}).catch(() => {
			setIsPendingData(false)
			setIsError(true)
		})
	}

	const fileInput = useRef<HTMLInputElement>(null)
	const [importedGame, setImportedGame] = useState<PSNGame | undefined>(undefined)
	const [importedGameDialogOpen, setImportedGameDialogOpen] = useState(false)
	const trophyDataFilePicker = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (files && files.length > 0) {
			const reader = new FileReader()
			reader.onload = (e) => {
				if (e.target !== null) {
					const data = e.target.result as string
					setImportedGame(JSON.parse(data))
					setImportedGameDialogOpen(true)
				}
			}
			reader.readAsText(files[0])
		}
	}

	const showImportedGameDialog = () => {
		if (importedGame !== undefined) {
			return (
				<GameDialog game={importedGame as PSNGame} open={importedGameDialogOpen} handleClose={() => setImportedGameDialogOpen(false)} trigger={
					<></>
				} />
			)
		}
	}

	return (
		<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-mono dark:bg-black p-10">
			<h1 className={`scroll-m-20 text-4xl font-semibold tracking-tight text-balance`}>TrophyCase.org</h1>
			<br />
			<h3 className={`scroll-m-20 text-xl tracking-tight text-balance`}>Track all your trophies/achievements here.</h3>
			<br />
			<div className="flex flex-row gap-4">
				<Field className="w-150" data-invalid={isError}>
					<FieldLabel htmlFor="input-npsso">NPSSO</FieldLabel>
					<Input id="input-npsso" type="password" placeholder="Enter your NPSSO token" onChange={(e) => setNPSSO(e.target.value)} aria-invalid={isError}/>
					<FieldDescription>
						Find your NPSSO <Link href={"https://ca.account.sony.com/api/v1/ssocookie"} target="_blank" rel="noopener noreferrer">here</Link>
					</FieldDescription>
				</Field>
				<Field className="w-75" data-invalid={isError}>
					<FieldLabel htmlFor="input-optional-psn-name">PSN Name (Optional)</FieldLabel>
					<Input id="input-optional-psn-name" type="tel" placeholder="Enter a PSN name" onChange={(e) => setOptionalPSNName(e.target.value)} aria-invalid={isError}/>
					<FieldDescription>
						(Optional) If you want to look at someone else's trophy list
					</FieldDescription>
				</Field>
			</div>
			<br />
			<div className="flex flex-row gap-4">
				<Button className="cursor-pointer" onClick={getTrophies}>
					Show Trophies
				</Button>
				<Button className="cursor-pointer" onClick={() => fileInput.current?.click()}>
					Import Trophy Data
				</Button>
				<input type="file" ref={fileInput} onChange={trophyDataFilePicker} className="hidden" multiple={false} accept="text/csv,application/json" />
			</div>
			<br />
			{showImportedGameDialog()}
			{!isPendingData ? 
			<div className="flex flex-col gap-4 justify-self-center w-400 h-[calc(72.5vh)] overflow-y-scroll no-scrollbar p-4">
				{games?.map((game) => (
					<GameDialog key={game.name + game.platform} game={game} open={openGameName == game.name} handleClose={() => setOpenGameName(null)} trigger={
						<DialogTrigger asChild>
							<div onClick={() => setOpenGameName(game.name)} className="cursor-pointer">
								<GameCell game={game} />
							</div>
						</DialogTrigger>
					} />
				))}
			</div>
			:
			<div className="flex flex-col items-center">
				<h3 className={`scroll-m-20 text-xl tracking-tight text-balance`}>Fetching trophies...</h3>
				<Spinner className="w-35 h-35" />
			</div>
			}
		</div>
	);
}
