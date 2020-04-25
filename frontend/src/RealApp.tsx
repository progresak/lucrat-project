import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import MyChart from './MyChart';

const DATA = gql`
    {
        getAllData {
            timestamp
            bid
            ask
        }
    }
`;
// const TICKS_SUBSCRIPTION = gql`
//     subscription onTickAdded($repoFullName: String!){
//       tickAdded(){
//         timestamp
//         ask
//         bid
//       }
// }`;

interface Tick {
    timestamp: number;
    ask: number;
    bid: number;
}
interface BooksQueryResult {
    getAllData?: Array<Tick>;
}


const RealApp = () => {
    const { loading, error, data } = useQuery<BooksQueryResult, 'books'>(DATA);
    // const { data: { onTickAdded }, loading:  } = useSubscription(
    //     TICKS_SUBSCRIPTION
    // );
    // console.log(onTickAdded)
    if (loading) {
        return <span>Loading...</span>;
    }

    if (error) {
        return  <span>Error </span>;
    }
    if (!data || !data.getAllData) {
        return <span>Data missing </span>;
    }

    const { getAllData } = data;
    console.log({getAllData})
    return (<MyChart data={getAllData}/>)
};

export default RealApp;
