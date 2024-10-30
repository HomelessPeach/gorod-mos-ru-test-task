import {Button} from "../forms/Button/Button";
import {useGetAllTiNAONewsExcelMutation} from "../../store/services/NewsService";
import './NewsTiNAO.css'


export const NewsTiNAO = () => {

    const [getAllTiNAONewsExcel, {isLoading}] = useGetAllTiNAONewsExcelMutation()

    const handleClick = () => {
        getAllTiNAONewsExcel({})
    }

    return (
        <div className={'news'}>
            <div className={'news-info'}>
                <div className={'news-title'}>
                    Новости о ТиНАО
                </div>
                <div className={'news-description'}>
                    Получение новостей, в которых упоминается ТиНАО с <a
                    href={'https://gorod.mos.ru/news'}>https://gorod.mos.ru/news</a>.
                    Информация будет представлена в виде:
                    <ul>
                        <li>заголовки;</li>
                        <li>краткое содержание;</li>
                        <li>дата публикации;</li>
                        <li>общее количество новостей;</li>
                        <li>количество просмотров по ним с распределением по месяцам.</li>
                    </ul>
                </div>
            </div>
            <Button label={'Получить информацию о ТиНАО'} onClick={handleClick} isLoading={isLoading}/>
        </div>
    )
}