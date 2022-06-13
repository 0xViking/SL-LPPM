import { Tooltip, Loading, Icon, useNotification } from "web3uikit"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import Image from "next"

export default function lppositionV2() {
    const { chainId, account } = useMoralis()

    const appId = "uniswap-v2"

    const chainIdNameMap = {
        "0x1": "ethereum",
        "0x89": "polygon",
    }

    const options = {
        user: account,
        // user: "0x00e6f8d8fb80b0c302a6bd849b79982dc9945b15",
        chainId: chainId,
        appId: appId,
    }

    const dispatch = useNotification()

    const handleNewNotification = (params) => {
        dispatch({
            type: params.type,
            message: params.message,
            title: params.title,
            position: "bottomL",
            icon: params.icon,
        })
    }

    const fetchData = async () => {
        try {
            if (
                chainId === undefined ||
                chainId === null ||
                chainIdNameMap[chainId] === null ||
                chainIdNameMap[chainId] === undefined
            ) {
                const params = {
                    type: "error",
                    message: "This network is not supported",
                    title: "Uniswap LP Position V2",
                }
                handleNewNotification(params)
                setPositions([{}])
                return
            }

            const response = await fetch(
                `/api/lpV2/${options.appId}/${options.user}/${chainIdNameMap[options.chainId]}`
            )
            const data = await response.json()
            console.log(data)
            if (data.balances[options.user.toLowerCase()].error) {
                const params = {
                    type: "info",
                    message: data.balances[options.user.toLowerCase()].error.message,
                    title: "Uniswap LP Position V2",
                }
                handleNewNotification(params)
                setPositions([{}])
            } else if (data.balances[options.user.toLowerCase()].products.length === 0) {
                const params = {
                    type: "warning",
                    message: `No LP positions found on ${
                        chainIdNameMap[chainId] ? chainIdNameMap[chainId] : chainId
                    } chain for ${account}`,
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

    {
        /* LP Positions will update with an API call*/
    }
    const [poistions, setPositions] = useState([])

    useEffect(() => {
        fetchData()
    }, [account, chainId])

    return (
        <div>
            <div className="flex mt-10">
                <Tooltip
                    content={`Uniswap V2 Liquidity Position for the wallet address ${
                        options.user
                    } on ${chainIdNameMap[options.chainId]} blockchain`}
                    position="right"
                >
                    <Icon fill="#68738D" size={25} svg="helpCircle" />
                </Tooltip>
            </div>
            {poistions && poistions.length !== 0 ? (
                <div className="px-1 sm:px-1 lg:px-1">
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="flex justify-center items-center min-w-max py-2 md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg border-2 border-r-4 border-t-4 rounded-lg">
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
                                            {poistions[0].assets &&
                                                poistions[0].assets.map((position, index) => (
                                                    // +item.address,
                                                    <tr>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {index + 1}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {position.displayProps.label}
                                                            {"(" +
                                                                position.displayProps
                                                                    .secondaryLabel +
                                                                ")"}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {position.tokens[0].symbol}
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
                                                            {position.tokens[1].symbol}
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
