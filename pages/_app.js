import '../assets/css/global.css';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store } from '../store/store';
export default function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <ThemeProvider attribute="class">
                <Component {...pageProps} />
            </ThemeProvider>
        </Provider>
    )
}