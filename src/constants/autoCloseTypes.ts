import { AutoCloseTypesEnum } from './../enums/AutoCloseTypesEnum';

const autoCloseTypes = {
    [AutoCloseTypesEnum.Percent]: {
        name: "Percent",
        symbol: '%'
    },
    [AutoCloseTypesEnum.Price]: {
        name: "Price",
        symbol: '='
    },
    [AutoCloseTypesEnum.Profit]: {
        name: "Profit",
        symbol: '$'
    },
}

Object.freeze(autoCloseTypes)

export default autoCloseTypes