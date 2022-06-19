
import path = require("path");
import { ponoContainer } from "../inversify.config"
import { FileManager } from "./file-manager"
import { PonosWorker } from "./ponos-worker";

export default (options, command): void => {
    console.log(`parsing `, options)

    const fileManager = ponoContainer.get<FileManager>(FileManager);
    const worker = ponoContainer.get<PonosWorker>(PonosWorker);
    const destinationFile = options?.file;
    const desctinationDir = options?.directory;

    const isTest = options.test || false;

    if (isTest) {
        const referenceFile = '/presib/logs/hermes_ref_log.log';
        if (fileManager.exist(referenceFile))
            worker.addFile(referenceFile);
    }
    else {
        if (desctinationDir && fileManager.exist(desctinationDir))
            fileManager.listDirectory(desctinationDir).forEach(item => worker.addFile(path.join(desctinationDir,item)));

        if (destinationFile && fileManager.exist(destinationFile))
            worker.addFile(destinationFile)
    }

    worker.listFiles.forEach(item => {
        const content = worker.extractProductionSteps(fileManager.fileContent(item));
        fileManager.saveProductionSteps(content, item);
    })


}