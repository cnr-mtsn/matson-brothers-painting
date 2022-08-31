import Head from "next/head"
import tw, { styled } from "twin.macro"

export default function Home() {
	return <HomeContent></HomeContent>
}

const HomeContent = styled.div`
	${tw`text-blue-800`}
`
