import { NFTBalance, Tooltip, Icon } from "web3uikit"
import { useMoralis } from "react-moralis"
export default function doggie() {
    const { chainId, account } = useMoralis()
    const chainIdNameMap = {
        "0x1": "ethereum",
        "0x89": "polygon",
    }

    return (
        <div>
            {account !== null && chainId !== null ? (
                <div className="ml-4 justify-center">
                    <div className="flex">
                        <Tooltip
                            content={`All NFTs in the wallet ${account} on ${chainIdNameMap[chainId]} blockchain`}
                            position="right"
                        >
                            <Icon fill="#68738D" size={25} svg="helpCircle" />
                        </Tooltip>
                    </div>
                    {/* as of now shows all the ethereum NFTs of the wallet on the chain connected to */}
                    <NFTBalance chain={chainId} address={account} />
                </div>
            ) : (
                <div className="flex justify-center font-bold text-2xl text-blue-400">
                    Connect to the Wallet using "Connect Wallet" button above
                </div>
            )}
        </div>
    )
}
