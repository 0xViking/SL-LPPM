async function getV2Positions(req, res) {
    const { slug } = req.query
    const headers = new Headers()
    headers.set("accept", "*/*")
    headers.set("authorization", process.env.NEXT_PUBLIC_ZAPPER_AUTHORIZATION)
    const url = `https://api.zapper.fi/v2/apps/${slug[0]}/balances?addresses%5B%5D=${slug[1]}&network=${slug[2]}`
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

export default getV2Positions
