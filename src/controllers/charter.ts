import chartistSvg = require('chartist-svg');
import { time } from 'console';
import { TimePerService } from '../chart-extractors/time-per-service';
import { ProductionCicle } from '../entities/production-cicle';
import { ponoContainer } from '../inversify.config';
import { FileManager } from './file-manager';

// tempos por serviço // barras
// soma dos tempos por serviço //pie chart

// tempos por iteração // tabela

// total de tempo de execução e de transporte e diferença para o total  // pie chart


// tempo de execução por rh // barras
// soma dos tempos de execução por rh //pie chart


// qual o rh  mais usado por serviço // tabela
// rh mais usado // barras


// destribuição dos ph por transporte e maquina (grafico de linhas temporal com quantos estão a ser transportados e quantos estão a ser produzidos [duas series])

// tabela
// sequencia de execução (a orden no array) VS sequencia de inico  (ordenado pelo step)



export default (): void => {

    const fileManager = ponoContainer.get<FileManager>(FileManager);
    const timeCharter = ponoContainer.get<TimePerService>(TimePerService);

    fileManager.loadProductionSteps().forEach(item => {
        const content:ProductionCicle[] = JSON.parse(fileManager.stepFileContent(item).toString());
        timeCharter.timesPerService(content).then(svg => fileManager.saveChart(svg, 'times_per_Service', item));
    })


   /* var data = {
        title: 'Time to play PUBG',
        subtitle: 'Player Unknown\'s Battleground',
        labels: ['P', 'U', 'B', 'G'],
        series: [
          [1, 2, 3, 4],
          [3, 4, 5, 6]
        ]
      };
      var options = {
        css: '.ct-chart-line .ct-series .ct-point { stroke: green; }'
      };
      chartistSvg('line', data, options).then(svg => console.log(svg));*/
}