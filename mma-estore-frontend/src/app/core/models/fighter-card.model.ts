export interface FighterCardModel {

    id:string;

    firstName:string;

    lastName:string;

    nickname?:string;

    image:string;

    country:string;

    division:string;

    wins:number;

    losses:number;

    draws:number;

    isChampion:boolean;

}