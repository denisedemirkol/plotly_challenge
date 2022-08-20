

// ****************************************************************** //
// FUNCTION 1 - LOADING DEMOGRAPHICS 
// Called on window load and option change
// ****************************************************************** //

function populate_demographic_table(sampleid)
{
   
    var data = d3.json("data/samples.json").then(data => {    
    
        const metadata        = data.metadata;      
        const filteredData    = metadata.filter(sampledtl => sampledtl.id == sampleid)[0]   
    
        const demographicpanel = d3.select('#sample-metadata')
        demographicpanel.html('');    
    
         
        Object.entries(filteredData).forEach(([key, value]) => {
              demographicpanel.append("h6").text(`${key}: ${value}`);              
        });    
        

    });
}


function build_graphs(sampleid)
{

    console.log("Building graphs for %s.",  sampleid) 
    console.log("Loading data...") 

    let data = d3.json("data/samples.json").then(data => {    

        let samples = data.samples;
        let metadata = data.metadata;
    
        let filteredSample  = samples.filter(sampleName => sampleName.id == sampleid)[0] // Arrow function to extract the data
        let otuids          = filteredSample.otu_ids
        let otulabels       = filteredSample.otu_labels
        let samplevalues    = filteredSample.sample_values

        let filteredMetaSample  = metadata.filter(sampleName => sampleName.id == sampleid)[0]
        let weeklyfrequency     = parseInt(filteredMetaSample.wfreq)

        console.log(otuids)
        console.log(samplevalues)

   
    // ************************* HORIZONTAL BAR ****************************** //


        function build_horizontal_bar(sampleid){

            console.log("Building horizontal bar for %s.",  sampleid)   

            let ticksBar    = otuids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()
            let x_values    = samplevalues.slice(0,10).reverse();
            let bubletexts  = otulabels.slice(0,10).reverse();


            let bardata = [{ y      : ticksBar,
                             x      : x_values,
                             text   : bubletexts,
                             type   : 'bar',
                             orientation    : 'h',
                             width          : 0.8,
                             marker         : { color: 'blue' }}];


            let layout = {title      : '<b>Top 10 OTU<b>',
                          showlegend : false,
                          xaxis: {  tickangle : 0,
                                    zeroline  : true,
                                    title     : "Sample Value"},
                          yaxis: {  zeroline  : true,
                                    gridwidth : 1,
                                    title     : "OTU ID"},                                    
                          margin: { t:40 , l: 90, b: 35, r: 20 },
                          barmode: 'stack' };

            Plotly.newPlot('bar', bardata, layout);

        }


        // ************************* BUBBLE GRAPH ****************************** //


   function build_bubble_graph(sampleid){

    console.log("")   
    console.log("Building bubble graph for %s.",  sampleid)   
    

          
            var layout = {                
                showlegend: false                
            };
            

            var trace = {
                x: otuids,
                y: samplevalues,
                text: otulabels,
                mode: 'markers',
                marker: {
                    size: samplevalues,
                    color: otuids
                }
            };

            var bubbledata = [trace];

            Plotly.newPlot('bubble', bubbledata, layout);
   
    }

       
    // ************************* GAUGE GRAPH ****************************** //


    function build_gauge_graph(sampleid){

        console.log("Building gauge bar for %s.",  sampleid) ; 
        console.log("Weekly washing frequency is %s.",  weeklyfrequency) ; 


        // Trig to calc meter point
        var degrees = 180 - (weeklyfrequency*20),
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type  : 'scatter',
                      x     : [0], y:[0],
                      marker: {size: 28, color:'850000'},
                      showlegend: false,
                      name      : 'speed',
                      text      : weeklyfrequency,
                      hoverinfo : 'text+name'},
                    { values    : [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
                      rotation  : 90,
                      text      : ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3','1-2','0-1',''],
                      textinfo  : 'text',
                      textposition :'inside',
                      marker       : {colors:['rgba(14, 100, 0, .5)', 
                                              'rgba(90, 120, 22, .5)',  
                                              'rgba(110, 154, 22, .5)',
                                              'rgba(130, 180, 30, .5)',
                                              'rgba(130, 190, 35, .5)',
                                              'rgba(170, 202, 42, .5)', 
                                              'rgba(202, 209, 95, .5)',
                                              'rgba(210, 206, 145, .5)', 
                                              'rgba(232, 226, 202, .5)',
                                              'rgba(255, 255, 255, 0)']},
                      labels      : ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3','1-2','0-1',''],
                      hoverinfo   : 'label',
                      hole        : .5,
                      type        : 'pie',
                      showlegend  : false
                    }];

        var layout = {shapes:[{ type: 'path',
                                path: path,
                                fillcolor: '850000',
                                line: {color: '850000'}}],
                       title    : '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
                       height   : 500,
                       width    : 500,
                       xaxis    : {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
                       yaxis    : {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
                    };

        Plotly.newPlot('gauge', data, layout);

    }    

    // ************************************************************
    // CALLING GRAPHS


        build_horizontal_bar(sampleid);
        build_bubble_graph(sampleid);
        build_gauge_graph(sampleid);
    }) 
}   
   
   



function optionChanged(sampleid)
{
    console.log("Selected individiual is " + sampleid);
    populate_demographic_table(sampleid)
    build_graphs(sampleid)

    
};    


// ****************************************************************** //
// Read sample.json data and load options
// Windows load action
// ****************************************************************** //



window.onload = function() {
    let data = d3.json("data/samples.json").then(data => {
        
        console.log(data)

        const names     = data.names;       
        console.log("Imported data: ")
        console.log("names: ")
        console.log(names)

        console.log(Math.min(parseInt(names))); //min sampleid
        minsampleid = Math.min(parseInt(names));

        // dropDown button
        let dropDown = d3.select('#selDataset')
        
        // dropDown.on('change', handleChange)
        names.forEach(name => {
            dropDown.append('option').text(name).property('value', name);
        });
         
        
        populate_demographic_table(minsampleid) // Load initial data for test id, after the file is loaded
        build_graphs(minsampleid)
        

    })

   
}  


