// Ajit – scatter story for cars data

let scene = 0;
let cars = [];

// 0 = all, 1 = light cars, 2 = hover
const titles = [
  "Horsepower vs MPG (for all cars)",
  "Lightweight cars (< 2,500 lb)",
  "Hover a dot to see the car model"
];

d3.csv("data.csv").then(raw => {
  cars = raw.map(d => ({
    mpg: +d.mpg,
    hp: +d.horsepower,
    wt: +d.weight,
    name: d.name
  }));
  draw();
});

function draw() {
  d3.select("#visual").html("");

  if (scene === 0) makePlot(titles[0], _ => true);
  if (scene === 1) makePlot(titles[1], d => d.wt < 2500);
  if (scene === 2) makePlot(titles[2], _ => true, true);
}

function makePlot(title, isHiLite, showTip = false) {

  d3.select("#title").text(title);

  const w = 600, h = 400, m = 50;

  const svg = d3.select("#visual")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

  const x = d3.scaleLinear().domain(d3.extent(cars, d => d.hp)).range([m, w - m]);
  const y = d3.scaleLinear().domain(d3.extent(cars, d => d.mpg)).range([h - m, m]);

  // axes
  svg.append("g")
     .attr("transform", `translate(0,${h - m})`)
     .call(d3.axisBottom(x));

  svg.append("g")
     .attr("transform", `translate(${m},0)`)
     .call(d3.axisLeft(y));

  /* axis labels */
  svg.append("text")                   // x-label
     .attr("x", w / 2)
     .attr("y", h - 8)
     .attr("text-anchor", "middle")
     .attr("font-size", "11px")
     .text("Horsepower");

  svg.append("text")                   // y-label
     .attr("x", -h / 2)
     .attr("y", 18)
     .attr("transform", "rotate(-90)")
     .attr("text-anchor", "middle")
     .attr("font-size", "11px")
     .text("Miles per Gallon");

  // dots
  const dots = svg.selectAll("circle")
    .data(cars)
    .enter().append("circle")
      .attr("cx", d => x(d.hp))
      .attr("cy", d => y(d.mpg))
      .attr("r", 5)
      .attr("fill", d => isHiLite(d) ? "#0080ff" : "#c0c0c0");

  if (showTip) {
    dots.on("mouseover", (e, d) => {
          d3.select(e.currentTarget).attr("fill", "#ffbf00");
          svg.append("text")
             .attr("id", "tip")
             .attr("x", x(d.hp) + 8)
             .attr("y", y(d.mpg) - 8)
             .text(d.name);
        })
        .on("mouseout", (e, d) => {
          d3.select(e.currentTarget)
            .attr("fill", isHiLite(d) ? "#0080ff" : "#c0c0c0");
          svg.select("#tip").remove();
        });
  }

  // lazy annotation box
  svg.append("g")
     .call(
       d3.annotation().annotations([
         { note: { title }, x: w - 90, y: m, dx: 0, dy: 0 }
       ])
     );
}

// button hooks
function nextScene() { if (scene < 2) scene++; draw(); }
function prevScene() { if (scene > 0) scene--; draw(); }
