/* eslint-disable */
import * as d3 from 'd3'

import {
  NEW_ITEM_DELAY,
  NEW_ITEM_SIZE,
  PI,
  WIDTH,
  HEIGHT,
  PALETTE,
  SYMBOL_TRIANGLE,
} from './chart.const';

import {
  deg2rad,
  endAll,
  getTextLength,
  interpolate,
  pointCircle,
  rad2deg,
  textPercentWidth,
} from '../common/geometry';

function sanitizeId(id) {
  return id.replace(/([^\w:\-\.])/g, '');
}

class Chart {
  constructor(el, data, onClick, options) {
    console.clear();

    this.svg = d3.select(el);
    this.options = options;

    this.data = this.processData(data);
    this.config = this.getConfig();
    this.events = {
      onClick
    };
  }

  /* --- DRAWING functions */
  drawDebugLayer() {
    console.warn('--- DEBUG LAYER ---');

    console.log('this.config', this.config);
    console.log('this.config.angleStart', this.config.angleStart);
    console.log('this.config.angleStart', this.config.angleEnd);
    console.log('this.config.angleStep', this.config.angleStep);

    const debugLayer = this.group.append('g').classed('RadarChar-debug', true);

    // draw line representing angleStart, angleEnd for displaying legend
    const pStart = pointCircle(500, this.config.scaleRadialPosition(0));
    const pEnd = pointCircle(500, this.config.scaleRadialPosition(this.data.items.length - 1));

    debugLayer.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', pStart[0])
      .attr('y2', pStart[1]);

    debugLayer.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', pEnd[0])
      .attr('y2', pEnd[1]);

    // draw line representing angleStart, angleEnd for displaying legend
    const pStart2 = pointCircle(500, this.config.scaleRadialPositionShifted(0));
    const pEnd2 = pointCircle(500, this.config.scaleRadialPositionShifted(this.data.items.length - 1));

    debugLayer.append('line')
      .classed('cyan', true)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', pStart2[0])
      .attr('y2', pStart2[1]);

    debugLayer.append('line')
      .classed('cyan', true)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', pEnd2[0])
      .attr('y2', pEnd2[1]);

    // draw step angles
    debugLayer.selectAll('.angleStep')
      .data(this.data.items)
      .enter()
      .append('line')
      .classed('angleStep', true)
      .each((d, idx, nodes) => {
        const angle = this.config.scaleRadialPositionShifted(idx);

        const p = pointCircle(250, angle);
        d3.select(nodes[idx])
          .attr('x2', p[0])
          .attr('y2', p[1]);
      });
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
      const r = this.config.radiusMaxPadding - (d.step + 0.25 / 2) * (this.config.radiusMaxPadding - this.config.radiusMin);
      const r2 = this.config.radiusMaxPadding - (d.step - 0.25 / 2) * (this.config.radiusMaxPadding - this.config.radiusMin);
      return d3.arc()
        .innerRadius(r + 2)
        .outerRadius(r2 - 2)
        .cornerRadius(10)
        .startAngle(this.config.angleStart)
        .endAngle(this.config.angleEnd)();
    };

    let arcOuter = (d) => {
      let r = this.config.radiusMaxPadding - (d.step + 0.25 / 2) * (this.config.radiusMaxPadding - this.config.radiusMin);
      let r2 = this.config.radiusMaxPadding - (d.step - 0.25 / 2) * (this.config.radiusMaxPadding - this.config.radiusMin);
      return d3.arc()
        .innerRadius(r + 2)
        .outerRadius(r2 - 2)
        .cornerRadius(10)
        .startAngle(this.config.angleStart)
        .endAngle(2 * PI + this.config.angleEnd)();
    };

    let arcLegend = (d) => {
      const r = this.config.radiusMaxPadding - d.step * (this.config.radiusMaxPadding - this.config.radiusMin);
      return d3.arc()
        .innerRadius(r + 1)
        .outerRadius(r + 0)
        .cornerRadius(10)
        .startAngle(this.config.angleEnd)
        .endAngle(this.config.angleStart)();
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
      .attr('id', (d) => 'legendArcOuter_' + sanitizeId(d.name))
      .attr('fill', 'red')
      .attr('d', d => arcOuter(d));

    this.group.append('g').classed('Legend-innerPath', true).selectAll('.legendArcInnerPath')
      .data(statuses)
      .enter()
      .append('path')
      .attr('id', (d) => 'legendArcInnerPath_' + d.idx)
      .attr('class', 'legendArcInnerPath')
      .attr('fill', 'none')
      .attr('d', d => {
        return arcLegend(d).split('L')[0]
      });

    this.group.append('g').classed('Legend-labels', true).selectAll('.legendLabel')
      .data(statuses)
      .enter()
      .append('text')
      .attr('class', (d, idx) => 'legendLabel')
      .attr('id', (d) => 'legendLabel_' + sanitizeId(d.name))
      .attr('x', 0)
      .attr('dy', 8)
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', (d, idx) => '#legendArcInnerPath_' + idx)
      .attr('startOffset', '50%')
      .text((d) => d.name);
  }

  drawItemsLines() {
    let line = d3.line()
      .x(d => d[0])
      .y(d => d[1]);

    const lines = this.data.items.map(p => {
      const angle = this.config.scaleRadialPositionShifted(p._pos);
      return [
        pointCircle(this.config.radiusMin, angle),
        pointCircle(this.config.radiusMaxPadding, angle),
      ];
    });

    this.group.append('g').classed('ItemLines', true).selectAll('.ItemLine')
      .data(lines)
      .enter()
      .append('path')
      .attr('class', 'itemLine')
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '3 5')
      .attr('d', line)
      .transition()
      .delay((d, idx) => idx * 10)
      .attr('stroke', PALETTE.itemLine);
  }

  drawItems() {
    let lineHistory = d3.line()
      .x(d => d[0])
      .y(d => d[1]);

    const points = this.data.items.map((p, idx, points) => {

      const angle = this.config.scaleRadialPositionShifted(p._pos);
      const radiusStart = this.config.radiusMin - Math.random() * 100;
      const radiusEnd = this.config.radiusMaxPadding - this.config.statuses[p.status] * (this.config.radiusMaxPadding - this.config.radiusMin);


      const isNew = p._isNew;
      const color = this.data.areas[p.section].color;

      let positionStart = pointCircle(radiusStart, angle);
      let positionEnd = pointCircle(radiusEnd, angle);
      let positionMax = pointCircle(this.config.radiusMaxPadding, angle);

      let pathHistory = null;
      let pathHistoryDirection = 0;

      if (!!p.history && p.history.length > 0) {
        positionMax = pointCircle(this.config.radiusMaxPadding - this.config.statuses[p.history[0].status] * (this.config.radiusMaxPadding - this.config.radiusMin), angle);
        pathHistory = [positionEnd, positionMax];
      }

      const pathPoints = [positionStart, positionMax];

      return {
        angle,
        color,
        isNew,
        pathPoints,
        pathHistory,
        pathHistoryDirection,
        positionStart,
        positionEnd
      }
    });

    let circleSize = points.length > 0 ? 500/points.length : 0;
    circleSize = circleSize > 5 ? 5 : circleSize;
    let triangleSize = points.length > 0 ? 3000/points.length : 0;
    triangleSize = triangleSize > 50 ? 50 : triangleSize;

    /* --- draw old items history lines --- */
    this.group.append('g').classed('Items--historyLines', true).selectAll('.Items--historyLine')
      .data(points.filter(d => !!d.pathHistory))
      .enter()
      .append('path')
      .attr('class', 'Items--historyLine')
      .attr('fill', 'none')
      .attr('stroke', d => d.pathHistoryDirection === 1 ? d.color : PALETTE.historyLine)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '2 3')
      .attr('d', d => lineHistory(d.pathHistory));

    /* --- draw old items --- */
    this.group.append('g').classed('Items--old', true).selectAll('.itemOld')
      .data(points.filter(d => !d.isNew))
      .enter()
      .append('circle')
      .attr('class', 'Item Item--old')
      .attr('fill', 'transparent')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .attr('cx', d => d.positionStart[0])
      .attr('cy', d => d.positionStart[1])
      .attr('r', circleSize)
      .call(this.animateItems);

    /* --- draw new items --- */
    this.group.append('g').classed('Items--new', true).selectAll('.itemNew')
      .data(points.filter(d => d.isNew))
      .enter()
      .append('path')
      .attr('class', 'item itemNew')
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('stroke-width', 1.5)
      .attr('d', SYMBOL_TRIANGLE.size(triangleSize))
      .attr('transform', d => `translate(${d.positionEnd[0]}, ${d.positionEnd[1]}) rotate(${rad2deg(d.angle) - 60})`)
      .transition()
      .delay((d, idx) => idx * NEW_ITEM_DELAY)
      .attr('fill', 'transparent')
      .attr('stroke', d => d.color);
  }

  drawItemLabels() {
    let fontSize = 100;
    let arcLabel = d3.arc()
      .outerRadius(this.config.radiusMax)
      .innerRadius(this.config.radiusMax)
      .startAngle(d => this.config.scaleRadialPositionShifted(d))
      .endAngle(d => this.config.scaleRadialPositionShifted(d));

    if(this.data.items.length > 120) {
      fontSize =  Math.ceil(fontSize / this.data.items.length * 120);
    }

    this.group.append('g').classed('ItemsLabels', true).selectAll('.ItemLabel')
      .data(this.data.items)
      .enter()
      .append('text')
      .attr('class', 'ItemLabel')
      .attr('font-size', fontSize + '%')
      .attr('alignment-baseline', 'middle')
      .attr('transform', (d, idx) => {
        const midAngle = this.config.scaleRadialPositionShifted(idx);
        return `translate(${arcLabel.centroid(idx)[0]}, ${arcLabel.centroid(idx)[1]}) rotate(${rad2deg(midAngle) - 90}) rotate(${midAngle > PI ? -180 : 0})`;
      })
      .attr('text-anchor', (d, idx) => {
        return this.config.scaleRadialPositionShifted(idx) <= PI ? 'start' : 'end';
      })
      .on('click', this.events.onClick)
      .text(d => `${!!d._isNew ? '* ' : ''} ${d.name}`);
  }

  drawAreaLebels() {
    const group = this.group.append('g').classed('Sections', true);

    let areasData = Object.keys(this.data.areas)
      .map(area => Object.assign(this.data.areas[area], {
        name: area
      }))
      .map((area, idx, arr) => {
        area.startAngle = this.config.scaleRadialPositionShifted(arr.reduce((total, curr, idxArea) => {
            return idxArea < idx ? total + (curr.count) : total;
          }, 0));

        area.endAngle = this.config.scaleRadialPositionShifted(arr.reduce((total, curr, idxArea) => {
            return idxArea < idx ? total + curr.count : total;
          }, -1) + area.count);

        return area;
      });

    let arc = d3.arc()
      .innerRadius(this.config.radiusMin - 23)
      .outerRadius(this.config.radiusMin - 20)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle);

    group.append('g').classed('SectionLabels', true).selectAll('.Section--line')
      .data(areasData)
      .enter()
      .append('path')
      .attr('class', 'Section--line')
      .attr('fill', d => d.color)
      .attr('d', arc)

    let labelRadius = this.config.radiusMin - 21.5;

    group.append('g').classed('SectionLabels--paths', true).selectAll('.Section--labelArc')
      .data(areasData)
      .enter()
      .append('path')
      .attr('id', (d, idx) => 'Section--labelArc_' + idx)
      .attr('class', 'Section--labelArc')
      .attr('d', (d, idx) => {
        let angleStart = d.startAngle;
        let angleEnd = d.endAngle;
        let angleMid = (d.startAngle + d.endAngle) / 2;

        let pStart = pointCircle(labelRadius, angleStart);
        let pEnd = pointCircle(labelRadius, angleEnd);
        let pDiff = d.endAngle - d.startAngle > PI;

        return angleMid < PI / 2 || angleMid > PI * 1.5 ?
          `M ${pStart[0]}, ${pStart[1]} A ${labelRadius}, ${labelRadius} 0 0 1 ${pEnd[0]}, ${pEnd[1]}` :
          `M ${pEnd[0]}, ${pEnd[1]} A ${labelRadius}, ${labelRadius} 0 ${pDiff ? 1 : 0} 0 ${pStart[0]}, ${pStart[1]}`;
      });

    group.append('g').classed('SectionLabels--textDebug', true).selectAll('.areaLabelDebug')
      .data(areasData)
      .enter()
      .append('text')
      .attr('class', (d, idx) => 'areaLabelDebug ' + '#areaLabel_' + idx)
      .attr('x', 0)
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', (d, idx) => '#Section--labelArc_' + idx)
      .attr('startOffset', '50%')
      .text(d => d.name);

    let labelTagRadiusMax = this.config.radiusMin - 21.5 + 15;
    let labelTagRadiusMin = this.config.radiusMin - 21.5 - 15;

    let tagsData = d3.selectAll('.areaLabelDebug').nodes()
      .map((node, idx) => {
        let textLength = node.getComputedTextLength() + 10;
        let midAngle = (areasData[idx].startAngle + areasData[idx].endAngle) / 2;
        let startAngle = areasData[idx].startAngle;
        let endAngle = areasData[idx].endAngle;
        let circumference = 2 * PI * labelRadius;

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

    group.append('g').classed('SectionLabels--shapes', true).selectAll('.areaLabelTag')
      .data(tagsData)
      .enter()
      .insert('path')
      .attr('fill', d => d.color)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3)
      .attr('class', 'areaLabelTag')
      .attr('d', (d, idx) => {
        let p1 = pointCircle(labelTagRadiusMax, d.midAngle - d.offsetAngle);
        let p2 = pointCircle(labelTagRadiusMax, d.midAngle + d.offsetAngle);
        let p3 = pointCircle(labelRadius, d.midAngle + d.offsetAngle + d.offsetSide);
        let p4 = pointCircle(labelTagRadiusMin, d.midAngle + d.offsetAngle);
        let p5 = pointCircle(labelTagRadiusMin, d.midAngle - d.offsetAngle);
        let p6 = pointCircle(labelRadius, d.midAngle - d.offsetAngle - d.offsetSide);

        return `
        M ${p1[0]}, ${p1[1]} A ${labelTagRadiusMax}, ${labelTagRadiusMax} 0 0 1 ${p2[0]}, ${p2[1]} L ${p3[0]}, ${p3[1]} L ${p4[0]}, ${p4[1]} A ${labelTagRadiusMin}, ${labelTagRadiusMin} 0 0 0 ${p5[0]},
${p5[1]} L ${p6[0]}, ${p6[1]} L ${p1[0]}, ${p1[1]}`;
      });

    group.selectAll('SectionLabels--textDebug').remove();

    let sectionLabelsText = group.append('g').classed('SectionLabels--text', true).selectAll('.areaLabel')
      .data(areasData)
      .enter()
      .append('text');

    sectionLabelsText
      .append('title')
      .text(d => d.name);

    sectionLabelsText
      .attr('class', (d, idx) => 'areaLabel ' + '#areaLabel_' + idx)
      .attr('x', 0)
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', (d, idx) => '#Section--labelArc_' + idx)
      .attr('startOffset', '50%')
      .text((d, idx) => {
        const textWidth = getTextLength(d.name, this.svg);
        const pathWidth = document.getElementById('Section--labelArc_' + idx).getTotalLength();
        const percent = Math.floor(pathWidth / textWidth * 0.8 * 100) / 100;

        return textWidth > pathWidth ?
         pathWidth > 10 ? `${textPercentWidth(d.name, percent)}...` : '' :
         d.name;
      });
  }

  animateItems(selection) {
    selection.transition()
      .duration(1500)
      .ease(d3.easeBounceOut)
      .attrTween('transform', (d) => interpolate(d.pathPoints))
      .call(endAll, function () {
        selection.transition()
          .duration(1500)
          .ease(d3.easeCubicIn)
          .attr('transform', p => `translate(${p.positionEnd[0] - p.positionStart[0]}, ${p.positionEnd[1] - p.positionStart[1]})`);
      });
  }

  /* ---  data functions --- */
  processData(rawData) {
    let data = {
      areas: {}
    };

    const blips = this.options.debug && this.options.limit ? rawData.blips.slice(0, this.options.limit) : rawData.blips;

    data.items = [ // blips
        ...(blips || []).map(blip => {
          blip.section = blip.section.trim();
          return blip;
        })
      ].sort(function (a, b) {
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
      });

    let areas = data.items // == sections
      .map(item => item.section.trim())
      .filter((item, idx, self) => self.indexOf(item) === idx);

    areas.forEach((area, idx) => {
      data.areas[area] = {
        idx,
        color: PALETTE.areas[idx],
        count: data.items.filter(item => item.section === area).length
      }
    });

    data.statuses = rawData.statuses;

    return data;
  }

  /* --- prepare configuration --- */
  getConfig() {
    /* --- local pointers --- */
    const containerEl = this.svg;
    const items = this.data.items;

    const statusesNames = this.data.statuses;

    const count = items.length;
    const bound = Math.min(WIDTH, HEIGHT);

    const legendReserverAngle = this.options.legendAngle || 15;
    const baseAngle = 0;

    const center = {
      x: WIDTH / 2,
      y: HEIGHT / 2
    };

    // Map statusies to the position
    let statuses = {};
    let r = 1 / statusesNames.length;
    for (let statusIdx in statusesNames.reverse()) {
      let statusName = statusesNames[statusIdx].name
      statuses[statusName] = r - (1 / statusesNames.length) / 2;
      r = r + 1 / statusesNames.length;
    }

    // calculate radius
    // 1. get longest label length
    const longestLabel = items.map(item => item.name)
      .sort((a, b) => (b.length - a.length))[0];
    const longestLabelWidth = getTextLength(longestLabel, containerEl);

    // 2.
    const radiusMin = 200;
    const radiusMax = 0.5 * 0.85 * (bound - longestLabelWidth);
    const radiusMaxPadding = radiusMax - 10; //

    // calulating angles
    const angleStart = deg2rad(legendReserverAngle);
    const angleEnd = deg2rad(-legendReserverAngle);
    const angleStep = (2 * PI + Math.abs(angleEnd) + Math.abs(angleStart)) / (count);

    const scaleRadialPosition = d3.scaleLinear()
      .range([angleStart, 2 * PI + angleEnd])
      .domain([0, count - 1]);

    const scaleRadialPositionShifted = d3.scaleLinear()
      .range([angleStart + angleStep / 2, 2 * PI + angleEnd - angleStep / 2])
      .domain([0, count - 1]);

    return {
      center,
      angleStart,
      angleEnd,
      angleStep,
      radiusMin,
      radiusMax,
      radiusMaxPadding,
      statuses,
      scaleRadialPosition,
      scaleRadialPositionShifted
    }
  }

  /** Main init function */
  init() {
    console.log('--- Chart init()')

    this.svg.classed('debug', !!this.options.debug);
    this.group = this.svg.append('g')
      .classed('RadarChart-group', true)
      .attr('transform', `translate(${this.config.center.x}, ${this.config.center.y})`);

    this.drawLegend();
    this.drawItemsLines();
    this.drawItemLabels();
    this.drawAreaLebels();
    this.drawItems();

    if (this.options.debug) {
      this.drawDebugLayer();
    }
  }

  /** Update function */
  update(data) {
    // @TODO: implement General Update Pattern
  }
}

export {
  Chart as
  default
}
