import {FC} from "react";
import {Loader} from "../Loader/Loader";
import './Button.css'


interface ButtonProps {
    label?: string;
    width?: number;
    onClick?: () => void;
    isLoading?: boolean;
}

export const Button: FC<ButtonProps> = ({label = 'Кнопка', onClick, isLoading}) => {

    const handleClick = () => {
        onClick && onClick()
    }

    return (
        <div className={'button-container'}>
            <div
                className={(isLoading)? 'button-disabled' : "button"}
                onClick={(isLoading)? undefined : handleClick}
            >
                <div className={"button-label"}>
                    {label}
                </div>
                {(isLoading) &&
                    <div className={'button-loader'}>
                        <Loader/>
                    </div>
                }
            </div>
        </div>
    )
}