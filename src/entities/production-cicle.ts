import { injectable } from "inversify";

@injectable()
export class ProductionCicle{
    ph:string;
    step:number;
    service:string;
    rhmId:string
    transportService:string;
    rhtId:string;
    isForWarehouse:boolean = false;
    startService:string;
    endService:string;
    startTransport:string;
    endTransport:string;
    startServiceRequest:string;
    endServiceRequest:string;
    startTransportRequest:string;
    endTransportRequest:string;  
}