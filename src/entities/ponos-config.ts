import { injectable } from "inversify";

@injectable()
export class PonosConfig {
    public parse_output_folder:string
    
    factory(data:string){
        const temp = JSON.parse(data) as PonosConfig;
        this.parse_output_folder = temp.parse_output_folder;
    }
    
}