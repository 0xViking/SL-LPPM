import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Head from "next/head"
import Layout from "../components/Layout"
function MyApp({ Component, pageProps }) {
    return (
        //{/* Moralis Provider to use use majority of WEB3 functions */}
        <MoralisProvider
            appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
            serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}
        >
            <Head>
                <title>Solidus Labs LPPM</title>
                <meta name="description" content="Liquidity Pool Position on UNISWAP" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Layout style to show Sidebar and Header in every view */}
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </MoralisProvider>
    )
}

export default MyApp
