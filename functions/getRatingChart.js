// Install libs with: npm i chartjs-node-canvas chart.js
// Docs https://www.npmjs.com/package/chartjs-node-canvas
// Config documentation https://www.chartjs.org/docs/latest/axes/
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

const ratingIntervals = [
    {upper: 4500, lower: 3000, color: 'rgb(179, 0, 0)'},
    {upper: 3000, lower: 2600, color: 'rgb(255, 0, 0)'},
    {upper: 2600, lower: 2400, color: 'rgb(255, 80, 80)'},
    {upper: 2400, lower: 2300, color: 'rgb(255, 153, 51)'},
    {upper: 2300, lower: 2100, color: 'rgb(255, 204, 0)'},
    {upper: 2100, lower: 1900, color: 'rgb(255, 153, 221)'},
    {upper: 1900, lower: 1600, color: 'rgb(179, 179, 255)'},
    {upper: 1600, lower: 1400, color: 'rgb(123, 213, 168)'},
    {upper: 1400, lower: 1200, color: 'rgb(128, 255, 128)'},
    {upper: 1200, lower: 0, color: 'rgb(194, 194, 163)'},
]

const canvasBackgroundColor = {
    id: 'canvasBackgroundColor',
    beforeDraw(chart, args, pluginOptions){
        // console.log(chart);
        // console.log('hello there');
        const {ctx, chartArea: {top, bottom, left, right, width, height}, scales: {x, y}} = chart;
        // console.log('This is the the pixel ----> ' + y.getPixelForValue(2300));
        for(const interval of ratingIntervals){
            ctx.fillStyle = interval.color;
            ctx.fillRect(left, y.getPixelForValue(interval.upper), width, Math.min(y.getPixelForValue(interval.lower), bottom) - y.getPixelForValue(interval.upper));
        }
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(left, bottom, width, height*2);
        ctx.fillRect(left, 0, width, top);
    }
}

async function getfromcf(handleName){
    const res = await axios.get('https://codeforces.com/api/user.rating', { params: {handle: handleName} });
    if(!res || !res.data || !res.data.status || res.data.status !== 'OK') return null;
    // console.log('Maybe here?');
    const points = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let xMin, xMax, yMin, yMax;
    for(const contest of res.data.result){
        points.push({x: contest.ratingUpdateTimeSeconds, y: contest.newRating});
        if(!xMin || xMin > contest.ratingUpdateTimeSeconds) xMin = contest.ratingUpdateTimeSeconds;
        if(!xMax || xMax < contest.ratingUpdateTimeSeconds) xMax = contest.ratingUpdateTimeSeconds;
        if(!yMin || yMin > contest.newRating) yMin = contest.newRating;
        if(!yMax || yMax < contest.newRating) yMax = contest.newRating;
    }
    // console.log(points);
    yMin = Math.ceil(yMin / 100) * 100 - 300;
    yMax = Math.min(4200, Math.ceil(yMax / 100) * 100 + 200);
    xMin = xMin-216000;
    xMax = xMax+216000;

    let retConfiguration = {
        type: 'scatter',   // for line chart
        data: {
            datasets: [{
                label: res.data.result[0].handle,
                data: points,
                borderColor: ['rgb(255, 153, 51)'],
                borderWidth: 1,
                showLine: true,
                pointBackgroundColor: 'rgb(255, 255, 255)',
                pointBorderColor: 'rgb(193, 156, 11)',
                pointBorderWidth: 3,
                pointRadius: 7,
                borderColor: 'rgb(193, 156, 11)',
                borderWidth: 3,
            }],
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        callback: function(label, index, labels) {
                            const ret = moment(label * 1000).format("DD/MM/YYYY").split('/');
                            return `${months[parseInt(ret[1])-1]} ${ret[2]}`;
                        },
                    },
                    min: xMin,
                    max: xMax,
                },
                y: {
                    min: yMin,
                    max: yMax,
                }
            },
        },
        plugins: [canvasBackgroundColor]
    }

    return retConfiguration;
}

async function getRatingChart(handleName, color) {
    // const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
    // const base64Image = dataUrl

    // var base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    try{
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1100, height: 650, backgroundColour: 'white' });
        const config = await getfromcf(handleName);
        if(!config) return null;
        const buffer = await chartJSNodeCanvas.renderToBuffer(config);
        const filePath = __dirname + "/../charts/ratingChart.png";
        fs.writeFileSync(filePath, buffer, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });

        const file = new AttachmentBuilder(filePath);
        const embed = new EmbedBuilder()
                    .setTitle(`Rating graph for ${handleName}`)
                    .setColor(color)
                    .setTimestamp()
                    .setImage('attachment://ratingChart.png');
        
        // console.log('It gets this far at least');
        return {embeds: [embed], files: [file]};
    } catch (err) {
        console.error(err);
    }
}
getRatingChart('jiangly', '#d24dff');
module.exports = getRatingChart;

// const configuration2 = {
//     type: 'scatter',   // for line chart
//     data: {
//         datasets: [{
//             label: "Sample 1",
//             data: [
//                 {x: 0, y: 10}, 
//                 {x: 5, y: 3},
//                 {x: 9, y: 15},
//                 {x: 12, y: -20}, 
//                 {x: 1500000, y: 15}
//             ],
//             borderColor: ['rgb(0, 0, 0)'],
//             borderWidth: 1,
//             // xAxisID: 'x', //define top or bottom axis ,modifies on scale
//             // yAxisID: 'y',
//             showLine: true
//         },
//         // {
//         //     label: "Sample 2",
//         //     data: [
//         //         {x: 2, y: 10},
//         //         {x: 3, y: 30},
//         //         {x: 6, y: 20},
//         //         {x: 9, y: 10},
//         //         {x: 14, y: 45}
//         //     ],
//         //     // fill: false,
//         //     borderColor: ['rgb(255, 102, 255)'],
//         //     borderWidth: 1,
//         //     // xAxisID: 'xAxis1'
//         // },
//         ],

//     },
//     options: {
//         scales: {
//             x: {
//                 ticks: {
//                     callback: function(label, index, labels) {
//                         return moment(label).format("DD/MM/YY");
//                     }
//                  }
//             },
//         },
//     },
//     // pointBackgroundColor: 'rgb(255, 204, 102)',
//     // plugins: [canvasBackgroundColor]
// }

// const configuration = {
//     type: 'line',   // for line chart
//     data: {
//         labels: [2018, 2019, 2020, 2021],
//         datasets: [{
//             label: "Sample 1",
//             data: [10, 15, -20, 15],
//             fill: false,
//             borderColor: ['rgb(0, 0, 0)'],
//             borderWidth: 1,
//             xAxisID: 'xAxis1' //define top or bottom axis ,modifies on scale
//         },
//         {
//             label: "Sample 2",
//             data: [10, 30, 20, 10, 45],
//             fill: false,
//             borderColor: ['rgb(255, 102, 255)'],
//             borderWidth: 1,
//             xAxisID: 'xAxis1'
//         },
//         ],

//     },
//     options: {
//         scales: {
//             y: {
//                 suggestedMin: 0,
//             }
//         }
//     },
//     pointBackgroundColor: 'rgb(255, 204, 102)',
//     plugins: [canvasBackgroundColor]
// }
