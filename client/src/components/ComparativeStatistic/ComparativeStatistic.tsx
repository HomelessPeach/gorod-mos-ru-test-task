import {DragAndDrop} from "../forms/DragAndDrop/DragAndDrop";
import {useGetComparativeStatisticMutation} from "../../store/services/StatisticService";
import './ComparativeStatistic.css'


export const ComparativeStatistic = () => {

    const [getComparativeStatistic, {isLoading}] = useGetComparativeStatisticMutation()

    const handleChange = (formData: FormData) => {
        getComparativeStatistic({formData})
    }

    return (
        <div className={'comparative-statistic'}>
            <div className={'comparative-statistic-info'}>
                <div className={'comparative-statistic-title'}>
                    Cравнительная статистика превышения регламентного срока в разрезе округов
                </div>
                <div className={'comparative-statistic-description'}>
                    Для получения статистики загрузите 2 файла excel.
                </div>
            </div>
            <DragAndDrop onChange={handleChange} isLoading={isLoading}/>
        </div>
    )
}