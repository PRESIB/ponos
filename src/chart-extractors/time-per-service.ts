import { injectable } from "inversify";
import { ProductionCicle } from "../entities/production-cicle";
import chartistSvg = require('chartist-svg');
import * as moment from "moment";


@injectable()
export class TimePerService {

    timesPerService(data: ProductionCicle[]) {
        const resultTimes: Map<string, Times> = new Map();

        data.forEach(item => {
            
            const time: Times = {} as Times;
            time.serviceRequest = (moment(item.endServiceRequest, "").diff(moment(item.startServiceRequest))) / 60000 ; //;((new Date(item.endServiceRequest)).getMilliseconds() - (new Date(item.startServiceRequest)).getMilliseconds());
            if (item.isForWarehouse) {
                time.serviceExecution = (moment(item.endTransport).diff(moment(item.startTransport))) /60000;
            } else {
                time.serviceExecution = (moment(item.endService).diff(moment(item.startService))) /60000;
            }

            if (!resultTimes.has(item.service)) {
                resultTimes.set(item.service, time);
            } else {
                const savedTimes = resultTimes.get(item.service);
                savedTimes.serviceExecution += time.serviceExecution;
                savedTimes.serviceRequest += time.serviceRequest;
            }
            if (!item.isForWarehouse) {
                const transportTimes: Times = {} as Times;
                transportTimes.serviceRequest = (moment(item.endTransportRequest).diff(moment(item.startTransportRequest))) /60000;
                time.serviceExecution = (moment(item.endTransport).diff(moment(item.startTransport))) /60000;
                if (!resultTimes.has(item.transportService)) {
                    resultTimes.set(item.transportService, transportTimes);
                } else {
                    const savedTransportTimes = resultTimes.get(item.transportService);
                    savedTransportTimes.serviceExecution += transportTimes.serviceExecution;
                    savedTransportTimes.serviceRequest += transportTimes.serviceRequest;
                }
            }

        });

        var chartData = {
            title: 'Tempos por serviço',
            labels: Array.from(resultTimes.keys()),
            series: [
              Array.from(resultTimes.values()).map(item => item.serviceExecution),
              Array.from(resultTimes.values()).map(item => item.serviceRequest)
            ]
          };
          var options = {
            css: '.ct-chart-bar .ct-series .ct-point { stroke: green; }',
            axisX: {
                labelInterpolationFnc: function(value, index) {
                  return index % 2 === 0 ? value : null;
                }
            }
          };
          return chartistSvg('bar', chartData, options);
    


        
    }






}

interface Times {
    serviceRequest: number;
    serviceExecution: number;
}