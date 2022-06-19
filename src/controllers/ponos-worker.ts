import { inject, injectable } from "inversify";
import { LineParser } from "../entities/line-parser";
import { ProductionCicle } from "../entities/production-cicle";

@injectable()
export class PonosWorker {
    private filesToParse: string[];
    @inject(LineParser) private lineParser: LineParser
    @inject(ProductionCicle) private prodStep: ProductionCicle

    constructor() {
        this.filesToParse = [];
    }


    addFile(file: string) {
        this.filesToParse.push(file);
    }

    get listFiles(): string[] {
        return this.filesToParse.filter((x, i) => i === this.filesToParse.indexOf(x));
    }

    extractProductionSteps(fileContent: Buffer) {
        const lines = fileContent.toString().split("\n");

        const stepsInProcess: Map<string, ProductionCicle> = new Map();

        const stepsProcessed: ProductionCicle[] = []
        let count = 0;
        lines.forEach(item => {
            if (item.indexOf(LineParser.START_REQUEST_SERVICE) > 0) {
                
                const info = this.lineParser.startServiceRequestParser(item);

                if (!stepsInProcess.has(info.ph)) {
                    count++;
                    stepsInProcess.set(info.ph, {
                        ph: info.ph,
                        step: count,
                        startServiceRequest: info.service != LineParser.TRANSPORT_SERVICE ? info.start : '',
                        startTransportRequest: info.service == LineParser.TRANSPORT_SERVICE ? info.start : '',
                        service: info.service != LineParser.TRANSPORT_SERVICE ? info.service : '',
                        transportService: info.service == LineParser.TRANSPORT_SERVICE ? info.service : '',
                        isForWarehouse: info.service == LineParser.TRANSFER_TO_WAREHOUSE
                    } as ProductionCicle);
                } else {
                    const step = stepsInProcess.get(info.ph);
                    step.startServiceRequest = info.service != LineParser.TRANSPORT_SERVICE ? info.start : step.startServiceRequest;
                    step.startTransportRequest = info.service == LineParser.TRANSPORT_SERVICE ? info.start : step.startTransportRequest;
                    step.service = info.service != LineParser.TRANSPORT_SERVICE ? info.service : step.service;
                    step.transportService = info.service == LineParser.TRANSPORT_SERVICE ? info.service : step.transportService;
                }


            } else if (item.indexOf(LineParser.END_REQUEST_SERVICE) > 0) {
                const info = this.lineParser.endServiceRequestParser(item);
                const step = stepsInProcess.get(info.ph);
                if ((!step.endTransportRequest || step.endTransportRequest?.length <= 0) && info.service == LineParser.TRANSPORT_SERVICE) {
                    step.endTransportRequest = info.end;
                } else if ((!step.endServiceRequest || step.endServiceRequest?.length <= 0) && info.service != LineParser.TRANSPORT_SERVICE) {
                    step.endServiceRequest = info.end;
                }


            } else if (item.indexOf(LineParser.START_SERVICE) > 0) {
                const info = this.lineParser.startServiceParser(item);
                if (info) {
                    const step = stepsInProcess.get(info.ph);
                    if (step) {
                        if (!step.rhtId || step.rhtId.length <= 0) {
                            step.rhtId = info.rhId;
                            step.startTransport = info.start;
                        } else if ((!step.rhmId || step.rhmId.length <= 0) && step.rhtId != info.rhId) {
                            step.rhmId = info.rhId;
                            step.startService = info.start;
                        }
                    }
                }
            } else if (item.indexOf(LineParser.END_SERVICE) > 0) {
                const info = this.lineParser.endServiceParser(item);
                let isFinish = false;
                if (stepsInProcess.has(info.ph)) {
                    const step = stepsInProcess.get(info.ph);
                    if (!step.endTransport || step.endTransport.length <= 0) {
                        step.endTransport = info.end;
                        if (step.isForWarehouse) {
                            isFinish = true;
                        }
                    } else if ((!step.endService || step.endService.length <= 0) && step.rhmId) {
                        step.endService = info.end;
                        isFinish = true;
                    }
                    if (isFinish) {
                        stepsInProcess.delete(info.ph);
                        stepsProcessed.push(step);
                    }

                } 

            }
        })

        return stepsProcessed;
    }

}