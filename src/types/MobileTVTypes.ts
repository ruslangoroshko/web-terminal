import { SeriesStyle } from '../vendor/charting_library/charting_library.min';

export interface MobileMessageModel {
    auth: string;
    type: string;
    instrument: string;
    interval: string;
    resolution: string;
    chart_type: SeriesStyle;
}