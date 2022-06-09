import { NFTBalance } from "web3uikit"
import { useMoralis } from "react-moralis"
export default function doggie() {
    const { chainId, account } = useMoralis()
    console.log(account)
    return (
        <div className="py-16 mt-4 px-8">
            {/* as of now shows all the ethereum NFTs of the wallet on the chain connected to */}
            <NFTBalance
                chain={chainId}
                address={account}
                // tokenId="1"
            />
        </div>
    )
}
