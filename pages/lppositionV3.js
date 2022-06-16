import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import {
    NFT,
    Loading,
    Tooltip,
    Icon,
    useNotification,
    Button,
    Modal,
    Typography,
    Input,
} from "web3uikit"

export default function lppositionV3() {
    //chainId is the id of the chain connected to and account is the address of the wallet connected to handeled internally by Moralis-SDK
    const { chainId, account } = useMoralis()

    //To dispatch the notification on bottom right of the screen using web3uikit
    const dispatch = useNotification()

    //React state variable -  NFTs data, which will update everytime with a fetchData call from Moralis WEB3 API
    const [NFTs, setNFTs] = useState([])

    //React state variable -  NFTs data, which will update when user clicks on SHOW MORE button
    const [displayNFTs, setDisplayNFTs] = useState([])

    //page number to update the NFTs displaying when user clicks on SHOW MORE button
    const [page, setPage] = useState(1)

    //Function that handles the setting of the NFTs data to display when user clicks on SHOW MORE button
    const handleSettingDisplayNFTs = () => {
        const startingIndex = (page - 1) * 10

        setDisplayNFTs((prevNFTs) => [
            ...prevNFTs,
            ...NFTs.slice(startingIndex, startingIndex + 10),
        ])
    }

    //Function which triggers the state change of page number when user clicks on SHOW MORE button
    const handleShowMoreAction = () => {
        setPage((prevPage) => prevPage + 1)
    }

    //React state variable - The address which is searched for
    const [showingAddress, setShowingAddress] = useState("")

    //React state variable - Input value user enters in the address modal
    const [inputAddrValue, setInputAddrValue] = useState("")

    //Reatct state varibale to toggle the Modal(which asks user to enter an address to serach for) visiblity
    const [addressModalVisible, setAddressModalVisible] = useState(false)

    //React state variable - Indiactes whether to show loading or not
    const [loading, setLoading] = useState(false)

    //Conrtact Address of V3-Positions NFT for corresponding chainId. Supporting only ethereum and polygon
    const chainIdAddrMap = {
        "0x1": "0xc36442b4a4522e871399cd717abdd847ab11fe88",
        "0x89": "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    }

    //Name of chain for corresponding chainId. Supporting only ethereum and polygon
    const chainIdNameMap = {
        "0x1": "ethereum",
        "0x89": "polygon",
    }

    //options used to fetch the V3-LP positions of the address
    const options = {
        user: account,
        // user: "0xf4adb9ba51fde3eaee89ce9a60e99992611849fd",
        chainId: chainId,
        token_address: chainIdAddrMap[chainId]
            ? chainIdAddrMap[chainId]
            : "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    }

    //Function takes care dynamic data and dispactches the Notofication to the screen
    const handleNewNotification = (params) => {
        dispatch({
            type: params.type,
            message: params.message,
            title: params.title,
            icon: params.icon,
            position: params.position || "bottomR",
        })
    }

    //Function takes care of storing the value entered by the user in the address modal automatically
    const onInputChange = (event) => {
        const { value } = event.target
        setInputAddrValue(value)
    }

    //Function takes care of fetching the V3-LP positions of the address
    const fetchData = async (addressGiven) => {
        if (addressGiven === undefined || addressGiven === null || addressGiven === "") {
            const params = {
                type: "error",
                message: "Please enter a address",
                title: "Uniswap LP Position V3",
                icon: "exclamation",
            }
            handleNewNotification(params)
            setNFTs([])
            setDisplayNFTs([])
            setLoading(false)
            return
        } else if (addressGiven.toLowerCase() === showingAddress.toLowerCase()) {
            const params = {
                type: "warning",
                message: "Showing For the same address",
                title: "Uniswap LP Position V3",
            }
            handleNewNotification(params)
            return
        }
        addressGiven = addressGiven.toLowerCase().trim()
        if (addressGiven.length !== 42) {
            const params = {
                type: "error",
                message: "Please enter a valid address",
                title: "Uniswap LP Position V3",
                icon: "exclamation",
            }
            handleNewNotification(params)
            return
        }
        options.user = addressGiven
        setShowingAddress(options.user)
        try {
            if (
                chainId === undefined ||
                chainId === null ||
                chainIdAddrMap[chainId] === undefined
            ) {
                const params = {
                    type: "error",
                    message: "Supports only Ethereum and Polygon",
                    title: "Uniswap LP Position V3",
                    icon: "exclamation",
                }
                handleNewNotification(params)
                setNFTs([])
                setLoading(false)
                return
            }
            setNFTs([])
            setLoading(true)
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
                setNFTs([])
                setLoading(false)
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
                setNFTs([])
                setLoading(false)
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
                setLoading(false)
            }
        } catch (error) {
            const params = {
                type: "error",
                message: error,
                title: "Unexpected error",
            }
            handleNewNotification(params)
            setNFTs([])
            setLoading(false)
        }
    }

    //The "?" Icon which shows the dtails of user and chain the data is showing for
    const getToolTip = () => {
        return (
            <Tooltip
                content={`Uniswap V3 Liquidity Position for the wallet ${showingAddress} on ${
                    chainIdNameMap[options.chainId]
                } blockchain`}
                position="right"
            >
                <Icon fill="#68738D" size={25} svg="helpCircle" />
            </Tooltip>
        )
    }

    //React hook to display more NFTs when page number or react state variable NFTs changes
    useEffect(() => {
        if (!NFTs || NFTs?.length < 1) {
            return
        }
        handleSettingDisplayNFTs()
    }, [NFTs, page])

    //Reacat hook to fetch the V3-LP positions for the user whenever the user connect a wallet address or changes the chain
    useEffect(() => {
        if (account === undefined || account === null) {
            return
        }
        fetchData(account)
        setLoading(true)
    }, [account, chainId])

    return (
        <div>
            <div className="flex justify-between">
                {NFTs && NFTs.length !== 0 ? (
                    <div className="mt-2">
                        {/* the "?" ICON showed on the top left of the NFTs which discribes the details */}
                        {getToolTip()}
                    </div>
                ) : (
                    <div></div>
                )}
                <div>
                    {/* Button which enables usser to check different address than connect */}
                    <Button
                        id="checkOtherAddr"
                        onClick={() => {
                            setAddressModalVisible(true)
                        }}
                        text="Check different address"
                        theme="secondary"
                        type="button"
                    />
                </div>
            </div>
            {!loading || (displayNFTs && displayNFTs.length !== 0) ? (
                <div>
                    <div className="pt-4">
                        <ul
                            role="list"
                            className="grid grid-cols-1 gap-x-8 gap-y-8 sm:gap-x-10 md:grid-cols-2 md:gap-x-8 xl:grid-cols-4 xl:gap-x-8"
                        >
                            {/* This is the NFTs Displaying for Uniswap Liquidity V3 Positions */}
                            {displayNFTs &&
                                displayNFTs.length > 0 &&
                                displayNFTs.map((nft) => (
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
                        {NFTs &&
                            NFTs.length > 0 &&
                            displayNFTs &&
                            displayNFTs.length > 0 &&
                            NFTs.length !== displayNFTs.length && (
                                //Show more button to show more NFTs if the user has more NFTs than the displayNFTs
                                <div className="flex justify-center pt-4 w-full">
                                    <Button
                                        id="showMoreNFTs"
                                        onClick={() => {
                                            handleShowMoreAction()
                                        }}
                                        text="Show more"
                                        theme="secondary"
                                        type="button"
                                    />
                                </div>
                            )}
                        {displayNFTs.length == 0 && (
                            //Shows this message if the user has no NFTs
                            <div className="flex justify-center font-bold text-2xl text-blue-400">
                                {" "}
                                No Postions Found
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid place-items-center h-screen w-full px-96 mr-60">
                    <div>
                        {/* Shows Loading animation while fetching the V3-Postions NFTs */}
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
            <div className={`w-full h-full fixed z-30 ${addressModalVisible ? "" : "hidden"}`}>
                {/* Modal to ask user to enter an address to search V3-LP position for*/}
                <Modal
                    id="addressModal"
                    isVisible={addressModalVisible}
                    hasCancel={false}
                    okText="Check V3 Postions"
                    onCloseButtonPressed={function noRefCheck() {
                        setAddressModalVisible(false)
                    }}
                    onOk={() => {
                        setAddressModalVisible(false)
                        fetchData(inputAddrValue)
                        setLoading(true)
                    }}
                    title={
                        <div style={{ display: "flex", gap: 10 }}>
                            <Icon fill="#68738D" size={28} svg="edit" />
                            <Typography color="#68738D" variant="h3">
                                Enter any valid address to get LP V3 Positions
                            </Typography>
                        </div>
                    }
                >
                    <div
                        style={{
                            padding: "20px 0 20px 0",
                        }}
                    >
                        <Input
                            label="address"
                            width="100%"
                            value={inputAddrValue}
                            onChange={onInputChange}
                        />
                    </div>
                </Modal>
            </div>
        </div>
    )
}
