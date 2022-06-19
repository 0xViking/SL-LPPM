async function getV2Positions(req, res) {
    const { slug } = req.query
    const headers = new Headers()
    headers.set("Accept", "application/json")
    headers.set("X-API-Key", process.env.NEXT_PUBLIC_MORALIS_API_KEY)
    const url =
        slug.length > 1
            ? `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${slug[0]}&address=${slug[1]}&page=1&offset=100&startblock=0&endblock=27025780&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`
            : `https://deep-index.moralis.io/api/v2/${slug[0]}/erc20/transfers?chain=eth&limit=100`

    try {
        const response =
            slug.length > 1
                ? await fetch(url, {
                      method: "GET",
                  })
                : await fetch(url, {
                      method: "GET",
                      headers,
                  })
        const data = await response.json()
        if (data.data === "error") {
            throw "Unexpected Error"
        }
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(200).json(error)
    }
}

export default getV2Positions
