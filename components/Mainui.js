import { useMoralis } from "react-moralis"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button, Widget, Loading, useNotification, Modal, Icon, Typography, Input } from "web3uikit"

export default function MainUI() {
    //chainId is the id of the chain connected to and account is the address of the wallet connected to handeled internally by Moralis-SDK
    const { chainId, account } = useMoralis()

    //To dispatch the notification on bottom right of the screen using web3uikit
    const dispatch = useNotification()

    //Name of chain for corresponding chainId. Supporting only ethereum and polygon
    const chainIdNameMap = {
        "0x1": "ethereum",
        "0x89": "polygon",
    }

    //React state variable - which stores the V2 positions value
    const [v2Balance, setV2Balance] = useState("-")

    //React state variable - which stores the V3 positions value
    const [v3Balance, setV3Balance] = useState("-")

    //React state variable - which tells wthether to show loading or not in the V2 positions value
    const [v2loading, setV2Loading] = useState(false)

    //React state variable - which tells wthether to show loading or not in the V3 positions value
    const [v3loading, setV3Loading] = useState(false)

    //React state variable - Input value user enters in the address modal
    const [inputAddrValue, setInputAddrValue] = useState("")

    const [showingAddress, setShowingAddress] = useState("")

    //React state varibale to toggle the Modal(which asks user to enter an address to serach for) visiblity
    const [addressModalVisible, setAddressModalVisible] = useState(false)

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

    //Function to get the V2 & V3 positions value to show the worth
    const getValue = async (userAddress, appID) => {
        try {
            if (
                chainId === undefined ||
                chainId === null ||
                chainIdNameMap[chainId] === null ||
                chainIdNameMap[chainId] === undefined
            ) {
                return
            }
            appID === "uniswap-v2" ? setV2Loading(true) : setV3Loading(true)
            const response = await fetch(`/api/lpV2/${appID}/${userAddress}/ethereum`)
            const data = await response.json()
            console.log(data)

            if (data.error || (data.data && data.data === "error")) {
                appID === "uniswap-v2" ? setV2Loading(false) : setV3Loading(false)
                return
            } else if (data.balances[userAddress.toLowerCase()].error) {
                const params = {
                    type: "error",
                    message: data.balances[userAddress.toLowerCase()].error.message,
                    title: "Total Postions Value V2+V3",
                }
                handleNewNotification(params)
                appID === "uniswap-v2" ? setV2Loading(false) : setV3Loading(false)
                return
            } else {
                appID === "uniswap-v2"
                    ? setV2Balance(data.balances[userAddress.toLowerCase()].meta[0].value)
                    : setV3Balance(data.balances[userAddress.toLowerCase()].meta[0].value)
                appID === "uniswap-v2" ? setV2Loading(false) : setV3Loading(false)
            }
        } catch (error) {
            const params = {
                type: "error",
                message: error,
                title: "Unexpected error",
            }
            handleNewNotification(params)
        }
    }

    const getAccountValue = async (accountAddr) => {
        setShowingAddress(accountAddr)
        getValue(accountAddr, "uniswap-v2")
        getValue(accountAddr, "uniswap-v3")
    }

    //React hook to get the V2 & V3 positions value
    useEffect(() => {
        if (account === undefined || account === null || account === "") {
            return
        }
        getAccountValue(account)
    }, [account])

    return (
        <div>
            <div className="flex justify-end">
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
            {account !== null && chainId !== null ? (
                <div>
                    <div className="grid gap-5 pt-5">
                        <div className="flex gap-5">
                            <Widget info={showingAddress} title="Wallet Address" />
                        </div>
                        <div className="flex gap-5">
                            <Widget
                                key="v2Bal"
                                info={
                                    v2loading ? (
                                        <div className="grid pt-3">
                                            <div>
                                                {/* Loading animation to show while fetching data */}
                                                <Loading
                                                    fontSize={20}
                                                    size={30}
                                                    spinnerColor="#2E7DAF"
                                                    spinnerType="loader"
                                                    text="Loading..."
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        "$ " +
                                        v2Balance
                                            .toLocaleString("en-US", {
                                                minimumFractionDigits: 3,
                                            })
                                            .replace(/\.0+$/, "")
                                    )
                                }
                                title="Uniswap V2 Positions Value"
                            />
                            <Widget
                                key="v3Bal"
                                info={
                                    v3loading ? (
                                        <div className="grid pt-3">
                                            <div>
                                                {/* Loading animation to show while fetching data */}
                                                <Loading
                                                    fontSize={20}
                                                    size={30}
                                                    spinnerColor="#2E7DAF"
                                                    spinnerType="loader"
                                                    text="Loading..."
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        "$ " +
                                        v3Balance
                                            .toLocaleString("en-US", {
                                                minimumFractionDigits: 3,
                                            })
                                            .replace(/\.0+$/, "")
                                    )
                                }
                                title="Uniswap V3 Postions Value"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-1">
                        <Image src="/zapper.svg" alt="zapper Logo" width={120} height={30} />
                    </div>
                    <div className="ml-4 justify-center">
                        {/* <div className="flex">
                            <Tooltip
                                content={`All NFTs in the wallet ${account} on ${chainIdNameMap[chainId]} blockchain`}
                                position="right"
                            >
                                <Icon fill="#68738D" size={25} svg="helpCircle" />
                            </Tooltip>
                        </div> */}
                        {/* as of now shows all the ethereum NFTs of the wallet on the chain connected to */}
                        {/* <NFTBalance chain={chainId} address={account} /> */}
                    </div>
                </div>
            ) : (
                <div className="flex justify-center font-bold text-2xl text-blue-400">
                    Connect to the Wallet using "Connect Wallet" button above
                </div>
            )}
            <div className={`w-full h-full fixed z-30 ${addressModalVisible ? "" : "hidden"}`}>
                {/* Modal to ask user to enter an address to search V2-LP position for*/}
                <Modal
                    id="addressModal"
                    isVisible={addressModalVisible}
                    hasCancel={false}
                    okText="Check V2 Postions"
                    onCloseButtonPressed={function noRefCheck() {
                        setAddressModalVisible(false)
                    }}
                    onOk={() => {
                        setAddressModalVisible(false)
                        getAccountValue(inputAddrValue)
                    }}
                    title={
                        <div style={{ display: "flex", gap: 10 }}>
                            <Icon fill="#68738D" size={28} svg="edit" />
                            <Typography color="#68738D" variant="h3">
                                Enter any valid address to know the value
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
