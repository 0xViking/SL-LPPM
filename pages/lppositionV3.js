import { NFT, Loading, Tooltip, Icon, useNotification } from "web3uikit"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"

export default function lppositionV3() {
    const { chainId, account } = useMoralis()

    {
        /* NFTs data, will update with an API call*/
    }
    const [NFTs, setNFTs] = useState([])

    const [loading, setLoading] = useState(false)

    const chainIdAddrMap = {
        "0x1": "0xc36442b4a4522e871399cd717abdd847ab11fe88",
        "0x89": "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    }

    const chainIdNameMap = {
        "0x1": "ethereum",
        "0x89": "polygon",
    }

    const options = {
        user: account,
        // user: "0xf4adb9ba51fde3eaee89ce9a60e99992611849fd",
        chainId: chainId,
        token_address: chainIdAddrMap[chainId]
            ? chainIdAddrMap[chainId]
            : "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    }

    const dispatch = useNotification()

    const handleNewNotification = (params) => {
        dispatch({
            type: params.type,
            message: params.message,
            title: params.title,
            icon: params.icon,
            position: params.position || "bottomR",
        })
    }

    const fetchData = async () => {
        setLoading(true)

        try {
            if (chainId === undefined || chainId === null) {
                const params = {
                    type: "error",
                    message: "This network is not supported",
                    title: "Uniswap LP Position V3",
                    icon: "exclamation",
                }
                handleNewNotification(params)
                // alert(params.message)
                setNFTs([{}])
                return
            }

            const response = await fetch(
                `/api/lpV3/${options.user}/${options.token_address}/${options.chainId}`
            )
            const data = await response.json()
            if (chainIdAddrMap[chainId] === undefined) {
                const params = {
                    type: "error",
                    message: "This network is not supported",
                    title: "Uniswap LP Position V3",
                    icon: "exclamation",
                }
                handleNewNotification(params)
                // alert(params.message)
                setNFTs([{}])
            } else if (data && data.result && data.result.length <= 0) {
                const params = {
                    type: "warning",
                    message: `No UNISWAP-V3 LP NFTs found on ${
                        chainIdNameMap[chainId] ? chainIdNameMap[chainId] : chainId
                    } chain for ${options.user}`,
                    title: "Uniswap LP Position V3",
                    icon: "exclamation",
                }
                handleNewNotification(params)
                // alert(params.message)
                setNFTs([{}])
            } else {
                console.log(data.result)

                const params = {
                    type: "success",
                    message: "LP positions found",
                    title: "Uniswap LP Position V3",
                }
                if (data.result.length > 0 && NFTs.length < 1) {
                    handleNewNotification(params)
                }
                setNFTs(data.result)
            }
        } catch (error) {
            const params = {
                type: "error",
                message: error,
                title: "Unexpected error",
            }
            handleNewNotification(params)
            // alert(params.message)
            setNFTs([{}])
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [account, chainId])

    return (
        <div>
            <div className="flex mt-10">
                <Tooltip
                    content={`Uniswap V3 Liquidity Position for the wallet ${options.user} on ${
                        chainIdNameMap[options.chainId]
                    } blockchain`}
                    position="right"
                >
                    <Icon fill="#68738D" size={25} svg="helpCircle" />
                </Tooltip>
            </div>
            {NFTs && NFTs.length !== 0 ? (
                <div>
                    <div className="mt-4 px-4 py-4">
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
