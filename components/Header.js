import { useMoralis } from "react-moralis"
import { useEffect } from "react"
import Image from "next/image"
import { ConnectButton, NFT, NFTBalance } from "web3uikit"

export default function Header() {
    const { chainId, account } = useMoralis()
    // console.log(parseInt(chainId))
    return (
        <div className=" flex fixed inset-x-0 ">
            <div className="ml-auto py-4 mr-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
