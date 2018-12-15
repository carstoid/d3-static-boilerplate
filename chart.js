var d3 = require("d3");
var topojson = require("topojson");
var fs = require("fs");

// LOAD DATA
var data = require("./data/world-50m.v1.json")

// SETUP VIRTUAL DOM
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;
var svg = d3.select(document.body).append("svg");

// SCRIPT BODY
// select SVG and declare ht/width
var svg = d3.select("svg"),
    width = 960,
    height = 960,
    margin = {top: 20, right: 30, bottom: 30, left: 40};

var graticule = d3.geoGraticule().extentMajor([[-135, 0], [135, 90]]),
    outline = graticule.outline(),
    projection = d3.geoConicConformal().fitSize([width, height], outline),
    path = d3.geoPath().projection(projection);

var defs = svg.append("defs");

defs.append("path")
    .attr("id", "extent")
    .attr("d", path(outline));

defs.append("clipPath")
    .attr("id", "clip")
  .append("use")
    .attr("xlink:href", "#extent");

var g = svg.append("g")
    .attr("clip-path", "url(#clip)");

g.append("path")
    .attr("id", "graticule")
    .attr("fill", "none")
    .attr("stroke", "#777")
    .attr("stroke-width", 0.5)
    .attr("stroke-opacity", 0.5)
    .attr("d", path(graticule()));

g.append("use")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("xlink:href", "#extent");

var world = data;

g.insert("path", "#graticule")
    .attr("fill", "#222")
    .attr("d", path(topojson.feature(world, world.objects.land)));

g.insert("path", "#graticule")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5)
    .attr("d", path(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; })));

// PRINT TO STDOUT
console.log(d3.select('body').html());

// TO-DO, ADD STYLESHEET

//var svg_style = svg.append("defs")
// .append('style')
// .attr('type','text/css');

/*text of the CSS stylesheet below -- note the multi-line JS requires escape characters "\" at the end of each line
var css_text = "<![CDATA[ \
    .states { \
        fill: none; \
        stroke: #fff; \
        stroke-linejoin: round; \
    } \
]]> ";*/

//svg_style.text(css_text);
