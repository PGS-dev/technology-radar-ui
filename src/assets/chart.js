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
  rotate,
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
      .attr('r', 4)
      .call(this.animateItems);

    console.log(this.data.areas)

    /** --- draw new items --- */
    this.group.append('g').classed('Items--new', true).selectAll('.itemNew')
      .data(points.filter(d => d.isNew))
      .enter()
      .append('path')
      .attr('class', 'item itemNew')
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('stroke-width', 1.5)
      .attr('d', SYMBOL_TRIANGLE.size(NEW_ITEM_SIZE))
      .attr('transform', d => `translate(${d.positionEnd[0]}, ${d.positionEnd[1]}) rotate(${rad2deg(d.angle) - 60})`)
      .transition()
      .delay((d, idx) => idx * NEW_ITEM_DELAY)
      .attr('fill', 'transparent')
      .attr('stroke', d => d.color);
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
    this.drawItemsLines();
    this.drawItems();

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
