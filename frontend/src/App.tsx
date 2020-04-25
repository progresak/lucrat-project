import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from './providers/ApolloClient';
import RealApp from './RealApp';

const App = () => {
    return (
        <ApolloProvider client={ApolloClient}>
            {/*<Dashboard />*/}
            <RealApp />
        </ApolloProvider>
    );
};

export default App;
