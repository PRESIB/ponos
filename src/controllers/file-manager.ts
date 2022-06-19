import * as fs from 'fs';
import { inject, injectable } from "inversify";
import path = require('path');
import { PonosConfig } from '../entities/ponos-config';
import { ProductionCicle } from '../entities/production-cicle';
import { IManager } from "../interfaces/interfaces";

@injectable()
export class FileManager implements IManager{
    @inject(PonosConfig) private config: PonosConfig

    exist(destination: string): boolean {
        return fs.existsSync(path.normalize(destination))
    }

    listDirectory(directory:string){
       return fs.readdirSync(path.normalize(directory));
    }

    fileContent(file:string){
        return fs.readFileSync(file)
    }

    saveProductionSteps(content:ProductionCicle[], origenFile:string){
        const fileName = this.extractFileName(origenFile);
        const destination = path.join(this.config.parse_output_folder, fileName);
        fs.writeFileSync(destination, JSON.stringify(content));
    }

    private extractFileName(origenFile:string):string{
        return `${origenFile.substring(origenFile.lastIndexOf(path.sep) || origenFile.lastIndexOf('.'))}_${Date.now()}.json` ;
    }
}