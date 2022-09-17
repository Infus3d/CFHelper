const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

async function getHistogram(acceptedSubmissions){
    if(!acceptedSubmissions) return null;
    let histogramInfo = {
        labels: [],
        backgroundColor: [
            'rgb(194, 194, 163, 0.7)', // 800
            'rgb(194, 194, 163, 0.7)', // 900
            'rgb(194, 194, 163, 0.7)', // 1000
            'rgb(194, 194, 163, 0.7)', // 1100
            'rgb(128, 255, 128, 0.7)', // 1200
            'rgb(128, 255, 128, 0.7)', // 1300
            'rgb(123, 213, 168, 0.7)', // 1400
            'rgb(123, 213, 168, 0.7)', // 1500
            'rgb(179, 179, 255, 0.7)', // 1600
            'rgb(179, 179, 255, 0.7)', // 1700
            'rgb(179, 179, 255, 0.7)', // 1800
            'rgb(255, 153, 221, 0.7)', // 1900
            'rgb(255, 153, 221, 0.7)', // 2000
            'rgb(255, 204, 0, 0.7)', // 2100
            'rgb(255, 204, 0, 0.7)', // 2200
            'rgb(255, 153, 51, 0.7)', // 2300
            'rgb(255, 80, 80, 0.7)', // 2400
            'rgb(255, 80, 80, 0.7)', // 2500
            'rgb(255, 0, 0, 0.7)', // 2600
            'rgb(255, 0, 0, 0.7)', // 2700
            'rgb(255, 0, 0, 0.7)', // 2800
            'rgb(255, 0, 0, 0.7)', // 2900
            'rgb(179, 0, 0, 0.7)', // 3000
            'rgb(179, 0, 0, 0.7)', // 3100
            'rgb(179, 0, 0, 0.7)', // 3200
            'rgb(179, 0, 0, 0.7)', // 3300
            'rgb(179, 0, 0, 0.7)', // 3400
            'rgb(179, 0, 0, 0.7)', // 3500
        ],
        borderColor: [
            'rgb(194, 194, 163)', // 800
            'rgb(194, 194, 163)', // 900
            'rgb(194, 194, 163)', // 1000
            'rgb(194, 194, 163)', // 1100
            'rgb(128, 255, 128)', // 1200
            'rgb(128, 255, 128)', // 1300
            'rgb(123, 213, 168)', // 1400
            'rgb(123, 213, 168)', // 1500
            'rgb(179, 179, 255)', // 1600
            'rgb(179, 179, 255)', // 1700
            'rgb(179, 179, 255)', // 1800
            'rgb(255, 153, 221)', // 1900
            'rgb(255, 153, 221)', // 2000
            'rgb(255, 204, 0)', // 2100
            'rgb(255, 204, 0)', // 2200
            'rgb(255, 153, 51)', // 2300
            'rgb(255, 80, 80)', // 2400
            'rgb(255, 80, 80)', // 2500
            'rgb(255, 0, 0)', // 2600
            'rgb(255, 0, 0)', // 2700
            'rgb(255, 0, 0)', // 2800
            'rgb(255, 0, 0)', // 2900
            'rgb(179, 0, 0)', // 3000
            'rgb(179, 0, 0)', // 3100
            'rgb(179, 0, 0)', // 3200
            'rgb(179, 0, 0)', // 3300
            'rgb(179, 0, 0)', // 3400
            'rgb(179, 0, 0)', // 3500
        ],
        borderWidth: 1,
        data: [],
    };
    for(let i=800; i<=3500; i+=100){
        histogramInfo.labels.push(i);
        histogramInfo.data.push(0);
    }
    for(const submission of acceptedSubmissions){
        histogramInfo.data[(submission.problem.rating - 800) / 100]++;
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
    // console.log(histogramInfo.labels);
    const retConfiguration = {
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

async function getDoughnut(acceptedSubmissions){
    if(!acceptedSubmissions) return null;
    const doughnutInfo = {
        labels: [],
        data: [],
        total: 0,
        backgroundColor: [
            'rgb(255, 0, 0)',
            'rgb(0, 204, 0)',
            'rgb(255, 153, 0)',
            'rgb(153, 0, 153)',
            'rgb(0, 255, 255)',
            'rgb(255, 102, 102)',
            'rgb(255, 255, 0)',
            'rgb(187, 187, 119)',
            'rgb(102, 255, 102)',
            'rgb(102, 0, 204)',
            'rgb(255, 0, 102)',
            'rgb(255, 102, 153)',
            'rgb(102, 102, 153)',
            'rgb(255, 204, 204)',
            'rgb(0, 128, 128)',
            'rgb(51, 51, 51)',
            'rgb(0, 153, 0)',
            'rgb(230, 77, 0)',
            'rgb(217, 217, 217)',
            'rgb(198, 83, 198)',
            'rgb(0, 51, 102)',
            'rgb(204, 255, 102)',
            'rgb(255, 51, 153)',
            'rgb(102, 224, 255)',
            'rgb(204, 102, 153)',
            'rgb(204, 204, 0)',
            'rgb(128, 0, 0)',
            'rgb(0, 255, 191)',
            'rgb(0, 51, 153)',
            'rgb(204, 204, 0)',
            'rgb(148, 148, 184)',
            'rgb(255, 191, 128)',
            'rgb(217, 140, 179)',
            'rgb(255, 255, 51)',
            'rgb(102, 153, 0)',
            'rgb(204, 255, 102)',
            'rgb(255, 133, 102)',
            'rgb(153, 0, 115)',
        ],
    }
    for(const submission of acceptedSubmissions){
        doughnutInfo.total++;
        for(const tag of submission.problem.tags){
            doughnutInfo.labels.push(tag);
        }
    }
    doughnutInfo.labels = Array.from(new Set(doughnutInfo.labels));
    console.log(doughnutInfo.labels);
    console.log(acceptedSubmissions.length);
    for(const tag of doughnutInfo.labels){
        let cnt = 0;
        for(const submission of acceptedSubmissions){
            if(submission.problem.tags.indexOf(tag) != -1){
                cnt++;
            }
        }
        doughnutInfo.data.push(cnt);
        doughnutInfo.labels[doughnutInfo.data.length-1] += `: ${cnt}`;
    }
    for(let i=0; i<doughnutInfo.data.length; i++){
        let idx = i; //max idx from [i...n-1]
        for(let j=i+1; j<doughnutInfo.data.length; j++){
            if(doughnutInfo.data[idx] < doughnutInfo.data[j]){
                idx = j;
            }
        }
        const temp1 = doughnutInfo.data[i], temp2 = doughnutInfo.labels[i];
        doughnutInfo.data[i] = doughnutInfo.data[idx];
        doughnutInfo.labels[i] = doughnutInfo.labels[idx];
        doughnutInfo.data[idx] = temp1;
        doughnutInfo.labels[idx] = temp2;
    }
    const retConfiguration = {
        type: 'doughnut',
        data: {
            labels: doughnutInfo.labels,
            datasets: [{
                label: `Total solved: ${doughnutInfo.total}`,
                data: doughnutInfo.data,
                backgroundColor: doughnutInfo.backgroundColor,
            }],
            position: 'right'
        },
        options: {
            responsive: false,
            plugins:{
                legend: {
                    position: 'right',
                    display: true,
                },
            }
        }
    }
    return retConfiguration;
}

async function getSolvedHistogram(handleName, color) {
    // const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
    // const base64Image = dataUrl

    // var base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    try{
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1000, height: 500, backgroundColour: 'white' });
        const res = await axios.get('https://codeforces.com/api/user.status', { params: {handle: handleName} });
        if(!res || !res.data || !res.data.status || res.data.status !== 'OK') return null;

        let acceptedSubmissions = [], vis = {};
        for(const submission of res.data.result){
            const id = submission.problem.contestId + submission.problem.index;
            if(submission.verdict === 'OK' && !vis[id]){
                vis[id] = true;
                acceptedSubmissions.push(submission);
            }
        }

        const config1 = await getHistogram(acceptedSubmissions);
        const buffer1 = await chartJSNodeCanvas.renderToBuffer(config1);
        const filePath1 = __dirname + "/../charts/solvedHistogram.png";
        fs.writeFileSync(filePath1, buffer1, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        const file1 = new AttachmentBuilder(filePath1);

        const config2 = await getDoughnut(acceptedSubmissions);
        const buffer2 = await chartJSNodeCanvas.renderToBuffer(config2);
        const filePath2 = __dirname + "/../charts/solvedDoughnut.png";
        fs.writeFileSync(filePath2, buffer2, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        const file2 = new AttachmentBuilder(filePath2);

        const embed1 = new EmbedBuilder()
                    .setTitle('Problems solved by Difficulty')
                    .setColor(color)
                    .setTimestamp()
                    .setImage('attachment://solvedHistogram.png');
        const embed2 = new EmbedBuilder()
                    .setTitle('Problems solved by Tag')
                    .setColor(color)
                    .setTimestamp()
                    .setImage('attachment://solvedDoughnut.png');
        return {embeds: [embed1, embed2], files: [file1, file2]};
    } catch (err) {
        console.error(err);
    }
}
// getSolvedHistogram('catsareliquid', '#d24dff');
getDoughnut(null);
module.exports = getSolvedHistogram;