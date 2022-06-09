import Head from "next/head"
import Image from "next/image"
import Header from "../components/Header"

export default function Home() {
    return (
        <div>
            <Head>
                <title>Solidus Labs LPPM</title>
                <meta name="description" content="Liquidity Pool Position on UNISWAP" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <footer className="flex justify-center  p-2 fixed  inset-x-0 bottom-0">
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{" "}
                    <span>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    )
}
