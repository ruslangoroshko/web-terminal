import { ImageTypeEnum } from '../enums/ImageTypeEnum'

export const getImageSource = (id: string, type = ImageTypeEnum.PNG) => {
    return `${API_STRING}/api/v1/images/instrument/${id}/${type}`
}