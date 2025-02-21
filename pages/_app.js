import 'bootstrap/dist/css/bootstrap.min.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>React Native Source Map Analyzer</title>
      </Head>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
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