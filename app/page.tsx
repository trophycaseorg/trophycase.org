"use client"

import axios from "axios"
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/utils";
import { PSNGame } from "@/lib/types/psn";
import GameCell from "./components/game_cell";
import GameDialog from "./components/game_dialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default function Home() {
	const [openGameName, setOpenGameName] = useState<string | null>(null)
	const [npsso, setNPSSO] = useState("")
	const [games, setGames] = useState<PSNGame[]>()

	const getTrophies = () => {
		axios.get(`${API_URL}/psn/auth?npsso=${npsso}`).then((res) => {
			setGames(res.data.results)
		})
	}

	return (
		<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-mono dark:bg-black p-10">
			<h1 className={`scroll-m-20 text-4xl font-semibold tracking-tight text-balance`}>TrophyCase.org</h1>
			<Field className="w-150">
				<FieldLabel htmlFor="input-npsso">NPSSO</FieldLabel>
				<Input id="input-npsso" type="password" placeholder="Enter your NPSSO token" onChange={(e) => setNPSSO(e.target.value)}/>
				<FieldDescription>
					Find your NPSSO <Link href={"https://ca.account.sony.com/api/v1/ssocookie"} target="_blank" rel="noopener noreferrer">here</Link>
				</FieldDescription>
			</Field>
			<br />
			<Button className="cursor-pointer" onClick={getTrophies}>
				Show Trophies
			</Button>
			<div className="flex flex-col gap-4 justify-self-center w-400 h-[calc(85vh-75px)] overflow-y-scroll no-scrollbar p-4">
				{games?.map((game) => (
					<GameDialog game={game} open={openGameName == game.name} handleClose={() => setOpenGameName(null)} trigger={
						<DialogTrigger asChild>
							<div onClick={() => setOpenGameName(game.name)} className="cursor-pointer">
								<GameCell game={game} />
							</div>
						</DialogTrigger>
					} />
				))}
			</div>
		</div>
	);
}
