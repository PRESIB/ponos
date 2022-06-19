import { injectable } from "inversify";
import { ProductionCicle } from "../entities/production-cicle";
import chartistSvg = require('chartist-svg');
import * as moment from "moment";
import { Parser } from "json2csv";


@injectable()
export class TimePerService {

    timesPerService(data: ProductionCicle[]) {
        const resultTimes: Map<string, Times> = new Map();

        data.forEach(item => {

            const time: Times = {} as Times;
            time.serviceRequest = (moment(item.endServiceRequest, "").diff(moment(item.startServiceRequest))) / 60000; //;((new Date(item.endServiceRequest)).getMilliseconds() - (new Date(item.startServiceRequest)).getMilliseconds());
            if (item.isForWarehouse) {
                time.serviceExecution = (moment(item.endTransport).diff(moment(item.startTransport))) / 60000;
            } else {
                time.serviceExecution = (moment(item.endService).diff(moment(item.startService))) / 60000;
            }

            if (!resultTimes.has(item.service)) {
                time.service = item.service;
                resultTimes.set(item.service, time);
            } else {
                const savedTimes = resultTimes.get(item.service);
                savedTimes.serviceExecution += time.serviceExecution;
                savedTimes.serviceRequest += time.serviceRequest;
            }
            if (!item.isForWarehouse) {
                const transportTimes: Times = {} as Times;
                transportTimes.serviceRequest = (moment(item.endTransportRequest).diff(moment(item.startTransportRequest))) / 60000;
                transportTimes.serviceExecution = (moment(item.endTransport).diff(moment(item.startTransport))) / 60000;
                if (!resultTimes.has(item.transportService)) {
                    transportTimes.service = item.transportService;
                    resultTimes.set(item.transportService, transportTimes);
                } else {
                    const savedTransportTimes = resultTimes.get(item.transportService);
                    savedTransportTimes.serviceExecution += transportTimes.serviceExecution;
                    savedTransportTimes.serviceRequest += transportTimes.serviceRequest;
                }
            }

        });

       return resultTimes;



    }

    totalTimes(content: ProductionCicle[]) {
        const result: TotalTimes = {
        execution: 0,
        remaining: 0,
        total: 0,
        transport: 0
        } as TotalTimes;

        content.forEach(item => {
            const temp: TotalTimes = {} as TotalTimes;
            const mainStart = item.startServiceRequest;
            let mainEnd;
            if (item.isForWarehouse) {
                mainEnd = item.endTransport;
                temp.execution = (moment(item.endTransport).diff(moment(item.startTransport))) / 60000;
                temp.transport = 0;

            } else {
                mainEnd = item.endService;
                temp.execution = (moment(item.endService).diff(moment(item.startService))) / 60000;
                temp.transport = (moment(item.endTransport).diff(moment(item.startTransport))) / 60000;
            }

            temp.total = moment(mainEnd).diff(moment(mainStart)) / 60000;
            temp.remaining = temp.total - (temp.execution + temp.transport);

            result.execution += temp.execution;
            result.remaining += temp.remaining;
            result.total += temp.total;
            result.transport += temp.transport;


        });

        return result;

        

    }

}

export interface Times {
    service: string;
    serviceRequest: number;
    serviceExecution: number;
}

export interface TotalTimes {
    execution: number;
    transport: number;
    remaining: number;
    total: number
}

