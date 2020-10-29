export function reportWebVitals(metric) {
    if (metric.label === 'custom') {
      console.log(metric);
    }
  }
  
  function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
  }
  
  export default MyApp;