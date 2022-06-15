async function getV2Positions(req, res) {
    const { slug } = req.query

    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${slug[0]}&address=${slug[1]}&page=1&offset=100&startblock=0&endblock=27025780&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`
    try {
        const response = await fetch(url, {
            method: "GET",
        })
        const data = await response.json()
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(200).json(error)
    }
}

export default getV2Positions
