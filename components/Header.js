import { useMoralis } from "react-moralis"
import { useEffect } from "react"
import Image from "next/image"
import { ConnectButton, NFT, NFTBalance } from "web3uikit"

export default function Header() {
    const { chainId, account } = useMoralis()
    return (
        //Header of the page which has the connect wallet button
        <div className="sticky top-0 z-10 bg-white p-4 shadow">
            <div className="flex justify-end">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
