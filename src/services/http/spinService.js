import { BaseService } from "../../redux/reduxQuery";
import { apiUrl } from "../../utils/constants";

export const Spinservice = BaseService.injectEndpoints({
    endpoints: (builder) => ({
        getWheelData: builder.query({
            query: () => ({
                url: `${apiUrl}/offer`,
                method: 'get'
            })
        })
    })
})

export const { useGetWheelDataQuery } = Spinservice