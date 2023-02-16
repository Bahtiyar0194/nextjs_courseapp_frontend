import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
          <link type="image/x-icon" rel="shortcut icon" href="/favicon.ico"></link>
          <link type="image/png" sizes="16x16" rel="icon" href="/favicon-16x16.png"></link>
          <link type="image/png" sizes="32x32" rel="icon" href="/favicon-32x32.png"></link>
          <link type="image/png" sizes="96x96" rel="icon" href="/favicon-96x96.png"></link>
          <link type="image/png" sizes="192x192" rel="icon" href="/android-icon-192x192.png"></link>

          <link sizes="57x57" rel="apple-touch-icon" href="/apple-touch-icon-57x57.png"></link>
          <link sizes="60x60" rel="apple-touch-icon" href="/apple-touch-icon-60x60.png"></link>
          <link sizes="72x72" rel="apple-touch-icon" href="/apple-touch-icon-72x72.png"></link>
          <link sizes="76x76" rel="apple-touch-icon" href="/apple-touch-icon-76x76.png"></link>
          <link sizes="114x114" rel="apple-touch-icon" href="/apple-touch-icon-114x114.png"></link>
          <link sizes="120x120" rel="apple-touch-icon" href="/apple-touch-icon-120x120.png"></link>
          <link sizes="144x144" rel="apple-touch-icon" href="/apple-touch-icon-144x144.png"></link>
          <link sizes="152x152" rel="apple-touch-icon" href="/apple-touch-icon-152x152.png"></link>
          <link sizes="180x180" rel="apple-touch-icon" href="/apple-touch-icon-180x180.png"></link>
          <meta name="theme-color" content="#fff" />
        </Head>
        <body className="indigo">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;