import { Container } from "inversify";
import { FileManager } from "./controllers/file-manager";
import { PonosWorker } from "./controllers/ponos-worker";
import { ProductionCicle } from "./entities/production-cicle";
import { LineParser } from "./entities/line-parser";
import { PonosConfig } from "./entities/ponos-config";
import { TimePerService } from "./chart-extractors/time-per-service";

const ponoContainer = new Container();
ponoContainer.bind<FileManager>(FileManager).toSelf().inSingletonScope();
ponoContainer.bind<PonosWorker>(PonosWorker).toSelf().inSingletonScope();
ponoContainer.bind<LineParser>(LineParser).toSelf().inSingletonScope();
ponoContainer.bind<ProductionCicle>(ProductionCicle).toSelf().inSingletonScope();
ponoContainer.bind<PonosConfig>(PonosConfig).toSelf().inSingletonScope();

ponoContainer.bind<TimePerService>(TimePerService).toSelf().inSingletonScope();

export {ponoContainer};