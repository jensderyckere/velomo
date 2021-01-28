export default class Calculator {
  constructor() {
    this.calculateDistanceBetween;
  };
  calculateDistanceBetween = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    lat1 = lat1 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;

    let radius = 6378100;

    let rho1 = radius * Math.cos(lat1);
    let z1 = radius * Math.sin(lat1);
    let x1 = rho1 * Math.cos(lon1);
    let y1 = rho1 * Math.sin(lon1);

    let rho2 = radius * Math.cos(lat2);
    let z2 = radius * Math.sin(lat2);
    let x2 = rho2 * Math.cos(lon2);
    let y2 = rho2 * Math.sin(lon2);

    let dot = (x1 * x2 + y1 * y2 + z1 * z2);
    let cos_theta = dot / (radius*radius);

    let theta = Math.acos(cos_theta);

    return radius * theta;
  };
};
