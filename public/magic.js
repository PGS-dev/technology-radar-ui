// const URL = 'https://technology-radar.firebaseio.com/snapshots/PGSNET/august-2016.json';
// const URL = 'https://technology-radar.firebaseio.com/snapshots/pgs-frontend/march-2017.json';
const URL = 'http://pgslnx232.pgs-soft.com:8090/api/radars/18Wg-5N7qOnEr1sbSx2f_Yh90kTYNAxnpW7ZHE_9orQg/snapshots/March%202017';

// const AREA_COLORS = ['#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'];
const AREA_COLORS = ['#5BC0EB', '#7FB800', '#FFB30F', '#FD151B'];
const STATUS_COLORS = {
    'Hold': '#f7f7f7',
    'Trial': '#f7f7f7',
    'Assess': '#f7f7f7',
    'Adopt': '#f7f7f7'
};

const HISTORY_COLOR = '#7a7a7a';

const PI = 3.14159;

function drawChart(data) {
    console.log('raw data', data.items.filter(i => !!i.history));

    const svg = d3.select('#radar');
    const config = getConfig(svg, data.items);

    let g = svg.append('g')
        .attr('transform', `translate(${config.center.x}, ${config.center.y})`);

    // drawDebugLayer(g, config);
    drawLegend(g, data, config);
    drawItemsLines(g, data, config);
    drawItemLabels(g, data.items, config);
    drawAreaLebels(g, data, config);
    drawItems(g, data, config);
}

// --- draw functions, with update pattern
function drawDebugLayer(selection, config) {
    console.log('config', config);
    let debugGroup = selection.append('g')
        .attr('class', 'debugLayer');

    debugGroup.append('circle')
        .attr('fill', '#00FFFF')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5);


    debugGroup.append('circle')
        .attr('fill', 'none')
        .attr('stroke', '#FF00FF')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', config.radiusMax);

    // --- items lines
    let lineFn = d3.line()
        .x(d => d[0])
        .y(d => d[1]);

    let lineData = d3.range(0, config.count).map(n => [
        [125 * Math.cos(config.scaleRadialPositionWithBaseShift(n)), 125 * Math.sin(config.scaleRadialPositionWithBaseShift(n))],
        [(config.radiusMax - 10) * Math.cos(config.scaleRadialPositionWithBaseShift(n)), (config.radiusMax - 10) * Math.sin(config.scaleRadialPositionWithBaseShift(n))]
    ]);

    debugGroup
        .append('path')
        .datum([
            [0, 0],
            [0, -config.radiusMax]
        ])
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('d', lineFn);

    debugGroup
        .append('path')
        .datum([
            [0, 0],
            [0, config.radiusMax]
        ])
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('d', lineFn);

    /*debugGroup
     .append('g')
     .attr('class', 'debugLines')
     .selectAll('path')
     .data(lineData)
     .enter()
     .append('path')
     .attr('fill', 'none')
     .attr('stroke', 'red')
     .attr('stroke-width', 0.5)
     .attr('d', lineFn);*/

}

function drawItemLabels(selection, items, config) {

    let group = selection.select('g.itemsLabels').empty() ? selection.append('g') : selection.select('g.itemsLabels');

    let arcLabel = d3.arc()
        .outerRadius(config.radiusMax)
        .innerRadius(config.radiusMax)
        .startAngle(d => config.scaleRadialPosition(d))
        .endAngle(d => config.scaleRadialPosition(d));

    group.selectAll('.itemLabel')
        .data(items)
        .enter()
        .append('text')
        .attr('class', 'itemLabel')
        .attr('alignment-baseline', 'middle')
        .attr('transform', (d, idx) => {
            let midAngle = config.scaleRadialPosition(idx);
            return `translate(${arcLabel.centroid(idx)[0]} , ${arcLabel.centroid(idx)[1]}) rotate(${rad2deg(midAngle) - 90}) rotate(${midAngle > PI ? -180 : 0})`;
        })
        .attr('text-anchor', (d, idx) => {
            return config.scaleRadialPosition(idx) <= PI ? 'start' : 'end';
        })
        .text(d => `${!!d._isNew ? '* ' : ''} ${d.name}`);
}

function drawAreaLebels(selection, data, config) {

    let group = selection.select('g.areaLabels').empty() ? selection.append('g') : selection.select('g.areaLabels');

    let areasData = Object.keys(data.areas)
        .map(area => Object.assign(data.areas[area], {
            name: area
        }))
        .map((area, idx, arr) => {
            area.startAngle = config.scaleRadialPosition(arr.reduce((total, curr, idxArea) => {
                return idxArea < idx ? total + (curr.count) : total;
            }, 0));

            area.endAngle = config.scaleRadialPosition(arr.reduce((total, curr, idxArea) => {
                    return idxArea < idx ? total + curr.count : total;
                }, -1) + area.count);

            return area;
        });

    let arc = d3.arc()
        .innerRadius(config.radiusMin - 23)
        .outerRadius(config.radiusMin - 20)
        .startAngle(d => d.startAngle)
        .endAngle(d => d.endAngle);

    group.selectAll('.areaLine')
        .data(areasData)
        .enter()
        .append('path')
        .attr('class', 'areaLine')
        .attr('fill', d => d.color)
        .attr('d', arc)
    // .transition()
    // .duration(750)
    //.attrTween('d', arcTween(arc));
    /*
     let arcLabelTag = d3.arc()
     .innerRadius(config.radiusMax - 10)
     .outerRadius(config.radiusMax - 30)
     .startAngle(d => d.startAngle)
     .endAngle(d => d.endAngle)

     group.selectAll('.areaLabelTag')
     .data(areasData)
     .enter()
     .append('path')
     .attr('class', 'areaLabelTag')
     .attr('fill', d => d.color)
     .attr('d', arcLabel)*/

    let labelRadius = config.radiusMin - 21.5;

    group
        .selectAll('.areaLabelArc')
        .data(areasData)
        .enter()
        .append('path')
        .attr('id', (d, idx) => 'areaLabelPath_' + idx)
        .attr('class', 'areaLabelArc')
        .attr('d', (d, idx) => {
            let angleStart = d.startAngle - config.baseAngle - 0.5;
            let angleEnd = d.endAngle - config.baseAngle + 0.5;
            let angleMid = (d.startAngle + d.endAngle) / 2;

            let pStart = [labelRadius * Math.cos(angleStart), labelRadius * Math.sin(angleStart)];
            let pEnd = [labelRadius * Math.cos(angleEnd), labelRadius * Math.sin(angleEnd)];

            return angleMid < PI / 2 || angleMid > PI * 1.5 ? `M ${pStart[0]},${pStart[1]} A ${labelRadius},${labelRadius} 0 0 1 ${pEnd[0]},${pEnd[1]}`
                : `M ${pEnd[0]},${pEnd[1]} A ${labelRadius},${labelRadius} 0 0 0 ${pStart[0]},${pStart[1]}`;
        });

    group.selectAll('.areaLabelDebug')
        .data(areasData)
        .enter()
        .append('text')
        .attr('class', (d, idx) => 'areaLabelDebug ' + '#areaLabel_' + idx)
        .attr('x', 0)
        .attr('dy', 5)
        .attr('text-anchor', 'middle')
        .append('textPath')
        .attr('xlink:href', (d, idx) => '#areaLabelPath_' + idx)
        .attr('startOffset', '50%')
        .text((d) => d.name);

    let labelTagRadiusMax = config.radiusMin - 21.5 + 15;
    // mid === 21.5
    let labelTagRadiusMin = config.radiusMin - 21.5 - 15;

    let tagsData = d3.selectAll('.areaLabelDebug').nodes()
        .map((node, idx) => {
            let textLength = node.getComputedTextLength();
            let midAngle = (areasData[idx].startAngle + areasData[idx].endAngle) / 2;
            let startAngle = areasData[idx].startAngle;
            let endAngle = areasData[idx].endAngle;
            let circumference = 2 * PI * labelRadius;
            //let partCircumference = (endAngle-startAngle) / (2 * PI) * circumference;

            let offsetAngle = (textLength / 2 / circumference) * 2 * PI;
            let offsetSide = 0.03;
            let color = areasData[idx].color;

            return {
                color,
                startAngle,
                endAngle,
                midAngle,
                offsetAngle,
                offsetSide
            };
        });

    group
        .selectAll('.areaLabelTag')
        .data(tagsData)
        .enter()
        .insert('path')
        .attr('fill', '#FFFFFF')
        .attr('stroke', d => d.color)
        .attr('stroke-width', 3)
        .attr('class', 'areaLabelTag')
        .attr('d', (d, idx) => {
            let p1 = [labelTagRadiusMax * Math.cos(d.midAngle - config.baseAngle - d.offsetAngle), labelTagRadiusMax * Math.sin(d.midAngle - config.baseAngle - d.offsetAngle)];
            let p2 = [labelTagRadiusMax * Math.cos(d.midAngle - config.baseAngle + d.offsetAngle), labelTagRadiusMax * Math.sin(d.midAngle - config.baseAngle + d.offsetAngle)];
            let p3 = [labelRadius * Math.cos(d.midAngle - config.baseAngle + d.offsetAngle + d.offsetSide), labelRadius * Math.sin(d.midAngle - config.baseAngle + d.offsetAngle + d.offsetSide)];
            let p4 = [labelTagRadiusMin * Math.cos(d.midAngle - config.baseAngle + d.offsetAngle), labelTagRadiusMin * Math.sin(d.midAngle - config.baseAngle + d.offsetAngle)];
            let p5 = [labelTagRadiusMin * Math.cos(d.midAngle - config.baseAngle - d.offsetAngle), labelTagRadiusMin * Math.sin(d.midAngle - config.baseAngle - d.offsetAngle)];
            let p6 = [labelRadius * Math.cos(d.midAngle - config.baseAngle - d.offsetAngle - d.offsetSide), labelRadius * Math.sin(d.midAngle - config.baseAngle - d.offsetAngle - d.offsetSide)];

            return `
              M ${p1[0]},${p1[1]}
              A ${labelTagRadiusMax},${labelTagRadiusMax} 0 0 1 ${p2[0]},${p2[1]}
              L ${p3[0]},${p3[1]}
              L ${p4[0]},${p4[1]}
              A ${labelTagRadiusMin},${labelTagRadiusMin} 0 0 0 ${p5[0]},${p5[1]}
              L ${p6[0]},${p6[1]}
              L ${p1[0]},${p1[1]}
            `;
        });

    group.selectAll('.areaLabelDebug').remove();

    group.selectAll('.areaLabel')
        .data(areasData)
        .enter()
        .append('text')
        .attr('class', (d, idx) => 'areaLabel ' + '#areaLabel_' + idx)
        .attr('x', 0)
        .attr('dy', 5)
        .attr('text-anchor', 'middle')
        .append('textPath')
        .attr('xlink:href', (d, idx) => '#areaLabelPath_' + idx)
        .attr('startOffset', '50%')
        .text((d) => d.name);
}

function drawItemsLines(selection, data, config) {

    let group = selection.select('g.itemsLines').empty() ? selection.append('g') : selection.select('g.itemsLines');

    let linesData = data.items
        .map(p => {
            let angle = config.scaleRadialPositionWithBaseShift(p._pos);
            return [
                [config.radiusMin * Math.cos(angle), config.radiusMin * Math.sin(angle)],
                [config.radiusMaxLine * Math.cos(angle), config.radiusMaxLine * Math.sin(angle)]
            ]
        });

    let lineFn = d3.line()
        .x(d => d[0])
        .y(d => d[1]);

    group
        .selectAll('.itemLine')
        .data(linesData)
        .enter()
        .append('path')
        .attr('class', 'itemLine')
        .attr('fill', 'none')
        .attr('stroke', 'none')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '3 5')
        .attr('d', lineFn)
        .transition()
        .delay((d, idx) => idx * 10)
        .attr('stroke', config.colors.lineLight);
}

function drawLegend(selection, data, config) {

    let statuses = Object.keys(config.statuses).map((val, idx) => {
        return {
            idx,
            name: val,
            step: config.statuses[val]
        }
    });

    let arcBg = function(d) {
        let r = config.radiusMaxLine - (d.step + 0.25 / 2) * (config.radiusMaxLine - config.radiusMin - config.buffer);
        let r2 = config.radiusMaxLine - (d.step - 0.25 / 2) * (config.radiusMaxLine - config.radiusMin - config.buffer);
        return d3.arc()
            .innerRadius(r + 2)
            .outerRadius(r2 - 2)
            .cornerRadius(10)
            .startAngle(-(2 * PI - config.angleEnd) + config.angleStep / 2)
            .endAngle(config.angleStart + config.angleStep)();
    };

    let arcInner = function(d) {
        let r = config.radiusMaxLine - d.step * (config.radiusMaxLine - config.radiusMin - config.buffer);
        return d3.arc()
            .innerRadius(r)
            .outerRadius(r + 1)
            .startAngle(-(2 * PI - config.angleEnd) + config.angleStep)
            .endAngle(config.angleStart - config.angleStep)();
    };

    let arcOuter = function(d) {
        let r = config.radiusMaxLine - (d.step + 0.25 / 2) * (config.radiusMaxLine - config.radiusMin - config.buffer);
        let r2 = config.radiusMaxLine - (d.step - 0.25 / 2) * (config.radiusMaxLine - config.radiusMin - config.buffer);
        return d3.arc()
            .innerRadius(r + 2)
            .outerRadius(r2 - 2)
            .cornerRadius(10)
            .startAngle(config.angleStart - config.angleStep)
            .endAngle(config.angleEnd)();
    };

    /*selection.selectAll('.legendArcInner')
     .data(statuses)
     .enter()
     .append('path')
     .attr('class', 'legendArcInner')
     .attr('fill', '#e2e2e2')
     .attr('d', d => arcInner(d));*/


    selection.selectAll('.legendArcBg')
        .data(statuses)
        .enter()
        .append('path')
        .attr('class', 'legendArcBg')
        // .attr('fill', d => (!!(d.idx % 2) ? 'none' : '#DAE5DF'))
        // .attr('fill', d => STATUS_COLORS[d.name])
        // .attr('fill','#E7E7E7')
        .attr('fill', 'url(#MyGradient)')
        .attr('d', d => arcBg(d));

    selection.selectAll('.legendArcOuter')
        .data(statuses)
        .enter()
        .append('path')
        .attr('class', 'legendArcOuter')
        // .attr('fill', d => (!!(d.idx % 2) ? 'none' : '#DAE5DF'))
        // .attr('fill', d => STATUS_COLORS[d.name])
        .attr('fill', '#f7f7f7')
        .attr('d', d => arcOuter(d));


    selection.selectAll('.legendArcInnerPath')
        .data(statuses)
        .enter()
        .append('path')
        .attr('id', (d) => 'legendArcInnerPath_' + d.idx)
        .attr('class', 'legendArcInnerPath')
        .attr('fill', 'none')
        .attr('stroke', 'none')
        .attr('d', d => {
            return arcInner(d).split('L')[0]
        });

    selection.selectAll('.legendLabel')
        .data(statuses)
        .enter()
        .append('text')
        .attr('class', (d, idx) => 'legendLabel')
        .attr('x', 10)
        .attr('dy', 8)
        .attr('text-anchor', 'left')
        .append('textPath')
        .attr('xlink:href', (d, idx) => '#legendArcInnerPath_' + idx)
        .attr('startOffset', '0%')
        .text((d) => d.name);

}

function drawItems(selection, data, config) {
    let SYMBOL_TRIANGLE = d3.symbol().type(d3.symbolTriangle);
    let ranges = d3.range(0.25, 1.25, 0.25);

    let points = data.items.map((p, idx, arr) => {
        let rStart = config.radiusMin - Math.random() * 100;
        let rEnd = config.radiusMaxLine - config.buffer;
        let rPos = config.radiusMaxLine - config.statuses[p.status] * (config.radiusMaxLine - config.radiusMin - config.buffer); //config.radiusMax - 100 * ranges[Math.ceil(d3.randomUniform(3)())];

        let angle = config.scaleRadialPositionWithBaseShift(p._pos);
        let origin = [rStart * Math.cos(angle), rStart * Math.sin(angle)];
        let destination = [rEnd * Math.cos(angle), rEnd * Math.sin(angle)];
        let pos = [rPos * Math.cos(angle), rPos * Math.sin(angle)];

        let historyLine = null;
        let historyDirection = 0;
        if (!!p.history && p.history.length > 0) {
            let hPos = config.radiusMaxLine - config.statuses[p.history[0].status] * (config.radiusMaxLine - config.radiusMin - config.buffer); //config.radiusMax - 100 * ranges[Math.ceil(d3.randomUniform(3)())];

            historyLine = [
                [rPos * Math.cos(angle), rPos * Math.sin(angle)],
                [hPos * Math.cos(angle), hPos * Math.sin(angle)]
            ];

            origin = historyLine[0];
            destination = historyLine[1];
            historyDirection = hPos < rPos ? -1 : 1;
        }

        let path = !!p.history ? [origin, destination] : createJaggedPoints(origin, destination, 15, 30);
        let color = data.areas[p.section].color;
        let isNew = p._isNew;

        return {
            angle,
            isNew,
            destination,
            origin,
            pos,
            historyLine,
            historyDirection,
            path,
            color,
            section: p.section
        }
    });

    let lineHistory = d3.line()
        .x(d => d[0])
        .y(d => d[1]);

    //draw item history line
    selection.selectAll('.itemHistoryLine')
        .data(points.filter(d => !!d.historyLine))
        .enter()
        .append('path')
        .attr('class', 'itemHistoryLine')
        .attr('fill', 'none')
        .attr('stroke', d => d.historyDirection  ===  1 ? d.color : HISTORY_COLOR)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '2 3')
        .attr('d', d => lineHistory(d.historyLine));

    selection.selectAll('.itemOld')
        .data(points.filter(d => !d.isNew))
        .enter()
        .append('circle')
        .attr('class', 'item itemOld')
        .attr('fill', '#ffffff')
        .attr('stroke', d => d.color)
        .attr('stroke-width', 1.5)
        .attr('cx', d => d.origin[0])
        .attr('cy', d => d.origin[1])
        .attr('r', 4)
        .call(animate);

    selection.selectAll('.itemNew')
        .data(points.filter(d => d.isNew))
        .enter()
        .append('path')
        .attr('class', 'item itemNew')
        .attr('fill', 'none')
        .attr('stroke', 'none')
        .attr('stroke-width', 1.5)
        .attr('d', SYMBOL_TRIANGLE.size(30))
        .attr('transform', d => {
            return `translate(${d.pos[0]}, ${d.pos[1]}) rotate(${rad2deg(d.angle) - 90})`
        })
        .transition()
        .delay((d, idx) => idx * 100)
        .attr('fill', '#ffffff')
        .attr('stroke', d => data.areas[d.section].color)
}

// --- data functions
function processData(rawData) {
    let data = {
        areas: {}
    };
    // rawData.blips = rawData.blips.forEach(b => b.section = b.section.trim())

    data.items = [ // blips
        ...(rawData.blips || []).map(blip => {
            blip.section = blip.section.trim();
            return blip;
        })
    ]
        .sort(function(a, b) {
            return d3.ascending(a.section.toLowerCase(), b.section.toLowerCase()) ||
                d3.ascending(a.name.toLowerCase(), b.name.toLowerCase());
        })
        .map((d, idx) => {
            d._pos = idx;
            if (d.state === "CHANGED") {
                d.history = [{
                    action: 'CHANGE_STATUS',
                    status: d.previousStatus
                }]
            }
            if (d.state === "NEW") {
                d._isNew = true;
            }
//             /** MAKE FAKE HISTORY HERE **/
//             if (idx % 3 === 0 && !d._isNew) {

//                 switch (d.status) {
//                     case 'Adopt':
//                         d.history = [
//                             {
//                                 action: 'CHANGE_STATUS',
//                                 status: Math.random() < 0.5 ? 'Assess' : 'Trial',
//                             }
//                         ];
//                         break;
//                     case 'Assess':
//                         d.history = [
//                             {
//                                 action: 'CHANGE_STATUS',
//                                 status: Math.random() < 0.5 ? 'Hold' : 'Trial'
//                             }
//                         ];
//                         break;
//                     case 'Trial':
//                         d.history = [
//                             {
//                                 action: 'CHANGE_STATUS',
//                                 status: 'Hold'
//                             }
//                         ];
//                         break;
//                     case 'Hold':
//                         d.history = [
//                             {
//                                 action: 'CHANGE_STATUS',
//                                 status: 'Trial'
//                             }
//                         ];
//                         break;
//                 }


//             }

            return d;
        });

    // rawData.sections.map(s => s.name.trim());
    // areas.sort((a, b) => a.name < b.name);
    let areas =
        data.items // == sections
            .map(item => item.section.trim())
            .filter((item, idx, self) => self.indexOf(item) === idx);


    areas.forEach((area, idx) => {
        data.areas[area] = {
            idx,
            color: AREA_COLORS[idx],
            count: data.items.filter(item => item.section === area).length
        }
    });

    return data;
}

function getData() {
    return fetch(URL).then(response => response.json()).catch(m => console.log(m));
}

// --- helpers
function getTextLength(str, selection) {
    let textElement = selection
        .append('text')
        .attr('x', 100)
        .attr('y', 100)
        .attr('class', 'itemLabel')
        .text(str);

    let width = textElement.node().getComputedTextLength();
    textElement.remove();

    return width;
}

function rad2deg(rad) {
    return rad * (180 / PI);
}

function deg2rad(deg) {
    return deg * (PI / 180);
}

function getConfig(containerEl, items) {
    const width = 1000;
    const height = 1000;
    const legendReserverAngle = 12;
    const baseAngle = PI / 2;

    const count = items.length;

    const bound = Math.min(width, height);

    const center = {
        x: 500,
        y: 500
    };

    const colors = {
        lineLight: '#c2c2c2'
    };

    const statuses = {
        'Hold': 0.25 - 0.25 / 2,
        'Trial': 0.50 - 0.25 / 2,
        'Assess': 0.75 - 0.25 / 2,
        'Adopt': 1 - 0.25 / 2
    };

    console.log('statuses', statuses);

    // --- estimate length of longest technology
    const longestLabel = items
        .map(item => item.name)
        .sort((a, b) => (a.length - b.length))
        .reverse()[0];

    const longestLabelWidth = getTextLength(longestLabel, containerEl);

    const radiusMax = 0.5 * 0.85 * (bound - longestLabelWidth);
    const radiusMaxLine = radiusMax - 10;// - 33;

    const radiusMin = 200;

    // --- angles calculcation with reserved space
    const angleStart = deg2rad(legendReserverAngle * 2);
    const angleEnd = deg2rad(360); // 2 * PI === 360
    const angleStep = (angleEnd - angleStart) / items.length;
    // const angleStep = (PI * 2) / items.length;// (angleEnd - angleStart) / items.length;

    const scaleRadialPosition = d3.scaleLinear()
        .range([angleStart, angleEnd])
        .domain([0, items.length]);

    const scaleRadialPositionWithBaseShift = d3.scaleLinear()
        .range([angleStart - baseAngle, angleEnd - baseAngle])
        .domain([0, items.length]);

    const buffer = 0;

    return {
        buffer,
        baseAngle,
        colors,
        count,
        radiusMax,
        radiusMaxLine,
        radiusMin,
        center,
        scaleRadialPosition,
        scaleRadialPositionWithBaseShift,
        angleStart,
        angleEnd,
        angleStep,
        statuses
    }
}

function createJaggedPoints(start, end, maxPeakHeight, minPeakDistance) {
    // we want the one with farthest left X to be 'start'
    let reversed = false;
    if (start[0] > end[0]) {
        const swap = start;
        start = end;
        end = swap;
        reversed = true;
    }

    const [startX, startY] = start;
    const [endX, endY] = end;

    // keep the start point unmodified
    const points = [start];

    // rotate it so end point is horizontal with start point
    const opposite = endY - startY;
    const adjacent = endX - startX;
    const thetaRadians = -Math.atan(opposite / adjacent);

    // compute the overall length of the line
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    if (!minPeakDistance) {
        minPeakDistance = length * 0.05;
    }

    // compute rotated end point
    const [rotatedEndX, rotatedEndY] = rotate(start, end, thetaRadians);

    // generate the intermediate peak points
    let lastX = startX;
    while (lastX < rotatedEndX - minPeakDistance) {
        // move minPeakDistance from previous X + some random amount, but stop at most at
        // minPeakDistance from the end
        const nextX = Math.min(lastX + minPeakDistance + (Math.random() * minPeakDistance),
            rotatedEndX - minPeakDistance);

        // add some randomness to the expected y position to get peaks
        // we can use startY as the expected y position since we rotated the line to be flat
        const nextY = (maxPeakHeight * (Math.random() - 0.5)) + startY;

        points.push([nextX, nextY]);
        lastX = nextX;
    }

    // add in the end point
    points.push([rotatedEndX, rotatedEndY]);

    // undo the rotation and return the points as the result
    const unrotated = points.map((point, i) => {
        if (i === 0) {
            return start;
        } else if (i === points.length - 1) {
            return end;
        }

        return rotate(start, point, -thetaRadians);
    });

    // restore original directionality if we reversed it
    return reversed ? unrotated.reverse() : unrotated;
}

function rotate(origin, point, thetaRadians) {
    const [originX, originY] = origin;
    const [pointX, pointY] = point;

    const rotatedEndX = originX +
        (pointX - originX) * Math.cos(thetaRadians) -
        (pointY - originY) * Math.sin(thetaRadians);
    const rotatedEndY = originY +
        (pointX - originX) * Math.sin(thetaRadians) +
        (pointY - originY) * Math.cos(thetaRadians);

    return [rotatedEndX, rotatedEndY];
}

function animate(selection) {
    selection
        .transition()
        .duration(1500)
        //.delay(() => Math.random()*500)
        .ease(d3.easeBounceOut)
        .attrTween('transform', (d) => interpolate(d.path))
        .call(endAll, function() {
            selection
                .transition()
                .duration(1500)
                .ease(d3.easeCubicIn)
                .attr('transform', p =>
                    `translate(${p.pos[0] - p.origin[0]}, ${p.pos[1] - p.origin[1]})`
                );
        });
}

function midpoint(p1, p2, per) {
    return [p1[0] + (p2[0] - p1[0]) * per, p1[1] + (p2[1] - p1[1]) * per];
}

function interpolate(points) {
    let n = points.length - 1;
    let step = 1 / n;

    return function(t) {
        let idx1 = Math.floor(t * n);
        let idx2 = Math.ceil(t * n);
        let pct = (t - step * idx1) / step;
        let mid = midpoint(points[idx1], points[idx2], pct);

        return `translate(${mid[0] - points[0][0]}, ${mid[1] - points[0][1]})`;
    }
}

function endAll(transition, callback) {
    if (transition.size() === 0) {
        callback()
    }
    var n = 0;
    transition
        .each(function() {
            ++n;
        })
        .on('end', function() {
            if (!--n) callback.apply(this, arguments);
        });
}

function magicInit(data) {

    drawChart(processData(data));
}
