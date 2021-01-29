import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../component/header';

const AppComponet = ({ Component, pageProps, currentuser }) => {
  return (
    <div>
      <Header currentuser={currentuser}></Header>
      <div className="container">
        <Component currentuser={currentuser} {...pageProps}></Component>
      </div>
    </div>
  );
};

AppComponet.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentuser
    );
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponet;
