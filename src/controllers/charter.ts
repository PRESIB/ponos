import chartistSvg = require('chartist-svg');
import { time } from 'console';
import { TimePerService, Times, TotalTimes } from '../chart-extractors/time-per-service';
import { ProductionCicle } from '../entities/production-cicle';
import { ponoContainer } from '../inversify.config';
import { FileManager } from './file-manager';
import { Parser } from 'json2csv';



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
         
        // tempos por iteração // tabela
       mainTable(content, item);
        

        // sum of times per service
        timesPerService(content, item);

        
      
       // total de tempo de execução e de transporte e diferença para o total  // pie chart
       totalTimes(content, item);

    })


function mainTable(content:ProductionCicle[], item:string){
    const parser = new Parser<ProductionCicle>();
    const csv = parser.parse(content);
    fileManager.saveTable(csv, 'procustion_steps', item);
}

function timesPerService(content:ProductionCicle[], item:string){
   const resultTimes = timeCharter.timesPerService(content)
    var chartData = {
        title: 'Tempos por serviço',
        labels: Array.from(resultTimes.keys()),
        series: [
          Array.from(resultTimes.values()).map(item => item.serviceExecution),
          Array.from(resultTimes.values()).map(item => item.serviceRequest)
        ]
      };
      var options = {
        css: '.ct-chart-bar .ct-series .ct-point { stroke: green; }',
        axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 2 === 0 ? value : null;
            }
        }
      };

      const parser = new Parser<Times>();
      const csv =  parser.parse(Array.from(resultTimes.values()));
      fileManager.saveTable(csv, 'times_per_Service', item);
      
      chartistSvg('bar', chartData, options).then(svg => fileManager.saveChart(svg,'times_per_Service', item ));

    
}


function totalTimes(content:ProductionCicle[], item:string){

   const resultTimes = timeCharter.totalTimes(content)
    var chartData = {
        title: `Total Time (in s): ${resultTimes.total}`,
        labels: ['Execution', 'Transport', 'Remaining'],
        series: [
          [
        resultTimes.execution, resultTimes.transport, resultTimes.remaining
          ]
        ]
      };
      var options = {
        css: '.ct-chart-bar .ct-series .ct-point { stroke: green; }',
        axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 2 === 0 ? value : null;
            }
        }
      };

      const parser = new Parser<TotalTimes>();
      const csv =  parser.parse(resultTimes);
      fileManager.saveTable(csv, 'total_times', item);
      
      chartistSvg('bar', chartData, options).then(svg => fileManager.saveChart(svg,'total_times', item ));

}
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