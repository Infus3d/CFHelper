const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

async function getfromcf(handleName){
    const res = await axios.get('https://codeforces.com/api/user.status', { params: {handle: handleName} });
    if(!res || !res.data || !res.data.status || res.data.status !== 'OK') return null;
    // console.log('Maybe here?');
    // console.log(res.data);

    let histogramInfo = {
        labels: [],
        backgroundColor: [
            'rgb(194, 194, 163, 0.7)',
            'rgb(194, 194, 163, 0.7)',
            'rgb(194, 194, 163, 0.7)',
            'rgb(194, 194, 163, 0.7)',
            'rgb(128, 255, 128, 0.7)',
            'rgb(128, 255, 128, 0.7)',
            'rgb(123, 213, 168, 0.7)',
            'rgb(123, 213, 168, 0.7)',
            'rgb(179, 179, 255, 0.7)',
            'rgb(179, 179, 255, 0.7)',
            'rgb(179, 179, 255, 0.7)',
            'rgb(255, 153, 221, 0.7)',
            'rgb(255, 153, 221, 0.7)',
            'rgb(255, 204, 0, 0.7)',
            'rgb(255, 204, 0, 0.7)',
            'rgb(255, 153, 51, 0.7)',
            'rgb(255, 80, 80, 0.7)',
            'rgb(255, 80, 80, 0.7)',
            'rgb(255, 0, 0, 0.7)',
            'rgb(255, 0, 0, 0.7)',
            'rgb(255, 0, 0, 0.7)',
            'rgb(255, 0, 0, 0.7)',
            'rgb(179, 0, 0, 0.7)',
            'rgb(179, 0, 0, 0.7)',
            'rgb(179, 0, 0, 0.7)',
            'rgb(179, 0, 0, 0.7)',
            'rgb(179, 0, 0, 0.7)',
            'rgb(179, 0, 0, 0.7)',
        ],
        borderColor: [
            'rgb(194, 194, 163)',
            'rgb(194, 194, 163)',
            'rgb(194, 194, 163)',
            'rgb(194, 194, 163)',
            'rgb(128, 255, 128)',
            'rgb(128, 255, 128)',
            'rgb(123, 213, 168)',
            'rgb(123, 213, 168)',
            'rgb(179, 179, 255)',
            'rgb(179, 179, 255)',
            'rgb(179, 179, 255)',
            'rgb(255, 153, 221)',
            'rgb(255, 153, 221)',
            'rgb(255, 204, 0)',
            'rgb(255, 204, 0)',
            'rgb(255, 153, 51)',
            'rgb(255, 80, 80)',
            'rgb(255, 80, 80)',
            'rgb(255, 0, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 0, 0)',
            'rgb(179, 0, 0)',
            'rgb(179, 0, 0)',
            'rgb(179, 0, 0)',
            'rgb(179, 0, 0)',
            'rgb(179, 0, 0)',
            'rgb(179, 0, 0)',
        ],
        borderWidth: 1,
        data: [],
    };
    for(let i=800; i<=3500; i+=100){
        histogramInfo.labels.push(i);
        histogramInfo.data.push(0);
    }
    for(const submission of res.data.result){
        if(submission.verdict === 'OK'){
            histogramInfo.data[(submission.problem.rating - 800) / 100]++;
        }
    }
    for(let i=3500; i>=800; i-=100){
        const idx = (i - 800) / 100;
        if(histogramInfo.data[idx] == 0){
            histogramInfo.labels.splice(idx, 1);
            histogramInfo.data.splice(idx, 1);
            histogramInfo.backgroundColor.splice(idx, 1);
            histogramInfo.borderColor.splice(idx, 1);
        }
    }
    console.log(histogramInfo.labels);
    let retConfiguration = {
        type: 'bar',   // for line chart
        data: {
            labels: histogramInfo.labels,
            datasets: [{
                label: 'Submissions',
                data: histogramInfo.data,
                backgroundColor: histogramInfo.backgroundColor,
                borderColor: histogramInfo.borderColor,
                borderWidth: histogramInfo.borderWidth,
            }, 
            // {
            //     label: 'Practice',
            //     data: [65, 70, 55, 43, 50, 90, 75],
            //     backgroundColor: [
            //         'rgba(255, 99, 132, 0.7)',
            //         'rgba(255, 159, 64, 0.7)',
            //         'rgba(255, 205, 86, 0.7)',
            //         'rgba(75, 192, 192, 0.7)',
            //         'rgba(54, 162, 235, 0.7)',
            //         'rgba(153, 102, 255, 0.7)',
            //         'rgba(201, 203, 207, 0.7)'
            //       ],
            //       borderColor: [
            //         'rgb(255, 99, 132)',
            //         'rgb(255, 159, 64)',
            //         'rgb(255, 205, 86)',
            //         'rgb(75, 192, 192)',
            //         'rgb(54, 162, 235)',
            //         'rgb(153, 102, 255)',
            //         'rgb(201, 203, 207)'
            //       ],
            //       borderWidth: 1, 
            // }
            ],
        },
        options: {
            grouped: true,
            scales: {
                x: {
                    
                },
                y: {
                    
                }
            },
        },
    }

    return retConfiguration;
}

async function getSolvedHistogram(handleName, color) {
    // const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
    // const base64Image = dataUrl

    // var base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    try{
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1000, height: 500, backgroundColour: 'white' });
        const config = await getfromcf(handleName);
        if(!config) return null;
        const buffer = await chartJSNodeCanvas.renderToBuffer(config);
        const filePath = __dirname + "/../charts/solvedHistogram.png";
        fs.writeFileSync(filePath, buffer, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        const file = new AttachmentBuilder(filePath);
        const embed = new EmbedBuilder()
                    .setTitle('Solved Problems Chart')
                    .setColor(color)
                    .setTimestamp()
                    .setImage('attachment://solvedHistogram.png');
        return {embeds: [embed], files: [file]};
    } catch (err) {
        console.error(err);
    }
}
// getSolvedHistogram('catsareliquid', '#d24dff');
module.exports = getSolvedHistogram;