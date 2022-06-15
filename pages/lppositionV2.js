import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import {
    Tooltip,
    Loading,
    Button,
    Icon,
    useNotification,
    Modal,
    Typography,
    Table,
    Input,
    Tag,
} from "web3uikit"

export default function lppositionV2() {
    //chainId is the id of the chain connected to and account is the address of the wallet connected to handeled internally by Moralis-SDK
    const { chainId, account } = useMoralis()

    //To dispatch the notification on bottom right of the screen using web3uikit
    const dispatch = useNotification()

    //appId given by Zapper.fi API
    const appId = "uniswap-v2"

    //React state variable - This is an array which stores the LP positions of the address
    const [positions, setPositions] = useState([])

    //React state variable - This is an array which stores the History of Txns in the V2-LP pool for which the address has positions in
    const [tableData, setTableData] = useState([])

    //React state varibale to toggle the Modal(Which shows the Txn logs in the V2-LP pool) visiblity
    const [modalVisible, setModalVisible] = useState(false)

    //React state varibale to toggle the Modal(which asks user to enter an address to serach for) visiblity
    const [addressModalVisible, setAddressModalVisible] = useState(false)

    //React state variable - Input value user enters in the address modal
    const [inputAddrValue, setInputAddrValue] = useState("")

    //React state variable - The address which is searched for
    const [showingAddress, setShowingAddress] = useState("")

    //Name of chain for corresponding chainId. Supporting only ethereum and polygon
    const chainIdNameMap = {
        "0x1": "ethereum",
        "0x89": "polygon",
    }

    //options used to fetch the V2-LP positions of the address
    const options = {
        user: account,
        // user: "0x1d44f3bfc5b901c581886b940235cfb798ce4fc8",
        chainId: chainId,
        appId: appId,
    }

    //Function takes care of storing the value entered by the user in the address modal automatically
    const onInputChange = (event) => {
        const { value } = event.target
        setInputAddrValue(value)
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

    //Function takes care of fetching the V2-LP positions of the address
    const fetchData = async (addressGiven) => {
        if (addressGiven === undefined || addressGiven === null || addressGiven === "") {
            const params = {
                type: "error",
                message: "Please enter an address",
                title: "Uniswap LP Position V2",
                icon: "exclamation",
            }
            handleNewNotification(params)
            // setPositions([{}])
            return
        }
        addressGiven = addressGiven.toLowerCase().trim()
        if (addressGiven.length !== 42) {
            const params = {
                type: "error",
                message: "Please enter a valid address",
                title: "Uniswap LP Position V2",
                icon: "exclamation",
            }
            handleNewNotification(params)
            // setPositions([{}])
            return
        }
        options.user = addressGiven
        setShowingAddress(options.user)
        try {
            if (
                chainId === undefined ||
                chainId === null ||
                chainIdNameMap[chainId] === null ||
                chainIdNameMap[chainId] === undefined
            ) {
                const params = {
                    type: "error",
                    message: "Supports only Ethereum",
                    title: "Uniswap LP Position V2",
                }
                handleNewNotification(params)
                setPositions([{}])
                return
            }
            setPositions([])
            const response = await fetch(
                `/api/lpV2/${options.appId}/${options.user}/${chainIdNameMap[options.chainId]}`
            )
            const data = await response.json()
            console.log(data)
            if (data.error) {
                const params = {
                    type: "error",
                    message: data.error.message[0],
                    title: "Uniswap LP Position V2",
                }
                handleNewNotification(params)
                return
            } else if (data.balances[options.user.toLowerCase()].error) {
                const params = {
                    type: "info",
                    message: data.balances[options.user.toLowerCase()].error.message,
                    title: "Uniswap LP Position V2",
                }
                handleNewNotification(params)
                setPositions([{}])
            } else if (data.balances[options.user.toLowerCase()].products.length === 0) {
                setPositions([{}])
                const params = {
                    type: "warning",
                    message: `No LP positions found on ${
                        chainIdNameMap[chainId] ? chainIdNameMap[chainId] : chainId
                    } chain for ${options.user}`,
                    title: "Uniswap LP Position V2",
                }
                handleNewNotification(params)
                setPositions([{}])
            } else {
                const params = {
                    type: "success",
                    message: "LP positions found",
                    title: "Uniswap LP Position V2",
                }
                handleNewNotification(params)
                setPositions(data.balances[options.user.toLowerCase()].products)
            }
        } catch (error) {
            const params = {
                type: "error",
                message: error,
                title: "Unexpected error",
            }
            handleNewNotification(params)
            setPositions([{}])
        }
    }

    //Function to convert the unix timestamp to a human readable date
    const timeConverter = (UNIX_timestamp) => {
        var a = new Date(UNIX_timestamp * 1000)
        var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]
        var year = a.getFullYear()
        var month = months[a.getMonth()]
        var date = a.getDate()
        var hour = a.getHours()
        var min = a.getMinutes()
        var sec = a.getSeconds()
        var time = date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec
        return time
    }

    //Function to check if the txn is "to the address" given or "from the address" given
    const checkInOROut = (to) => {
        return showingAddress.toLowerCase() === to.toLowerCase() ? "IN" : "OUT"
    }

    //If its a IN display green else display red in the tag
    const checkColor = (to) => {
        return showingAddress.toLowerCase() === to.toLowerCase() ? "green" : "red"
    }

    //generates the URL in the txn logs
    const getURL = (user, address, contract_address) => {
        return address.toLowerCase() != user.toLowerCase()
            ? `https://etherscan.io/address/${address}`
            : `https://etherscan.io/token/${contract_address}?a=${user}`
    }

    //Function which fetches the Txn logs and triggers the Modal to display the logs as a table
    const showModal = async (contractAddr) => {
        try {
            setModalVisible(true)
            const resArr = []
            const response = await fetch(`/api/v2logs/${contractAddr}/${showingAddress}`)
            const data = await response.json()
            console.log(data)
            data.result.map((item) => {
                resArr.push([
                    <a
                        href={`https://etherscan.io/tx/${item.hash}`}
                        className="text-blue-400"
                        target="blank"
                    >
                        {item.hash.substring(0, 20) + "..."}
                    </a>,
                    timeConverter(item.timeStamp),
                    <Tooltip content={item.from} position="top">
                        <a
                            href={getURL(showingAddress, item.from, contractAddr)}
                            className="text-blue-400"
                            target="blank"
                        >
                            {item.from.substring(0, 20) + "..."}
                        </a>
                    </Tooltip>,
                    <div className="flex justify-center">
                        <Tag color={checkColor(item.to)} text={checkInOROut(item.to)} />
                    </div>,
                    <Tooltip content={item.to} position="left">
                        <a
                            href={getURL(showingAddress, item.to, contractAddr)}
                            className="text-blue-400"
                            target="blank"
                        >
                            {item.to.substring(0, 20) + "..."}
                        </a>
                    </Tooltip>,
                    (item.value / 1000000000000000000)
                        .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                        })
                        .replace(/\.0+$/, ""),
                ])
            })
            setTableData(resArr)
            console.log(tableData)
        } catch (error) {
            console.log(error)
        }
    }

    //Returns a list of txns in the LP pool as a table
    const getTable = () => {
        return (
            <Table
                columnsConfig="3fr 3fr 3fr 80px 3fr 80px"
                data={tableData}
                header={[
                    <span>Txn Hash</span>,
                    <span>Date</span>,
                    <span>From</span>,
                    "",
                    <span>To</span>,
                    <span>Quantity</span>,
                ]}
                isColumnSortable={[false, true, false, false]}
                maxPages={1}
                noPagination
                onPageNumberChanged={function noRefCheck() {}}
                pageSize={1}
            />
        )
    }

    //The "?" Icon which shows the dtails of user and chain the data is showing for
    const getToolTip = () => {
        return (
            <Tooltip
                content={`Uniswap V2 Liquidity Position for the wallet ${showingAddress} on ${
                    chainIdNameMap[options.chainId]
                } blockchain`}
                position="right"
            >
                <Icon fill="#68738D" size={25} svg="helpCircle" />
            </Tooltip>
        )
    }

    //React hook to fetch the V2-LP positions for the user whenever the user connect a wallet address or changes the chain
    useEffect(() => {
        fetchData(account)
    }, [account, chainId])

    return (
        <div>
            <div className="flex justify-between mt-16">
                {positions && positions.length !== 0 ? (
                    <div className="mt-2">
                        {/* the "?" ICON showed on the top left of the table which discribes the details */}
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
            {positions && positions.length !== 0 ? (
                <div className="px-1 sm:px-1 lg:px-1">
                    <div className="mt-2 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="flex justify-center items-center min-w-max py-2 md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg border-2 border-r-4 border-t-4 rounded-lg">
                                    {/* The table which displays the LP positions */}
                                    <table className="min-w-min divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    #
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                >
                                                    Liquidity Pool
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                >
                                                    Token 1
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Token 1 Balance
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                >
                                                    Token 2
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Token 2 Balance
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                >
                                                    Total Liquidity in Pool($)
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Fee %
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Your share
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {positions[0].assets &&
                                                positions[0].assets.map((position, index) => (
                                                    // +item.address,
                                                    <tr>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {index + 1}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <div className="flex justify-start">
                                                                <a
                                                                    className="mr-2 cursor-pointer cursor-hand"
                                                                    onClick={() => {
                                                                        showModal(position.address)
                                                                    }}
                                                                >
                                                                    <Icon
                                                                        fill="#68738D"
                                                                        size={20}
                                                                        svg="list"
                                                                    />
                                                                </a>
                                                                {position.displayProps.label}
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <div className="flex justify-start">
                                                                {position.tokens[0].symbol}
                                                                <img
                                                                    src={
                                                                        position.displayProps
                                                                            .images[0]
                                                                    }
                                                                    width={20}
                                                                    height={20}
                                                                    className="ml-1"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {position.tokens[0].balance.toLocaleString(
                                                                "en-US",
                                                                { minimumFractionDigits: 2 }
                                                            )}
                                                            {"($"}
                                                            {position.tokens[0].balanceUSD.toLocaleString(
                                                                "en-US",
                                                                { minimumFractionDigits: 2 }
                                                            )}
                                                            {")"}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <div className="flex justify-start">
                                                                {position.tokens[1].symbol}
                                                                <img
                                                                    src={
                                                                        position.displayProps
                                                                            .images[1]
                                                                    }
                                                                    width={20}
                                                                    height={20}
                                                                    className="ml-1"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {position.tokens[1].balance.toLocaleString(
                                                                "en-US",
                                                                { minimumFractionDigits: 2 }
                                                            )}
                                                            {"($"}
                                                            {position.tokens[1].balanceUSD.toLocaleString(
                                                                "en-US",
                                                                { minimumFractionDigits: 2 }
                                                            )}
                                                            {")"}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {position.displayProps.statsItems[0].value.value.toLocaleString(
                                                                "en-US",
                                                                { minimumFractionDigits: 2 }
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {position.displayProps.statsItems[2].value.value.toLocaleString(
                                                                "en-US",
                                                                { minimumFractionDigits: 2 }
                                                            )}
                                                            {"%"}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {position.displayProps.statsItems[3].value.value.toLocaleString(
                                                                "en-US",
                                                                { minimumFractionDigits: 2 }
                                                            )}
                                                            {"%($"}
                                                            {position.balanceUSD.toLocaleString(
                                                                "en-US",
                                                                { minimumFractionDigits: 2 }
                                                            )}
                                                            {")"}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid place-items-center h-screen w-full px-96 mr-60">
                    <div>
                        {/* Loading animation to show while fetching data */}
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
            {/* Modal to show txn logs in particular pool*/}
            <Modal
                id="LogsModal"
                isVisible={modalVisible}
                onCloseButtonPressed={function noRefCheck() {
                    setModalVisible(false)
                }}
                onOk={function noRefCheck() {}}
                hasFooter={false}
                title={
                    <div style={{ display: "flex", gap: 10 }}>
                        <Icon fill="#68738D" size={28} svg="list" />
                        <Typography color="#68738D" variant="h3">
                            Your Txns History in the pool
                        </Typography>
                    </div>
                }
            >
                {/* Table which shows txn logs in particular pool*/}
                {tableData && tableData.length > 1 ? (
                    <div className="pb-4">{getTable()}</div>
                ) : (
                    <div className="flex justify-center py-8">
                        {/* Shows Loading animation while fetching the Txn logs in the pool */}
                        <Loading
                            fontSize={20}
                            size={40}
                            spinnerColor="#2E7DAF"
                            spinnerType="loader"
                            text="Loading..."
                        />
                    </div>
                )}
            </Modal>
            <div>
                {/* Modal to ask user to enter an address to search V2-LP position for*/}
                <Modal
                    id="addressModal"
                    isVisible={addressModalVisible}
                    hasCancel={false}
                    okText="Check L2 Postions"
                    onCloseButtonPressed={function noRefCheck() {
                        setAddressModalVisible(false)
                        if (
                            positions &&
                            positions.length >= 1 &&
                            positions[0].assets &&
                            positions[0].assets.length <= 1
                        ) {
                            setPositions([{}])
                        }
                    }}
                    onOk={() => {
                        setAddressModalVisible(false)
                        fetchData(inputAddrValue)
                    }}
                    title={
                        <div style={{ display: "flex", gap: 10 }}>
                            <Icon fill="#68738D" size={28} svg="edit" />
                            <Typography color="#68738D" variant="h3">
                                Enter any valid address to get LP V2 Positions
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
