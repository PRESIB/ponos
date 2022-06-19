import { readFile, writeFile } from 'fs';
import { Parser } from 'json2csv';

const places = ['available machines',
    'products ready to be processed',
    'ready for machine',
    'in production',
    'negotiating with transporters',
    'product in transit',
    'available transporters',
    'warehouse'
]

const chunkSpliter = '-------- Synchronously --------';
const incrementRef = 'Putting';
const decrementRef = 'Removing';

const placeToMetricName = (place) => {
    let result = '';
    switch (place) {
        case 'available machines':
            result = 'avalMachines';
            break;
        case 'products ready to be processed':
            result = 'prodReadyToProcess';
            break;
        case 'ready for machine':
            result = 'readyforMachine';
            break;
        case 'in production':
            result = 'inProduction';
            break;
        case 'negotiating with transporters':
            result = 'negotiatingTransp';
            break;
        case 'product in transit':
            result = 'prodInTransit';
            break;
        case 'available transporters':
            result = 'avalTransp';
            break;
        case 'warehouse':
            result = 'warehouse';
            break;
    }
    return result;
}

const services = ['ms1', 'ms2', 'ms3'];

const extractServiceFromLine = (line) => {
    let serviceName = '';
    for (let i = 0; i < services.length; i++) {
        if (line.includes(services[i])) serviceName = services[i];
    }
    return serviceName;
}

const newMetric = () => {
    return {
        avalMachines: 0,
        prodReadyToProcess: 0,
        readyforMachine: 0,
        inProduction: 0,
        negotiatingTransp: 0,
        prodInTransit: 0,
        avalTransp: 0,
        warehouse: 0,
        ms1: 0,
        ms2: 0,
        ms3: 0
    }
}

const csvFields = [
    'avalMachines',
    'prodReadyToProcess',
    'readyforMachine',
    'inProduction',
    'negotiatingTransp',
    'prodInTransit',
    'avalTransp',
    'warehouse'
]

const csvOpts = { csvFields }

let stepMetric = [];



const stepsIntoMetrics = (steps) => {
    return steps.map(step => {
        const metric = newMetric();

        const stepMetrics = step.map(item => {
            let placeName = '';
            if (item.includes('playground')) { // only consider playgtround net
                for (let i = 0; i < places.length; i++) {
                    if (item.includes(places[i])) placeName = places[i];
                }
            }
            const placeNameMetric = placeToMetricName(placeName)
            return {
                name: placeNameMetric,
                value: item.includes(incrementRef) ? 1 : item.includes(decrementRef) ? -1 : 0,
                serviceName: placeNameMetric === 'readyforMachine' ? extractServiceFromLine(item) : '',
                serviceValue: placeNameMetric === 'readyforMachine' ? item.includes(incrementRef) ? 1 : item.includes(decrementRef) ? -1 : 0 : 0
            };
        })

        for (let i = 0; i < stepMetrics.length; i++) {
            if (metric.hasOwnProperty(stepMetrics[i].name)) {
                metric[stepMetrics[i].name] += stepMetrics[i].value;
                metric[stepMetrics[i].serviceName] = stepMetrics[i].serviceValue;
            }

        }

        return metric


    });
}

const agragateResults = (stepMetrics) => {
    let result = newMetric();

    return stepMetrics.map(element => {
        element.avalMachines += result.avalMachines
        element.prodReadyToProcess += result.prodReadyToProcess
        element.readyforMachine += result.readyforMachine
        element.inProduction += result.inProduction
        element.negotiatingTransp += result.negotiatingTransp
        element.prodInTransit += result.prodInTransit
        element.avalTransp += result.avalTransp
        element.warehouse += result.warehouse
        element.ms1 += result.ms1
        element.ms2 += result.ms2
        element.ms3 += result.ms3
        result = element
        return element
    });
}

readFile('./sources/simulation.log', (err, data) => {
    if (err) throw err;

    const lines = data.toString().split("\n");

    const steps = [];
    let j = 0;
    steps[j] = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(chunkSpliter))
            steps[++j] = [];
        else
            steps[j].push(lines[i])
    }


    stepMetric = stepsIntoMetrics(steps);

    /*const parser = new Parser(csvOpts);
    const agregated = agragateResults(stepMetric);
    const csv = parser.parse(agregated);

    //const csv = parser.parse(agragateResults(stepMetric));
    writeFile('result.csv', csv, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });*/


    console.log(agragateResults(stepMetric));
});
