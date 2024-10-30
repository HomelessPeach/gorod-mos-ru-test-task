import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {apiUrl} from "./index";

export const newsAPI = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${apiUrl}/news`
    }),
    endpoints: (build) => ({
        getAllTiNAONewsExcel: build.mutation({
            query: ({}) => ({
                url: `/TiNAO/excel`,
                method: 'POST',
                responseHandler: (async (response) => window.location.assign(window.URL.createObjectURL(await response.blob())))
            })
        })
    })
})

export const {
    useGetAllTiNAONewsExcelMutation,
} = newsAPI