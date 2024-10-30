import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {apiUrl} from "./index";

export const statisticAPI = createApi({
    reducerPath: 'statisticApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${apiUrl}/statistic`
    }),
    endpoints: (build) => ({
        getComparativeStatistic: build.mutation({
            query: ({formData}) => ({
                url: `/comparative-statistic`,
                method: 'POST',
                body: formData,
                responseHandler: (async (response) => window.location.assign(window.URL.createObjectURL(await response.blob())))
            })
        })
    })
})

export const {
    useGetComparativeStatisticMutation,
} = statisticAPI