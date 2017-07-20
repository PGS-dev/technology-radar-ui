/* eslint-disable */
import * as d3 from 'd3'

const AREA_COLORS = ['#537D8D', '#4FB286', '#918B76', '#595959'];
const HISTORY_COLOR = '#7a7a7a';
const PI = 3.14159;

class Chart {
  constructor(el, data, clickHandler, options) {
    this.svg = d3.select(el);   
    this.options = options;
    
    this.data = this.processData(data);
    this.config = this.getConfig();
    this.events = {
      click: clickHandler
    };
  }

  drawChart() {
     this.group = svg.append('g')
      .attr('transform', `translate(${config.center.x}, ${config.center.y})`);

    this.drawLegend(this.group, data, config);
    this.drawItemsLines(this.group, data, config);
    this.drawItemLabels(this.group, data.items, config);
    this.drawAreaLebels(this.group, data, config);
    this.drawItems(this.group, data, config);
  }

  drawDebugLayer() {
    console.warn('--- DEBUG LAYER ---');

    console.log('this.config.angleStart', this.config.angleStart);
    console.log('this.config.angleStart', this.config.angleEnd);
    console.log('this.config.angleStep', this.config.angleStep);

    const debugLayer = this.group.append('g');

  }

  drawItemLabels(selection, items, config) {
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
        return `translate(${arcLabel.centroid(idx)[0]}, ${arcLabel.centroid(idx)[1]}) rotate(${this.rad2deg(midAngle) - 90}) rotate(${midAngle > PI ? -180 : 0})`;
      })
      .attr('text-anchor', (d, idx) => {
        return config.scaleRadialPosition(idx) <= PI ? 'start' : 'end';
      })
      .on('click', config.clickHandler)
      .text(d => `${!!d._isNew ? '* ' : ''} ${d.name}`);
  }

  drawAreaLebels(selection, data, config) {

    let group = selection.select('g.areaLabels').empty() ? selection.append('g') : selection.select('g.areaLabels');

    let areasData = Object.keys(data.areas)
      .map(area => Object.assign(data.areas[area], {
        name: area
      }))
      .map((area, idx, arr) => {
        area.startAngle = config.scaleRadialPosition(arr.reduce((total, curr, idxArea) => {
            return idxArea < idx ? total + (curr.count) : total;
          },
          0
        ))
        ;

        area.endAngle = config.scaleRadialPosition(arr.reduce((total, curr, idxArea) => {
              return idxArea < idx ? total + curr.count : total;
            },
            -1
          )
          + area.count
        )
        ;

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

    let labelRadius = config.radiusMin - 21.5;

    group.selectAll('.areaLabelArc')
      .data(areasData)
      .enter()
      .append('path')
      .attr('id', (d, idx) => 'areaLabelPath_' + idx
      )
      .attr('class', 'areaLabelArc')
      .attr('d', (d, idx) => {
        let angleStart = d.startAngle - config.baseAngle;
        let angleEnd = d.endAngle - config.baseAngle;
        let angleMid = (d.startAngle + d.endAngle) / 2;

        let pStart = [labelRadius * Math.cos(angleStart), labelRadius * Math.sin(angleStart)];
        let pEnd = [labelRadius * Math.cos(angleEnd), labelRadius * Math.sin(angleEnd)];

        return angleMid < PI / 2 || angleMid > PI * 1.5 ?
          `M ${pStart[0]}, ${pStart[1]} A ${labelRadius}, ${labelRadius} 0 0 1 ${pEnd[0]}, ${pEnd[1]}` :
          `M ${pEnd[0]}, ${pEnd[1]} A ${labelRadius}, ${labelRadius} 0 0 0 ${pStart[0]}, ${pStart[1]}`;
      })
    ;

    group.selectAll('.areaLabelDebug')
      .data(areasData)
      .enter()
      .append('text')
      .attr('class', (d, idx) => 'areaLabelDebug ' + '#areaLabel_' + idx
      )
      .attr('x', 0)
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', (d, idx) => '#areaLabelPath_' + idx
      )
      .attr('startOffset', '50%')
      .text((d) => d.name
      )
    ;

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
        })
      ;

    group.selectAll('.areaLabelTag')
      .data(tagsData)
      .enter()
      .insert('path')
      .attr('fill', d => d.color)
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
        M ${p1[0]}, ${p1[1]} A ${labelTagRadiusMax}, ${labelTagRadiusMax} 0 0 1 ${p2[0]}, ${p2[1]} L ${p3[0]}, ${p3[1]} L ${p4[0]}, ${p4[1]} A ${labelTagRadiusMin}, ${labelTagRadiusMin} 0 0 0 ${p5[0]},
${p5[1]} L ${p6[0]}, ${p6[1]} L ${p1[0]}, ${p1[1]}`;
      })
    ;

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
      .text((d) => d.name)
    ;
  }

  drawItemsLines(selection, data, config) {

    let group = selection.select('g.itemsLines').empty() ? selection.append('g') : selection.select('g.itemsLines');

    let linesData = data.items.map(p => {
        let angle = config.scaleRadialPositionWithBaseShift(p._pos);
        return [
          [config.radiusMin * Math.cos(angle), config.radiusMin * Math.sin(angle)], [config.radiusMaxLine * Math.cos(angle), config.radiusMaxLine * Math.sin(angle)]]
      })
      ;

    let lineFn = d3.line()
      .x(d => d[0])
      .y(d => d[1]);

    group.selectAll('.itemLine')
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
      .delay((d, idx) => idx * 10
      )
      .attr('stroke', config.colors.lineLight);
  }

  drawLegend() {
    const statuses = Object.keys(this.config.statuses).map((val, idx) => {
      return {
        idx,
        name: val,
        step: this.config.statuses[val]
      }
    });

    let arcBg = (d) => {
      const r = this.config.radiusMaxLine - (d.step + 0.25 / 2) * (this.config.radiusMaxLine - this.config.radiusMin - this.config.buffer);
      const r2 = this.config.radiusMaxLine - (d.step - 0.25 / 2) * (this.config.radiusMaxLine - this.config.radiusMin - this.config.buffer);
      return d3.arc()
        .innerRadius(r + 2)
        .outerRadius(r2 - 2)
        .cornerRadius(10)
        .startAngle(-(2 * PI - this.config.angleEnd) - this.config.angleStep/2)
        .endAngle(this.config.angleStart - this.config.angleStep/2)();
    };

    let arcLegend = (d) => {
      let r = this.config.radiusMaxLine - d.step * (this.config.radiusMaxLine - this.config.radiusMin - this.config.buffer);
      return d3.arc()
        .innerRadius(r)
        .outerRadius(r + 1)
        .startAngle(-(2 * PI - this.config.angleEnd) - this.config.angleStep/2)
        .endAngle(this.config.angleStart  - this.config.angleStep/2)();
    };

    let arcOuter = (d) => {
      let r = this.config.radiusMaxLine - (d.step + 0.25 / 2) * (this.config.radiusMaxLine - this.config.radiusMin - this.config.buffer);
      let r2 = this.config.radiusMaxLine - (d.step - 0.25 / 2) * (this.config.radiusMaxLine - this.config.radiusMin - this.config.buffer);
      return d3.arc()
        .innerRadius(r + 2)
        .outerRadius(r2 - 2)
        .cornerRadius(10)
        .startAngle(this.config.angleStart - this.config.angleStep/2)
        .endAngle(this.config.angleEnd - this.config.angleStep/2)();
    };

    this.group.append('g').classed('Legend-background', true).selectAll('.legendArcBg')
      .data(statuses)
      .enter()
      .append('path')
      .attr('class', 'legendArcBg')
      .attr('d', d => arcBg(d));

    this.group.append('g').classed('Legend-arcOuter', true).selectAll('.legendArcOuter')
      .data(statuses)
      .enter()
      .append('path')
      .attr('class', 'legendArcOuter')
      .attr('fill', 'red')
      .attr('d', d => arcOuter(d)
      );

    this.group.append('g').classed('Legend-innerPath', true).selectAll('.legendArcInnerPath')
      .data(statuses)
      .enter()
      .append('path')
      .attr('id', (d) => 'legendArcInnerPath_' + d.idx
      )
      .attr('class', 'legendArcInnerPath')
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('d', d => {
          return arcLegend(d).split('L')[0]
        }
      )
    ;

    this.group.append('g').classed('Legend-labels', true).selectAll('.legendLabel')
      .data(statuses)
      .enter()
      .append('text')
      .attr('class', (d, idx) => 'legendLabel')
      .attr('x', 0)
      .attr('dy', 8)
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', (d, idx) => '#legendArcInnerPath_' + idx)
      .attr('startOffset', '50%')
      .text((d) => d.name)
    ;

  }

  drawItems(selection, data, config) {
    let _self = this;
    let SYMBOL_TRIANGLE = d3.symbol().type(d3.symbolTriangle);
    let points = data.items.map((p, idx, arr) => {
      let rStart = config.radiusMin - Math.random() * 100;
      let rEnd = config.radiusMaxLine - config.buffer;
      let rPos = config.radiusMaxLine - config.statuses[p.status] * (config.radiusMaxLine - config.radiusMin - config.buffer);

      let angle = config.scaleRadialPositionWithBaseShift(p._pos);
      let origin = [rStart * Math.cos(angle), rStart * Math.sin(angle)];
      let destination = [rEnd * Math.cos(angle), rEnd * Math.sin(angle)];
      let pos = [rPos * Math.cos(angle), rPos * Math.sin(angle)];

      let historyLine = null;
      let historyDirection = 0;
      if (!!p.history && p.history.length > 0) {
        let hPos = config.radiusMaxLine - config.statuses[p.history[0].status] * (config.radiusMaxLine - config.radiusMin - config.buffer);

        historyLine = [
          [rPos * Math.cos(angle), rPos * Math.sin(angle)],
          [hPos * Math.cos(angle), hPos * Math.sin(angle)]
        ];

        origin = historyLine[0];
        destination = historyLine[1];
        historyDirection = hPos < rPos ? -1 : 1;
      }

      let path = !!p.history ? [origin, destination] : this.createJaggedPoints(origin, destination, 15, 30);
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
        .y(d => d[1])
      ;

    //draw item history line
    selection.selectAll('.itemHistoryLine')
      .data(points.filter(d => !!d.historyLine)
      )
      .enter()
      .append('path')
      .attr('class', 'itemHistoryLine')
      .attr('fill', 'none')
      .attr('stroke', d => d.historyDirection === 1 ? d.color : HISTORY_COLOR
      )
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '2 3')
      .attr('d', d => lineHistory(d.historyLine)
      )
    ;

    selection.selectAll('.itemOld')
      .data(points.filter(d => !d.isNew))
      .enter()
      .append('circle')
      .attr('class', 'item itemOld')
      .attr('fill', 'transparent')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .attr('cx', d => d.origin[0])
      .attr('cy', d => d.origin[1])
      .attr('r', 4)
      .call(_self.animate);

    selection.selectAll('.itemNew')
      .data(points.filter(d => d.isNew)
      )
      .enter()
      .append('path')
      .attr('class', 'item itemNew')
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('stroke-width', 1.5)
      .attr('d', SYMBOL_TRIANGLE.size(40))
      .attr('transform', d => `translate(${d.pos[0]}, ${d.pos[1]}) rotate(${this.rad2deg(d.angle) - 90})`)
      .transition()
      .delay((d, idx) => idx * 100)
      .attr('fill', 'transparent')
      .attr('stroke', d => data.areas[d.section].color
      )
  }

// --- data functions
  processData(rawData) {
    let data = {
      areas: {}
    };

    const blips = this.options.debug && this.options.limit ? rawData.blips.slice(0, this.options.limit) : rawData.blips;

    data.items = [ // blips
      ...(blips || []).map(blip => {
        blip.section = blip.section.trim();
        return blip;
      })].sort(function (a, b) {
      return d3.ascending(a.section.toLowerCase(), b.section.toLowerCase()) || d3.ascending(a.name.toLowerCase(), b.name.toLowerCase());
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

        return d;
      })
    ;

    let areas = data.items // == sections
        .map(item => item.section.trim())
        .filter((item, idx, self) => self.indexOf(item) === idx);

    areas.forEach((area, idx) => {
      data.areas[area] = {
        idx,
        color: AREA_COLORS[idx],
        count: data.items.filter(item => item.section === area
        ).length
      }
    })
    ;

    data.statuses = rawData.statuses;

    return data;
  }

// --- helpers
  getTextLength(str, selection) {
    let textElement = selection.append('text')
      .attr('x', 100)
      .attr('y', 100)
      .attr('class', 'itemLabel')
      .text(str);

    let width = textElement.node().getComputedTextLength();
    textElement.remove();

    return width;
  }

  rad2deg(rad) {
    return rad * (180 / PI);
  }

  deg2rad(deg) {
    return deg * (PI / 180);
  }

  getConfig() {
    /* --- local pointers */
    const containerEl = this.svg;
    const items = this.data.items;
    const statusesNames = this.data.statuses;

    const width = 1000;
    const height = 1000;
    const legendReserverAngle = 10;
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

    if (!statusesNames) {
      console.warn('Statuses are not definded!');
      return false;
    }

    // Map statuses to their position
    let statuses = {};
    let r = 1 / statusesNames.length;
    for (let statusIdx in statusesNames.reverse()) {
      let statusName = statusesNames[statusIdx].name
      statuses[statusName] = r - (1 / statusesNames.length) / 2;
      r = r + 1 / statusesNames.length;
    }

    // --- estimate length of longest technology
    const longestLabel = items.map(item => item.name
    )
      .sort((a, b) => (a.length - b.length)
      )
      .reverse()[0];

    const longestLabelWidth = this.getTextLength(longestLabel, containerEl);

    const radiusMax = 0.5 * 0.85 * (bound - longestLabelWidth);
    const radiusMaxLine = radiusMax - 10; // - 33;

    const radiusMin = 200;

    // --- angles calculcation with reserved space
    const angleStart = this.deg2rad(legendReserverAngle + legendReserverAngle/2);
    const angleEnd = this.deg2rad(360 - legendReserverAngle + legendReserverAngle/2); // 2 * PI === 360
    const angleStep = (angleEnd - angleStart) / items.length;
    const reservedAngle = this.deg2rad(legendReserverAngle);
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

  createJaggedPoints(start, end, maxPeakHeight, minPeakDistance) {
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
    const [rotatedEndX, rotatedEndY] = this.rotate(start, end, thetaRadians);

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
        if (i === 0
        ) {
          return start;
        }
        else if (i === points.length - 1) {
          return end;
        }

        return this.rotate(start, point, -thetaRadians);
      })
      ;

    // restore original directionality if we reversed it
    return reversed ? unrotated.reverse() : unrotated;
  }

  rotate(origin, point, thetaRadians) {
    const [originX, originY] = origin;
    const [pointX, pointY] = point;

    const rotatedEndX = originX + (pointX - originX) * Math.cos(thetaRadians) - (pointY - originY) * Math.sin(thetaRadians);
    const rotatedEndY = originY + (pointX - originX) * Math.sin(thetaRadians) + (pointY - originY) * Math.cos(thetaRadians);

    return [rotatedEndX, rotatedEndY];
  }

  animate(selection) {
    selection.transition()
      .duration(1500)
      //.delay(() => Math.random()*500)
      .ease(d3.easeBounceOut)
      .attrTween('transform', (d) => interpolate(d.path))
      .call(endAll, function () {
        selection.transition()
          .duration(1500)
          .ease(d3.easeCubicIn)
          .attr('transform', p => `translate(${p.pos[0] - p.origin[0]}, ${p.pos[1] - p.origin[1]})`)
        ;
      });

    function endAll(transition, callback) {
      if (transition.size() === 0) {
        callback()
      }
      var n = 0;
      transition.each(function () {
        ++n;
      })
        .on('end', function () {
          if (!--n) callback.apply(this, arguments);
        });
    }

    function interpolate(points) {
      let n = points.length - 1;
      let step = 1 / n;

      return function (t) {
        let idx1 = Math.floor(t * n);
        let idx2 = Math.ceil(t * n);
        let pct = (t - step * idx1) / step;
        let mid = midpoint(points[idx1], points[idx2], pct);

        return `translate(${mid[0] - points[0][0]}, ${mid[1] - points[0][1]})`;
      }
    }

    function midpoint(p1, p2, per) {
      return [p1[0] + (p2[0] - p1[0]) * per, p1[1] + (p2[1] - p1[1]) * per];
    }
  }

  /** Main init function */
  init() {
    this.svg.classed('debug', !!this.options.debug);
    this.group = this.svg.append('g')
      .classed('RadarChart-group', true)
      .attr('transform', `translate(${this.config.center.x}, ${this.config.center.y})`);

    this.drawLegend();    
    this.drawItemsLines(this.group, this.data, this.config);
    this.drawItemLabels(this.group, this.data.items, this.config);
    this.drawAreaLebels(this.group, this.data, this.config);
    this.drawItems(this.group, this.data, this.config);

    if (this.options.debug) {
      this.drawDebugLayer();
    }
  }

  /** Update function */
  update(data) {

  }
}

export {Chart as default}
