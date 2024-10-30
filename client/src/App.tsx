import React from 'react';
import {NewsTiNAO} from "./components/NewsTiNAO/NewsTiNAO";
import {ComparativeStatistic} from "./components/ComparativeStatistic/ComparativeStatistic";
import './App.css';


export const App = () => {
    return (
        <div className={"app-container"}>
            <div className={"app"}>
                <NewsTiNAO/>
                <ComparativeStatistic/>
            </div>
        </div>
    );
}
