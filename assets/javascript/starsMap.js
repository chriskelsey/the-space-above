var starts = [];
function SetStars(arr) {
  var w = 960,
    h = 500;

  var labelDistance = 0;

  var vis = d3
    .select("#d3Box")
    .append("svg:svg")
    .attr("width", "100%")
    .attr("height", "100%");

  // vis
  //   .append("rect")
  //   .attr("width", "100%")
  //   .attr("height", "100%")
  //   .attr("fill", "black");

  stars = arr;

  var nodes = [];
  var labelAnchors = [];
  var labelAnchorLinks = [];
  var links = [];

  for (var i = 0; i < stars.length; i++) {
    var node = {
      label: stars[i].name
    };
    nodes.push(node);
    labelAnchors.push({
      node: node
    });
    labelAnchors.push({
      node: node
    });
  }

  for (var i = 0; i < nodes.length; i++) {
    for (var j = 0; j < i; j++) {
      if (Math.random() > 0.95)
        links.push({
          source: i,
          target: j,
          weight: Math.random()
        });
    }
    labelAnchorLinks.push({
      source: i * 2,
      target: i * 2 + 1,
      weight: 1
    });
  }

  var force = d3.layout
    .force()
    .size([w / 1.3, h])
    .nodes(nodes)
    .links(links)
    .gravity(1)
    .linkDistance(0)
    .charge(-3000)
    .linkStrength(function(x) {
      return x.weight * 10;
    });

  force.start().on("end", function(p) {
    d3.selectAll("g.node").each(function(d) {
      d.fixed = true;
    });
  });

  var force2 = d3.layout
    .force()
    .nodes(labelAnchors)
    .links(labelAnchorLinks)
    .gravity(0)
    .linkDistance(30)
    .linkStrength(8)
    .charge(-100)
    .size([w, h]);
  force2.start().on("end", function(p) {
    d3.selectAll("g.node").each(function(d) {
      d.fixed = true;
    });
  });

  var link = vis
    .selectAll("line.link")
    .data(links)
    .enter()
    .append("svg:line")
    .attr("class", "link")
    .style("stroke", "#CCC");

  var node = vis
    .selectAll("g.node")
    .data(force.nodes())
    .enter()
    .append("svg:g")
    .attr("class", "node");
  node
    .append("svg:circle")
    .attr("r", 5)
    .style("fill", "#555")
    .style("stroke", "#FFF")
    .style("stroke-width", 3);
  // node.call(force.drag);

  for (var i = 0; i < document.querySelectorAll("g.node").length; i++) {
    document.querySelectorAll("g.node")[i].setAttribute("data-attribute", i);
  }

  var anchorLink = vis
    .selectAll("line.anchorLink")
    .data(labelAnchorLinks)
    .enter()
    .append("svg:line")
    .attr("class", "anchorLink")
    .style("stroke", "#999");

  var anchorNode = vis
    .selectAll("g.anchorNode")
    .data(force2.nodes())
    .enter()
    .append("svg:g")
    .attr("class", "anchorNode");
  anchorNode
    .append("svg:circle")
    .attr("r", 0)
    .style("fill", "#FFF");
  anchorNode
    .append("svg:text")
    .text(function(d, i) {
      return i % 2 == 0 ? "" : d.node.label;
    })
    .style("fill", "#fff")
    .style("font-family", "Arial")
    .style("font-size", 12);

  var updateLink = function() {
    this.attr("x1", function(d) {
      return d.source.x;
    })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });
  };

  var updateNode = function() {
    this.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  };

  force.on("tick", function() {
    force2.start();

    node.call(updateNode);

    anchorNode.each(function(d, i) {
      if (i % 2 == 0) {
        d.x = d.node.x;
        d.y = d.node.y;
      } else {
        var b = this.childNodes[1].getBBox();

        var diffX = d.x - d.node.x;
        var diffY = d.y - d.node.y;

        var dist = Math.sqrt(diffX * diffX + diffY * diffY);

        var shiftX = (b.width * (diffX - dist)) / (dist * 2);
        shiftX = Math.max(-b.width, Math.min(0, shiftX));
        var shiftY = 5;
        this.childNodes[1].setAttribute(
          "transform",
          "translate(" + shiftX + "," + shiftY + ")"
        );
      }
    });

    anchorNode.call(updateNode);

    link.call(updateLink);
    anchorLink.call(updateLink);
  });
}

$(document).on("click", ".node", function() {
  var star = stars[$(this).data("attribute")];

  console.log("Star Name: " + star.name);
  console.log("Star Image: " + star.image);
  console.log("Star Description: " + star.blurb);

  if (star.blurb == "") {
    $(".card-img-top").attr(
      "src",
      "https://www.spaceanswers.com/wp-content/uploads/2012/11/Astronaut-temp-Moon.jpg"
    );
    $(".card-title").empty();
    $(".card-title").append("No Wikipedia Info");
    $(".searchmatch").empty();
    $(".searchmatch").append(
      "There is no page available for this celestial body under the specified name. Maybe you should make one!"
    );
  } else if (star.blurb.includes("commonly refers to")) {
    $(".card-img-top").attr(
      "src",
      "https://www.spaceanswers.com/wp-content/uploads/2012/11/Astronaut-temp-Moon.jpg"
    );
    $(".card-title").empty();
    $(".card-title").append("Many Occurences");
    $(".searchmatch").empty();
    $(".searchmatch").append(
      "This name references many Wikipedia pages. Please visit the <a href= 'www.wikipedia.com'>Wikipedia</a> website to learn more."
    );
  } else if (star.blurb.includes("refer to")) {
    $(".card-img-top").attr(
      "src",
      "https://www.spaceanswers.com/wp-content/uploads/2012/11/Astronaut-temp-Moon.jpg"
    );
    $(".card-title").empty();
    $(".card-title").append("Many Occurences");
    $(".searchmatch").empty();
    $(".searchmatch").append(
      "This name references many Wikipedia pages. Please visit the ('<a href= www.wikipedia.com>Wikipedia</a>') website to learn more."
    );
  } else {
    $(".card-img-top").attr("src", star.image);
    $(".card-title").empty();
    $(".card-title").append(star.name);
    $(".searchmatch").empty();
    $(".searchmatch").append(star.blurb);
  }
});
