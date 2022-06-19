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
        const fileName = `${this.extractFileName(origenFile)}.json`;
        this.saveFile(fileName, JSON.stringify(content));
    }

    loadProductionSteps(){
        return fs.readdirSync(path.normalize(this.config.parse_output_folder));
    }

    stepFileContent(file:string){
        return this.fileContent(path.join(this.config.parse_output_folder, file))
    }

    saveChart(content:string, prefix:string, origenFile:string){
        const fileName = `${prefix}_${this.extractFileName(origenFile)}.svg`;
        this.saveFile(fileName, content);
    }

    saveTable(content:string, prefix:string, origenFile:string){
        const fileName = `${prefix}_${this.extractFileName(origenFile)}.csv`;
        this.saveFile(fileName, content);
    }

    private saveFile(fileName:string, content: string){
        const destination = path.join(this.config.parse_output_folder, fileName);
        fs.writeFileSync(destination, content);
    }

    private extractFileName(origenFile:string):string{
        return `${origenFile.substring(origenFile.lastIndexOf(path.sep) || origenFile.lastIndexOf('.'))}_${Date.now()}` ;
    }


}