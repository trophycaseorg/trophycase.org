"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function HomePage() {
	return (
		<div className="w-full h-full flex flex-col flex-1 gap-4 items-center justify-center bg-zinc-50 font-mono dark:bg-black p-10">
			<h1 className={`scroll-m-20 text-4xl font-semibold tracking-tight text-balance`}>TrophyCase.org</h1>
			<h3 className={`scroll-m-20 text-xl tracking-tight text-balance`}>Track all your trophies/achievements here.</h3>
			<h3 className={`scroll-m-20 text-lg font-extrabold tracking-tight text-balance`}>Providers:</h3>
			<div className="flex flex-col gap-1 items-center">
				<Link href="/provider/steam">Steam</Link>
				<Link href="/provider/retroachievements">RetroAchievements</Link>
				<Link href="/provider/xbox">Xbox</Link>
				<Link href="/provider/psn">Playstation</Link>
			</div>
		</div>
	)
}