import { useMoralis } from "react-moralis"
import { useEffect } from "react"
import Image from "next/image"
import { ConnectButton, NFT, NFTBalance } from "web3uikit"

export default function Header() {
    const { chainId, account } = useMoralis()
    // console.log(parseInt(chainId))
    return (
        <div className="border-b-2 flex">
            <div className="flex justify-center p-2">
                <Image src="/solidusLogo.svg" alt="Vercel Logo" width={150} height={55} />
            </div>
            {/* <div className="py-2 px-2 font-bold text-xl "> */}
            {/* <h1 className="text-xl py-2 px-2 font-bold">
                Liquidity Pool Position Monitor on UNISWAP
            </h1> */}
            {/* </div> */}
            <div className="ml-auto py-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
