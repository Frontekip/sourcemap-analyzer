import 'bootstrap/dist/css/bootstrap.min.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>React Native Source Map Analyzer</title>
      </Head>
      <style jsx global>{`
        body {
          background-color: #f8f9fa;
          min-height: 100vh;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp 