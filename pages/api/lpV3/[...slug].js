async function getV3Positions(req, res) {
    const { slug } = req.query
    const headers = new Headers()
    headers.set("Accept", "application/json")
    headers.set("X-API-Key", process.env.NEXT_PUBLIC_MORALIS_API_KEY)
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
