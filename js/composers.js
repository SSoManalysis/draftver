d3.csv("data/data.csv").then((data) => {
    // Convert string fields to numbers
    data.forEach((d) => {
        d.freq = +d.freq; // Convert frequency to number
        d.composerBornYear = d.composerBornYear ? +d.composerBornYear : ""; // Convert year to number
        d.composerDeadthYear = d.composerDeadthYear
            ? +d.composerDeadthYear
            : ""; // Convert year to number
    });

    // Expose data for other scripts
    window.composerData = data;
    if (window.renderComposerBornYearChart) window.renderComposerBornYearChart();

    // Sort data by composerBornYear in ascending order
    data.sort((a, b) => {
        return a.composerBornYear - b.composerBornYear;
    });

    const container = d3.select("#allComposers");

    const maxFreq = d3.max(data, (d) => d.freq); // Find the maximum frequency for scaling

    const composers = container
        .selectAll(".composer")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "composer")
        .on("mouseover", (event, d) => {
            const tooltip = d3.select("#tooltip1");
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
                .html(
                    `Name: ${d.composerName}<br>Born: ${d.composerBornYear}<br>Died: ${d.composerDeadthYear}<br>Gender: ${d.gender}`
                )
                .style("left", event.pageX + 50 + "px")
                .style("top", event.pageY - 100 + "px");
        })
        .on("mouseout", () => {
            d3.select("#tooltip1")
                .transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", (event, d) => {
            window.open(d.composerURL, "_blank");
        });

    // Show those only with composerImgURL
    composers.each(function (d) {
        const size = `${Math.min((d.freq / maxFreq) * 70, 70)}px`;

        if (d.composerImgURL) {
            // Load the image if the URL exists
            d3.select(this)
                .append("img")
                .attr("src", "images/Magnify@1x-1.0s-200px-200px.gif") // Initial loading spinner
                .attr("data-src", d.composerImgURL) // Actual image URL for lazy loading
                .attr("alt", `Image of ${d.composerName}`)
                .style("width", size)
                .style("height", size)
                .style(
                    "border",
                    `5px solid ${d.gender === "female" ? "#ef5990" : "#09abe9"}`
                ) // Set border color based on gender
                .classed("lazyload", true);
        } else {
            // Create a black circle with "No image" text if composerImgURL is null
            const circle = d3
                .select(this)
                .append("div")
                .style("width", size)
                .style("height", size)
                .style("background-color", "black")
                .style("border-radius", "50%") // Make it circular
                .style(
                    "border",
                    `5px solid ${d.gender === "female" ? "#ef5990" : "#09abe9"}`
                ) // Set border color based on gender
                .style("display", "flex")
                .style("align-items", "center")
                .style("justify-content", "center") // Center the text
                .style("color", "white") // Set text color to white
                .style("font-size", "10px"); // Adjust font size if necessary

            // Append the "No image" text
            circle.append("span").text("No image");
        }
    });

    // Lazy load script
    const lazyLoadImages = document.querySelectorAll("img.lazyload");
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute("data-src");
                img.onload = () => img.classList.remove("lazyload"); // Remove loading spinner
                observer.unobserve(img);
            }
        });
    });

    lazyLoadImages.forEach((img) => {
        imageObserver.observe(img);
    });
});
