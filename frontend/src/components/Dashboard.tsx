import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const TOGGLE_SCRIPT = gql`
  mutation ToggleScript() {
    toggleScript() {
      isRunning
    }
  }
`;
const Dashboard = () => {
    const [toggleScript, { data }] = useMutation(TOGGLE_SCRIPT);

    return (
        <div>
            <h1>Dashboard</h1>
            <span>Script:</span>: {data.isRunning ? 'is running' : 'is stopped'}
            <button onClick={() => toggleScript()}>Start</button>
        </div>
    );
};

export default Dashboard;
