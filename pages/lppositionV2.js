import { NFT } from "web3uikit"
import { useMoralis, Moralis } from "react-moralis"
export default function lpposition() {
    const { chainId } = useMoralis()
    const lpV3EthAddr = "0xc36442b4a4522e871399cd717abdd847ab11fe88"
    const chain = "eth"
    return (
        <div className="py-16 mt-4 px-8">
            <ul
                role="list"
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
            >
                {/* {NFTs.map((nft) => (
                    <li className="relative">
                        <a
                            href={`https://opensea.io/assets/ethereum/${lpV3EthAddr}/${nft.token_id}`}
                            target="_blank"
                        >
                            <NFT
                                address={lpV3EthAddr}
                                chain={chainId}
                                metadata={JSON.parse(nft.metadata)}
                                tokenId={nft.token_id}
                            />
                        </a>
                    </li>
                ))} */}
                <NFT
                    address={lpV3EthAddr}
                    chain={chainId}
                    // metadata={JSON.parse(nft.metadata)}
                    tokenId="1"
                />
            </ul>
        </div>
    )
}
