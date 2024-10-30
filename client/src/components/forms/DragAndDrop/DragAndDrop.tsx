import {ChangeEvent, DragEvent, FC, useState} from "react";
import {Loader} from "../Loader/Loader";
import './DragAndDrop.css'


interface DragAndDropProps {
    isLoading?: boolean;
    onChange?: (data: FormData) => void;
}

export const DragAndDrop: FC<DragAndDropProps> = ({
                                                      onChange = () => {},
                                                      isLoading
                                                  }) => {

    const [drag, setDrag] = useState(false)

    const handleDrag = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setDrag(true)
    }

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setDrag(false)
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const files = [...event.dataTransfer.files]
        const filesFormData = new FormData()
        files.forEach((file) => filesFormData.append('files', file))
        setDrag(false)
        onChange(filesFormData)
    }

    const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const files: File[] = [...event.target.files as FileList]
        const filesFormData = new FormData()
        files.forEach((file) => filesFormData.append('files', file))
        onChange(filesFormData)
    }

    return (
        <div className={"drag-and-drop-container"}>
            {(isLoading) ?
                <div className={'loader-area'}>
                    <div className={'drag-and-drop-loader'}>
                        <Loader/>
                    </div>
                </div>
                :
                (drag) ?
                    <div
                        className={'drop-area'}
                        onDragStart={handleDrag}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className={'text-block'}>
                            Отпустите файлы, чтобы загрузить их
                        </div>
                    </div>
                    :
                    <div
                        className={'drag-area'}
                        onDragStart={handleDrag}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDrag}
                    >
                        <div className={'text-block'}>
                            Нажмите или перетащите файлы, чтобы загрузить их
                        </div>
                        <input
                            type={'file'}
                            className={'drag-input'}
                            multiple={true}
                            onInput={handleFileInput}
                        />
                    </div>

            }
        </div>
    )
}