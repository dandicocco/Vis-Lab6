
import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv('unemployment.csv', d3.autoType).then(data=>{

    console.log('data', data);    

    //calculate total unemployment
    let r, item;
    for (r = 0; r < data.length; r++){
        let Total = 0;
        for (item in data[r]){
            if (item != "date"){
            Total = Total + data[r][item];
            }
         }
         data[r].total = Total;
     }
 
    console.log(data); //verify it's been added


    const stackChart = StackedAreaChart(".chart-container1");

    stackChart.update(data);

    const areaChart = AreaChart(".chart-container2");

    areaChart.update(data);  
    //brush to affect stackChart
    areaChart.on("brushed", (range)=>{
        stackChart.filterByDate(range); 
    })
})


