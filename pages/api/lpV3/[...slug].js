async function getV3Positions(req, res) {
    const { slug } = req.query
    const headers = new Headers()
    headers.set("Accept", "application/json")
    headers.set("X-API-Key", "DXfBWwxFrwS3HK0OGCz1gR7vvwgl3Lc7i8G7BgEhshqcr1656UnpCkssI523Dta9")
    // const url = `https://deep-index.moralis.io/api/v2/${account}/nft/${chainIdAddrMap[chainId]}?chain=${chainId}&format=decimal`
    const url = `https://deep-index.moralis.io/api/v2/${slug[0]}/nft/${slug[1]}?chain=${slug[2]}&format=decimal`

    try {
        const response = await fetch(url, {
            method: "GET",
            headers,
        })
        const data = await response.json()
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(200).json({ data: "error" })
    }
}

export default getV3Positions
