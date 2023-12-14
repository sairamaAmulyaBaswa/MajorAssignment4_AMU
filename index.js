const countries = [
    'Trinidad and Tobago', 'Serbia', 'Tunisia', 'Turkey', 'United Kingdom', 'United States','Australia', 'Austria', 'Belgium', 'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China',
    'Colombia', 'Ecuador', 'Egypt', 'Finland', 'France',
    'Gabon', 'Germany', 'Greece', 'Hong Kong', 'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq',
    'Ireland', 'Italy', 'Pakistan','Croatia', 'Czech Republic', 'Denmark', 
    'Philippines', 'Poland', 'Polytechnic Univ', 'Portugal', 'Qatar', 'Romania', 'Russian Federation',
    'Saudi Arabia', 'Singapore', 'Slovakia', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
    'Taiwan', 'Thailand','Kazakhstan', 'Lebanon', 'Netherlands', 'Norway', 'Japan',
];

d3.json("./data/Assignment_NETWORK.json").then(function (data) {
    const colorScale = d3.scaleOrdinal(d3.schemeSet3)
        .domain(countries);
    


    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom;

    const svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-1))
        .force("collide", d3.forceCollide(d => (d.num_citations / 1000) + 5).iterations(2))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const links = svg.selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke", "blue");

    const node = svg.selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", d => (d.num_citations / 1000) + 5)
        .attr("fill", d => colorScale(d.country));

    const zoom = d3.zoom()
        .scaleExtent([0.5, 5])
        .on("zoom", zoomed);

    svg.call(zoom);

    simulation.on("tick", () => {
        links
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => Math.max(10, Math.min(width - 10, d.x)))
            .attr("cy", d => Math.max(10, Math.min(height - 10, d.y)));
    });

    function zoomed() {
        svg.attr("transform", d3.event.transform);
    }

    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(16,26)");
    legend.selectAll("rect")
        .data(countries)
        .enter().append("circle")
        .attr("cx", 7.5)
        .attr("cy", (d, i) => i * 20 + 5) 
        .attr("r", 5) 

        .style("fill", colorScale);

    legend.selectAll("text")
        .data(countries)
        .enter().append("text")
        .attr("x", 20)
        .attr("y", (d, i) => i * 20 + 12)
        .text(d => d);
  

    function updateForces() {
        const linkStrength = parseFloat(document.getElementById("linkStrength").value);
        const collideForce = parseFloat(document.getElementById("collideForce").value);
        const chargeForce = parseFloat(document.getElementById("chargeForce").value);
        const nodeSize = document.querySelector('input[name="nodeSize"]:checked').value;

        simulation.force("link").strength(linkStrength);
        simulation.force("collide").strength(collideForce);
        simulation.force("charge").strength(chargeForce);

        simulation.alpha(1).restart();
    }

    document.getElementById("applyChanges").addEventListener("click", function (event) {
        updateForces();
    });
});
