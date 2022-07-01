import '../styles/globals.css';
import Layout from '../components/layout';
import type { AppProps } from 'next/app';
import Transition from '../components/Transition';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Transition>
        <Component {...pageProps} />
      </Transition>
    </Layout>
  )
}

export default MyApp;
