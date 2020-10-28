let coffeeData;
let type = document.querySelector("#group-by").value;
let sort = true;

// CHART INIT ------------------------------
//construct margin
const margin = ({top: 40, right: 40, bottom: 40, left: 40});
//construct SVG
const w = 650 - margin.left - margin.right,
h = 500 - margin.top - margin.bottom;

const svg = d3.select(".chart")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//create scales
const xScale = d3.scaleBand()
                .rangeRound([0, w])
                .paddingInner(0.1);

const yScale = d3.scaleLinear()
                .range([h, 0]);  //reversed because of SVG

// Create axes & axis title containers
svg.append("g")
.attr("class", "axis x-axis")
.attr("transform", `translate(0, ${h})`)

svg.append("g")
    .attr("class", "axis y-axis")
//       .attr("transform", `translate(0, ${h+margin.top/2})`)

// label y axis        
svg.append("text")
    .attr("class", "yLabel")
    .attr("text-anchor", "start")
    .attr('x', -margin.left)
    .attr('y', -5)
    // add attrs such as alignment-baseline and text-anchor as necessary



// CHART UPDATE FUNCTION -------------------
function update(coffeeData, type, sort){

    if (sort){
        coffeeData.sort((a,b) => b[type]-a[type]); //default sort desc
    }
    else{
        coffeeData.sort((a,b) => a[type]-b[type]); //click sort asc OR switch
    }


	// Update scale domains
    xScale.domain(coffeeData.map(d=>d.company))
    yScale.domain([0, d3.max(coffeeData.map(d => d[type]))])


	const bars = svg.selectAll('.bar')
    .data(coffeeData, function (d){
        return d.company;
    });
    
    bars.exit()
        .remove();

    // Implement the enter-update-exist sequence


    bars.enter()
    .append("rect")
    .attr("class", "bar")    
    .merge(bars)
    .transition()
    .delay(function(d,i){
        return i / coffeeData.length * 1000;
    })
    .duration(1000)
    .attr("x", (d) => xScale(d.company)+0.1) //+0.1 is aesthetic, same for y
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d[type])-0.1) // no need to invert because yScale already does, already says where "top" is -> lowered
    .attr("height", (d) => h - yScale(d[type])) //inverted relationship with "y" function b/c of yScale
    .attr("fill", "#f29c38");

    bars.exit()
        .attr("y", h)
        .remove();

    // Update axes and axis title



    // create axes
    const xAxis = d3.axisBottom()
    .scale(xScale)

    const yAxis = d3.axisLeft()
    .scale(yScale)
    
    svg.select(".x-axis")
        .transition()
        .duration(1000)
        .call(xAxis);
    svg.select(".y-axis")
        .transition()
        .duration(1000)
        .call(yAxis);
    svg.select(".yLabel")
        .text(function(d){
            if (type == "stores") {return "Stores"}
            else {return "Revenue (Billion USD)"} ;
    });

}

// CHART UPDATES ---------------------------
// Loading data
d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{ 

    data.sort((a, b) => b.stores - a.stores);     //sort data desc. by # stores
    
    console.log('data', data); // simply call the update function with the supplied data
    
    update(data, type, sort);

    d3.select(".sort-button").on("click", () =>{
        sort = !sort;
        update(data, type, sort);
    });

    d3.select("#group-by").on("change", (e) => {
            type = e.target.value;
            update(data, type, sort);
    });

  

})

// (Later) Handling the type change

// (Later) Handling the sorting direction change


