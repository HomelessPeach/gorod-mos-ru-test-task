import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {newsAPI} from "./services/NewsService";
import {statisticAPI} from "./services/StatisticService";

const rootReducer = combineReducers({
    [newsAPI.reducerPath]: newsAPI.reducer,
    [statisticAPI.reducerPath]: statisticAPI.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(
                newsAPI.middleware,
                statisticAPI.middleware,
            )
});

setupListeners(store.dispatch);