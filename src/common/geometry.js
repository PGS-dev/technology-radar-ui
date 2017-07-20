const PI = 3.14159

export function deg2rad (deg) {
  return deg * (PI / 180)
}

export function rad2deg (rad) {
  return rad * (180 / PI)
}

export function pointCircle (radius, angle) {
  return [radius * Math.sin(angle), radius * -Math.cos(angle)]
}

export function midpoint (p1, p2, per) {
  return [p1[0] + (p2[0] - p1[0]) * per, p1[1] + (p2[1] - p1[1]) * per]
}

export function rotate (origin, point, thetaRadians) {
  const [originX, originY] = origin
  const [pointX, pointY] = point

  const rotatedEndX = originX + (pointX - originX) * Math.cos(thetaRadians) - (pointY - originY) * Math.sin(thetaRadians)
  const rotatedEndY = originY + (pointX - originX) * Math.sin(thetaRadians) + (pointY - originY) * Math.cos(thetaRadians)

  return [rotatedEndX, rotatedEndY]
}

export function getTextLength (str, selection) {
  let textElement = selection.append('text')
    .attr('x', 100)
    .attr('y', 100)
    .attr('class', 'itemLabel')
    .text(str)

  let width = textElement.node().getComputedTextLength()
  textElement.remove()

  return width
}

export function interpolate (points) {
  let n = points.length - 1
  let step = 1 / n

  return function (t) {
    let idx1 = Math.floor(t * n)
    let idx2 = Math.ceil(t * n)
    let pct = (t - step * idx1) / step
    let mid = midpoint(points[idx1], points[idx2], pct)

    return `translate(${mid[0] - points[0][0]}, ${mid[1] - points[0][1]})`
  }
}

export function endAll (transition, callback) {
  if (transition.size() === 0) {
    callback()
  }
  let n = 0
  transition.each(function () {
    ++n
  }).on('end', function () {
    if (!--n) callback.apply(this, arguments)
  })
}
