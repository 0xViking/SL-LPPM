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

    //React state variable - The address which is searched for
    const [showingAddress, setShowingAddress] = useState("")

    //React state variable - Input value user enters in the address modal
    const [inputAddrValue, setInputAddrValue] = useState("")

    //Reatct state varibale to toggle the Modal(which asks user to enter an address to serach for) visiblity
    const [addressModalVisible, setAddressModalVisible] = useState(false)

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
                setNFTs([{}, {}, {}, {}])
                return
            }
            setNFTs([])
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
                setNFTs([{}, {}, {}, {}])
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
                setNFTs([{}, {}, {}, {}])
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
            setNFTs([{}, {}, {}, {}])
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

    //Reacat hook to fetch the V3-LP positions for the user whenever the user connect a wallet address or changes the chain
    useEffect(() => {
        fetchData(account)
    }, [account, chainId])

    return (
        <div>
            <div className="flex justify-between mt-16">
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
            {NFTs && NFTs.length !== 0 ? (
                <div>
                    <div className="py-4">
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
            <div>
                {/* Modal to ask user to enter an address to search V3-LP position for*/}
                <Modal
                    id="addressModal"
                    isVisible={addressModalVisible}
                    hasCancel={false}
                    okText="Check L2 Postions"
                    onCloseButtonPressed={function noRefCheck() {
                        setAddressModalVisible(false)
                    }}
                    onOk={() => {
                        setAddressModalVisible(false)
                        fetchData(inputAddrValue)
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
