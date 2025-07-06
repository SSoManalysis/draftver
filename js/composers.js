d3.csv("data/data_for_web_20250706.csv").then((data) => {
    const centuryMap = {};
    const centuries = [...new Set(data.map((d) => d.Century))]; // Extract unique centuries
    const centuryLabels = centuries
        .filter((c) => c !== "Unknown")
        .sort((a, b) => {
            const centuryA = parseInt(a) || 0; // Convert to number for comparison
            const centuryB = parseInt(b) || 0;
            return centuryA - centuryB; // Reverse sorting
        });

    // Initialize centuryMap
    centuryLabels.forEach((label) => {
        centuryMap[label] = { male: [], female: [] };
    });

    // Group composers by century and gender, excluding "Unknown"
    data.forEach((d) => {
        const group = d.Century;
        if (group && group !== "Unknown") {
            if ((d.Sex || "").toLowerCase() === "female") {
                centuryMap[group].female.push(d);
            } else {
                centuryMap[group].male.push(d);
            }
        }
    });

    // Layout constants
    const bubbleSize = 38;
    const bubbleMargin = 2;
    const maxBubblesPerRow = Math.floor(
        (window.innerWidth * 0.4) / (bubbleSize - 2 * bubbleMargin)
    );
    const bgColors = [
        "#f7f6e7",
        "#e7f6f7",
        "#f7e7f6",
        "#e7f7e7",
        "#f7f0e7",
        "#e7eaf7",
        "#f7e7e7",
    ];

    // Clear chart area
    const chartSection = document.getElementById(
        "composerBornYearChartSection"
    );
    chartSection.innerHTML =
        '<h3 class="section-title">Composer by Century and Gender</h3><p style="font-size: 10px; font-style: italic; text-align: center; margin-top: -20px;">Images are sourced from Wikimedia automatically</p><div id="bubbleBarChart" style="display: flex; flex-direction: column; align-items: flex-start;"></div>';
    const chart = document.getElementById("bubbleBarChart");

    // Tooltip for hover effect
    const tooltip = d3
        .select("body")
        .append("div")
        .attr("id", "tooltip1")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("opacity", 0);

    // Iterate over centuries in reverse order
    centuryLabels.forEach((century, centuryIdx) => {
        const males = centuryMap[century].male;
        const females = centuryMap[century].female;
        if (!males.length && !females.length) return;

        const totalComposers = males.length + females.length;
        const maleCount = males.length;
        const femaleCount = females.length;

        // Calculate ratios
        const femaleRatio = (femaleCount / totalComposers) * 100 || 0;
        const maleRatio = (maleCount / totalComposers) * 100 || 0;

        const rows = Math.ceil(totalComposers / maxBubblesPerRow);
        const blockHeight = rows * (bubbleSize + 2 * bubbleMargin) + 32;

        // Create the block for the century
        const block = document.createElement("div");
        block.style.display = "flex";
        block.style.alignItems = "center";
        block.style.margin = "32px 0";
        block.style.width = "100%";
        block.style.minHeight = blockHeight + "px";
        block.style.background = bgColors[centuryIdx % bgColors.length];
        block.style.borderRadius = "18px";
        block.style.boxShadow = "0 1px 6px 0 rgba(0,0,0,0.03)";

        // Century label
        const labelContainer = document.createElement("div");
        labelContainer.style.width = "150px"; // Fixed width for the label
        labelContainer.style.textAlign = "center";
        labelContainer.style.fontSize = "14px";
        labelContainer.style.fontWeight = "bold";
        labelContainer.textContent = century;
        block.appendChild(labelContainer);

        // Create ratio bar container
        const ratioBarContainer = document.createElement("div");
        ratioBarContainer.className = "ratio-bar-container";
        ratioBarContainer.style.display = "flex";
        ratioBarContainer.style.alignItems = "center";
        ratioBarContainer.style.width = "100%";
        ratioBarContainer.style.marginBottom = "8px";
        ratioBarContainer.style.backgroundColor = "#000";

        // Female ratio bar
        const femaleBar = document.createElement("div");
        femaleBar.className = "female-ratio-bar";
        femaleBar.style.width = femaleRatio + "%";
        femaleBar.style.height = "20px";
        femaleBar.style.backgroundColor = "#ef5990";
        ratioBarContainer.appendChild(femaleBar);

        // Create female percentage text
        const femaleText = document.createElement("span");
        femaleText.textContent = `  ${femaleRatio.toFixed(1)}%`;
        femaleText.style.color = "white";
        femaleText.style.fontSize = "12px";
        femaleBar.appendChild(femaleText);

        // Male ratio bar
        const maleBar = document.createElement("div");
        maleBar.className = "male-ratio-bar";
        maleBar.style.width = maleRatio + "%";
        maleBar.style.height = "20px";
        maleBar.style.backgroundColor = "#09abe9";
        maleBar.style.position = "relative";

        // Create male percentage text
        const maleText = document.createElement("span");
        maleText.textContent = `${maleRatio.toFixed(1)}%`; // `Male: ${maleCount} (${maleRatio.toFixed(1)}%)`
        maleText.style.position = "absolute";
        maleText.style.left = "50%";
        maleText.style.transform = "translateX(-50%)";
        maleText.style.color = "white";
        maleText.style.fontSize = "12px";
        maleBar.appendChild(maleText);

        // Append the bars to the ratio bar container
        ratioBarContainer.appendChild(femaleBar);
        ratioBarContainer.appendChild(maleBar);

        // Append the ratio bar container to the chart
        chart.appendChild(ratioBarContainer);

        // Composer bubbles container
        const composerContainer = document.createElement("div");
        composerContainer.style.display = "flex";
        composerContainer.style.flexWrap = "wrap";
        composerContainer.style.gap = bubbleMargin + "px";
        composerContainer.style.justifyContent = "flex-start";

        // Append female composers first
        females.forEach((d) => {
            const composerBubble = document.createElement("div");
            composerBubble.className = "composer";
            composerBubble.style.width = bubbleSize + "px";
            composerBubble.style.height = bubbleSize + "px";
            composerBubble.style.borderRadius = "50%";
            composerBubble.style.background = "transparent";
            composerBubble.style.border = "3px solid #ef5990";
            composerBubble.style.overflow = "hidden";

            composerBubble.onmouseover = (event) => {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html(
                        `Name: ${d.composer_name}<br>Born: ${d.composerBornYear}<br>Died: ${d.composerDeadthYear}<br>Gender: ${d.Sex}`
                    )
                    .style("left", event.pageX + 15 + "px")
                    .style("top", event.pageY - 28 + "px");
            };
            composerBubble.onmouseout = () => {
                tooltip.transition().duration(500).style("opacity", 0);
            };
            composerBubble.onclick = () => {
                let url = d.composerURL;
                if (!url) {
                    url = `https://www.google.com/search?q=${encodeURIComponent(
                        d.composer_name
                    )}`;
                }
                window.open(url, "_blank");
            };

            if (d.composerImgURL) {
                const img = document.createElement("img");
                img.src = "images/Magnify@1x-1.0s-200px-200px.gif"; // Initial loading spinner
                img.setAttribute("data-src", d.composerImgURL); // Actual image URL for lazy loading
                img.alt = `Image of ${d.composer_name}`;
                img.style.width = bubbleSize + "px";
                img.style.height = bubbleSize + "px";
                img.style.borderRadius = "50%";
                img.classList.add("lazyload");
                composerBubble.appendChild(img);
            } else {
                const circle = document.createElement("div");
                circle.style.width = bubbleSize + "px";
                circle.style.height = bubbleSize + "px";
                circle.style.backgroundColor = "black";
                circle.style.borderRadius = "50%";
                circle.style.display = "flex";
                circle.style.alignItems = "center";
                circle.style.justifyContent = "center";
                circle.style.color = "white";
                circle.style.fontSize = "6px";
                circle.textContent = "No image";
                composerBubble.appendChild(circle);
            }

            composerContainer.appendChild(composerBubble);
        });

        // Append male composers next
        males.forEach((d) => {
            const composerBubble = document.createElement("div");
            composerBubble.className = "composer";
            composerBubble.style.width = bubbleSize + "px";
            composerBubble.style.height = bubbleSize + "px";
            composerBubble.style.borderRadius = "50%";
            composerBubble.style.background = "transparent";
            composerBubble.style.border = "3px solid #09abe9";
            composerBubble.style.overflow = "hidden";

            composerBubble.onmouseover = (event) => {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html(
                        `Name: ${d.composer_name}<br>Born: ${d.composerBornYear}<br>Died: ${d.composerDeadthYear}<br>Gender: ${d.Sex}`
                    )
                    .style("left", event.pageX + 15 + "px")
                    .style("top", event.pageY - 28 + "px");
            };
            composerBubble.onmouseout = () => {
                tooltip.transition().duration(500).style("opacity", 0);
            };
            composerBubble.onclick = () => {
                let url = d.composerURL;
                if (!url) {
                    url = `https://www.google.com/search?q=${encodeURIComponent(
                        d.composer_name
                    )}`;
                }
                window.open(url, "_blank");
            };

            if (d.composerImgURL) {
                const img = document.createElement("img");
                img.src = "images/Magnify@1x-1.0s-200px-200px.gif"; // Initial loading spinner
                img.setAttribute("data-src", d.composerImgURL); // Actual image URL for lazy loading
                img.alt = `Image of ${d.composer_name}`;
                img.style.width = bubbleSize + "px";
                img.style.height = bubbleSize + "px";
                img.style.borderRadius = "50%";
                img.classList.add("lazyload");
                composerBubble.appendChild(img);
            } else {
                const circle = document.createElement("div");
                circle.style.width = bubbleSize + "px";
                circle.style.height = bubbleSize + "px";
                circle.style.backgroundColor = "black";
                circle.style.borderRadius = "50%";
                circle.style.display = "flex";
                circle.style.alignItems = "center";
                circle.style.justifyContent = "center";
                circle.style.color = "white";
                circle.style.fontSize = "6px";
                circle.textContent = "No image";
                composerBubble.appendChild(circle);
            }

            composerContainer.appendChild(composerBubble);
        });

        block.appendChild(composerContainer);
        chart.appendChild(block);

        if (centuryIdx < centuryLabels.length - 1) {
            const separator = document.createElement("div");
            separator.style.width = "90%";
            separator.style.height = "1px";
            separator.style.background = "#bbb";
            separator.style.margin = "12px 0";
            chart.appendChild(separator);
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
