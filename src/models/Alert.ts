import { AlertTypes } from "@/models/AlertTypes";
import { ColorTypes } from "@/models/ColorTypes";

export interface Alert {
    type: AlertTypes;
    color: ColorTypes;
    title: string;
    text: string;
    visible: boolean;
    timeout: number;
}
