import { useMoralis } from "react-moralis"
import { globalUserAddress } from "../pages/userAddress"
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
    const [v2Balance, setV2Balance] = useState(0)

    //React state variable - which stores the V3 positions value
    const [v3Balance, setV3Balance] = useState(0)

    //React state variable - which tells wthether to show loading or not in the V2 positions value
    const [v2loading, setV2Loading] = useState(false)

    //React state variable - which tells wthether to show loading or not in the V3 positions value
    const [v3loading, setV3Loading] = useState(false)

    //React state variable - Input value user enters in the address modal
    const [inputAddrValue, setInputAddrValue] = useState("")

    //React state variable - which gives the address the UI data is showing
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

    //Function which sets the data to display in the notification and triggers handleNewNotification to dispatch
    const setNotification = (type, message, title) => {
        const params = {
            type: type,
            message: message,
            title: title,
        }
        handleNewNotification(params)
    }

    //Function to get the V2 & V3 positions value to show the worth
    const getValue = async (userAddress, appID) => {
        if (userAddress === undefined || userAddress === null || userAddress === "") {
            setNotification("error", "Please enter an address", "Total Positions Value V2+V3")
            return
        } else if (userAddress.toLowerCase() === showingAddress.toLowerCase()) {
            return
        }
        if (userAddress.length !== 42) {
            setNotification("error", "Please enter a valid address", "Total Positions Value V2+V3")
            return
        }
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
            setV2Balance(0)
            setV3Balance(0)
            const response = await fetch(`/api/lpV2/${appID}/${userAddress}/ethereum`)
            const data = await response.json()
            if (data.error || (data.data && data.data === "error")) {
                appID === "uniswap-v2" ? setV2Loading(false) : setV3Loading(false)
                return
            } else if (data.balances[userAddress.toLowerCase()].error) {
                setNotification(
                    "error",
                    data.balances[userAddress.toLowerCase()].error.message,
                    "Total Positions Value V2+V3"
                )
                appID === "uniswap-v2" ? setV2Loading(false) : setV3Loading(false)
                return
            } else {
                appID === "uniswap-v2"
                    ? setV2Balance(data.balances[userAddress.toLowerCase()].meta[0].value)
                    : setV3Balance(data.balances[userAddress.toLowerCase()].meta[0].value)
                appID === "uniswap-v2" ? setV2Loading(false) : setV3Loading(false)
            }
        } catch (error) {
            setNotification("error", error, "Unexpected error")
        }
    }

    //Function to make the individual function callsto get the V2 & V3 positions values
    const getAccountValue = async (accountAddr) => {
        setShowingAddress(accountAddr)
        globalUserAddress = accountAddr
        getValue(accountAddr, "uniswap-v2")
        getValue(accountAddr, "uniswap-v3")
    }

    //Function which returns Loading Spinner
    const getLoadingSpinner = () => {
        return (
            // Loading animation to show while fetching data
            <Loading
                fontSize={20}
                size={40}
                spinnerColor="#2E7DAF"
                spinnerType="loader"
                text="Loading..."
            />
        )
    }

    //Function which returns the UI widget to show V2 and V3 positions value
    const getWidget = (title, load, bal, keyId) => {
        return (
            <Widget
                key={keyId}
                info={
                    load ? (
                        <div className="grid pt-3">
                            <div>{getLoadingSpinner()}</div>
                        </div>
                    ) : (
                        "$ " +
                        bal
                            .toLocaleString("en-US", {
                                minimumFractionDigits: 3,
                            })
                            .replace(/\.0+$/, "")
                    )
                }
                title={title}
            />
        )
    }

    //Function to reset to own wallet UI data
    const onOwnWalletButtonClick = () => {
        globalUserAddress = ""
        getAccountValue(account)
    }

    //Function to show the modal which asks user to enter different address to search for
    const onCheckDiffAddrButtonClick = () => {
        setAddressModalVisible(true)
    }

    //Function which returns the buttons depending on the ID of the button
    const getButton = (givenId, text) => {
        return (
            <Button
                id={givenId}
                onClick={() => {
                    givenId === "checkOwnAddr"
                        ? onOwnWalletButtonClick()
                        : onCheckDiffAddrButtonClick()
                }}
                text={text}
                theme="secondary"
                type="button"
            />
        )
    }

    //React hook to get the V2 & V3 positions value
    useEffect(() => {
        if (
            globalUserAddress === undefined ||
            globalUserAddress === null ||
            globalUserAddress === ""
        ) {
            if (account === undefined || account === null || account === "") {
                return
            }
            getAccountValue(account)
        } else getAccountValue(globalUserAddress)
    }, [account])

    return (
        <div>
            {account !== null && chainId !== null ? (
                <div>
                    <div className="flex justify-between">
                        <div></div>
                        <div>
                            {/* Button which enables usser to check different address than connect */}
                            {globalUserAddress !== "" && globalUserAddress !== account
                                ? getButton("checkOwnAddr", "Check for connected wallet")
                                : null}
                        </div>
                        <div>
                            {/* Button which enables usser to check different address than connect */}
                            {getButton("checkOtherAddr", "Check different address")}
                        </div>
                    </div>

                    <div>
                        <div className="grid gap-5 pt-5">
                            <div className="flex gap-5">
                                <Widget info={showingAddress} title="Wallet Address" />
                            </div>
                            <div className="flex gap-5">
                                <Widget
                                    info={
                                        "$ " +
                                        (v2Balance + v3Balance)
                                            .toLocaleString("en-US", {
                                                minimumFractionDigits: 3,
                                            })
                                            .replace(/\.0+$/, "")
                                    }
                                    title="Total value(V2+V3 Positions)"
                                />
                            </div>
                            <div className="flex gap-5">
                                {getWidget(
                                    "Uniswap V2 Positions Value",
                                    v2loading,
                                    v2Balance,
                                    "v2Bal"
                                )}
                                {getWidget(
                                    "Uniswap V3 Positions Value",
                                    v3loading,
                                    v3Balance,
                                    "v3Bal"
                                )}
                            </div>
                        </div>
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
                    okText="Check total value"
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
