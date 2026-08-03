export interface EventCardModel {

    id:string;

    title:string;

    banner:string;

    eventType:string;

    date:string;

    location:string;

    mainEvent:string;

    status:'Upcoming' | 'Live' | 'Completed';

}