import { injectable } from "inversify";
import { ProductionCicle } from "./production-cicle";

@injectable()
export class LineParser {

    static START_REQUEST_SERVICE = 'start_request_service';
    static PROVIDER_READY = 'provider_ready';
    static END_REQUEST_SERVICE = 'end_request_service';
    static PROVIDER_SERVICE = 'provider_service';
    static START_SERVICE = 'start_service';
    static END_SERVICE = 'end_service';
    static TRANSFER_TO_WAREHOUSE = 'tr.warehouse';
    static TRANSPORT_SERVICE = 'transport';

    // 2022-06-18 15:47:04,558 INFO [simulation-thread-3] Playground [NativeMethodAccessorImpl.java:-2] start_request_service:productHolon[4]:serv1
    startServiceRequestParser(line: string) {
        const content = line.substring(line.indexOf(LineParser.START_REQUEST_SERVICE)).split(':');
        return {
            start: line.substring(0, line.indexOf('INFO')).trim(),
            ph: content[1].trim(),
            service: content[2].trim()
        }
    }

    // 2022-06-18 15:47:05,297 INFO [simulation-thread-3] Playground [NativeMethodAccessorImpl.java:-2] end_request_service:productHolon[4]:serv1
    endServiceRequestParser(line: string) {
        const content = line.substring(line.indexOf(LineParser.END_REQUEST_SERVICE)).split(':');
        return {
            ph: content[1].trim(),
            end: line.substring(0, line.indexOf('INFO')).trim(),
            service: content[2].trim()
        }
    }


    //2022-06-18 15:47:05,549 INFO [simulation-thread-3] Playground [NativeMethodAccessorImpl.java:-2] start_service:rht-001:productHolon[4]
    startServiceParser(line: string) {
        const content = line.substring(line.indexOf(LineParser.START_SERVICE)).split(':');
        if (content.length == 3) {
            return {
                ph: content[2].trim(),
                rhId: content[1].trim(),
                start: line.substring(0, line.indexOf('INFO')).trim()
            }
        } else {
            return null;
        }
    }

    // 2022-06-18 15:47:05,882 INFO [simulation-thread-3] Playground [NativeMethodAccessorImpl.java:-2] end_service:rht-001:productHolon[4]
    endServiceParser(line: string) {
        const content = line.substring(line.indexOf(LineParser.END_SERVICE)).split(':');
        return {
            ph: content[2].trim(),
            rhId: content[1].trim(),
            end: line.substring(0, line.indexOf('INFO')).trim()
        }
    }
}