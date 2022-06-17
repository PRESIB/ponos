import * as fs from 'fs';
import * as hidefile from 'hidefile';
import { homedir } from 'os';
import path = require('path');


export default (): void => {
    const ponosResults = path.join(homedir(), 'ponosResults');
    const configFolder = path.join(homedir(), 'ponos');
    const hiddedpath = path.join(homedir(), '.ponos');

    if (!fs.existsSync(hiddedpath)) {
        try {
            fs.mkdirSync(configFolder);
            fs.mkdirSync(ponosResults);
            fs.writeFileSync(path.join(configFolder, '.config'), JSON.stringify({ "parse_output_folder": ponosResults }));
            hidefile.hideSync(configFolder);
            console.info(`Config file added in : ${hiddedpath}`)
        }
        catch (error) {
            console.error(error);
            console.debug('Program will terminate');
            process.exitCode = 1;
        }
    }
}