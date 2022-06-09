import { NFT } from "web3uikit"
import { useMoralis } from "react-moralis"
export default function lpposition() {
    const { chainId, account } = useMoralis()
    console.log(account)
    return (
        <div className="py-16 mt-4 px-8">
            {/* This needs to be updaated to show the LiquidityPool Positions */}
            <NFT
                chain={chainId}
                address="0xc36442b4a4522e871399cd717abdd847ab11fe88"
                tokenId="150848"
            />
        </div>
    )
}
