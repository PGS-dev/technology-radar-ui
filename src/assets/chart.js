/* eslint-disable */
import * as d3 from 'd3'

import {
  PI,
  WIDTH,
  HEIGHT,
  AREA_COLORS,
  HISTORY_COLOR,
} from './chart.const';

import {
  deg2rad,
  rad2deg,
  pointCircle,
  interpolate,
  rotate,
  getTextLength,
} from '../common/geometry';


class Chart {
  constructor(el, data, clickHandler, options) {
    console.clear();

    this.svg = d3.select(el);
    this.options = options;

    this.data = this.processData(data);
    this.config = this.getConfig();
    this.events = {
      click: clickHandler
    };
  }

  /* -- DRAWING functions */
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
      .attr('x', 0)
      .attr('dy', 8)
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', (d, idx) => '#legendArcInnerPath_' + idx)
      .attr('startOffset', '50%')
      .text((d) => d.name);
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
        color: AREA_COLORS[idx],
        count: data.items.filter(item => item.section === area).length
      }
    });

    data.statuses = rawData.statuses;

    return data;
  }

  // --- helpers


  getConfig() {
    /* --- local pointers */
    const containerEl = this.svg;
    const items = this.data.items;

    const statusesNames = this.data.statuses;

    const count = items.length;
    const bound = Math.min(WIDTH, HEIGHT);

    const legendReserverAngle = 15;
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
    // this.drawItemsLines(this.group, this.data, this.config);
    // this.drawItemLabels(this.group, this.data.items, this.config);
    // this.drawAreaLebels(this.group, this.data, this.config);
    // this.drawItems(this.group, this.data, this.config);

    if (this.options.debug) {
      this.drawDebugLayer();
    }
  }

  /** Update function */
  update(data) {

  }
}

export {
  Chart as
  default
}
