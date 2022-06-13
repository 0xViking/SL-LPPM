import { NFT, Loading, Modal } from "web3uikit"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"

export default function lppositionV3() {
    const { chainId, account } = useMoralis()
    const chainIdAddrMap = {
        "0x1": "0xc36442b4a4522e871399cd717abdd847ab11fe88",
        "0x89": "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    }
    const chainIdNameMap = {
        "0x1": "eth",
        "0x89": "polygon",
    }

    {
        /* NFTs data, will update with an API call*/
    }
    const [NFTs, setNFTs] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            // const headers = new Headers()
            // headers.set("Accept", "application/json")
            // headers.set(
            //     "X-API-Key",
            //     process.env.NEXT_PUBLIC_MORALIS_API_KEY
            // )
            // const url = `https://deep-index.moralis.io/api/v2/${account}/nft/${chainIdAddrMap[chainId]}?chain=${chainId}&format=decimal`
            // const url = `https://deep-index.moralis.io/api/v2/0xf4adb9ba51fde3eaee89ce9a60e99992611849fd/nft/${chainIdAddrMap[chainId]}?chain=${chainId}&format=decimal`
            setNFTs([])
            let tempNFTs = []
            const options = {
                // user: "0xf4adb9ba51fde3eaee89ce9a60e99992611849fd",
                user: "0x1d44f3bfc5b901c581886b940235cfb798ce4fc8",
                chainId: chainId,
                token_address: chainIdAddrMap[chainId]
                    ? chainIdAddrMap[chainId]
                    : "0xc36442b4a4522e871399cd717abdd847ab11fe88",
            }
            try {
                if (chainId === undefined || chainId === null) return

                const response = await fetch(
                    `/api/lpV3/${options.user}/${options.token_address}/${options.chainId}`
                )
                const data = await response.json()
                console.log(data.result)
                setNFTs(data.result)
                if (chainIdAddrMap[chainId] === undefined) {
                    alert("Supports only ETH and POLYGON UNISWAP-V3")
                    tempNFTs = [{}]
                    setNFTs(tempNFTs)
                } else if (data && data.result && data.result.length <= 0) {
                    alert(
                        `No UNISWAP-V3 LP NFTs found on ${
                            chainIdNameMap[chainId] ? chainIdNameMap[chainId] : chainId
                        } chain for ${account}`
                    )
                    tempNFTs = [{}]
                    setNFTs(tempNFTs)
                }
            } catch (error) {
                alert("unexpected error")
                tempNFTs = [{}]
                setNFTs(tempNFTs)
            }
        }
        fetchData()
    }, [account, chainId])

    return (
        <div>
            {NFTs && NFTs.length !== 0 ? (
                <div>
                    <div className="py-14 mt-4 px-4">
                        <ul
                            role="list"
                            className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-x-10 md:grid-cols-2 md:gap-x-8 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4 xl:gap-x-8"
                        >
                            {/* This is the NFTs Displaying for Uniswap Liquidity V3 Positions */}
                            {NFTs &&
                                NFTs.length > 0 &&
                                NFTs.map((nft) => (
                                    <li
                                        key={nft.token_hash}
                                        className="p-2 relative border-2 border-r-4 border-t-4 rounded-lg shadow-lg"
                                    >
                                        <a
                                            href={`https://opensea.io/assets/ethereum/${chainIdAddrMap[chainId]}/${nft.token_id}`}
                                            target="_blank"
                                        >
                                            <NFT
                                                address="0xc36442b4a4522e871399cd717abdd847ab11fe88"
                                                chain={chainId}
                                                metadata={nft.metadata && JSON.parse(nft.metadata)}
                                                tokenId={nft.token_id}
                                            />
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="grid place-items-center h-screen w-full px-96 mr-60">
                    <div>
                        <Loading
                            fontSize={20}
                            size={40}
                            spinnerColor="#2E7DAF"
                            spinnerType="loader"
                            text="Loading..."
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
