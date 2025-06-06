// Render the Composer Born Year Distribution as Diverging Bar Chart (by Century, Male left, Female right, with center line, multi-row wrap, no overlap, horizontal separators, colored backgrounds)
window.renderComposerBornYearChart = function() {
    if (window._composerBornYearChartRendered) return;
    window._composerBornYearChartRendered = true;

    if (!window.composerData) return;
    const data = window.composerData.filter(d => d.composerBornYear);
    // Define century groups
    const centuries = [1400, 1500, 1600, 1700, 1800, 1900, 2000];
    const centuryLabels = centuries.map(c => `${c}s`);
    const centuryMap = {};
    centuryLabels.forEach(label => { centuryMap[label] = { male: [], female: [] }; });

    // Group composers by century and gender
    data.forEach(d => {
        let group = null;
        for (let i = centuries.length - 1; i >= 0; i--) {
            if (d.composerBornYear >= centuries[i]) {
                group = `${centuries[i]}s`;
                break;
            }
        }
        if (group) {
            if ((d.gender || '').toLowerCase() === 'female') {
                centuryMap[group].female.push(d);
            } else {
                centuryMap[group].male.push(d);
            }
        }
    });

    // Layout constants
    const bubbleSize = 28;
    const bubbleMargin = 2;
    const maxBubblesPerRow = Math.floor((window.innerWidth * 0.4) / (bubbleSize + 2 * bubbleMargin)); // 40% of width per side
    // Soft color palette for backgrounds
    const bgColors = [
        '#f7f6e7', // light yellow
        '#e7f6f7', // light blue
        '#f7e7f6', // light pink
        '#e7f7e7', // light green
        '#f7f0e7', // light peach
        '#e7eaf7', // light lavender
        '#f7e7e7'  // light rose
    ];

    // Clear chart area
    const chartSection = document.getElementById('composerBornYearChartSection');
    chartSection.innerHTML = '<h3 class="section-title">Composer by Gender</h3><div id="bubbleBarChart" style="display: flex; flex-direction: column; align-items: center; overflow-y: auto; width: 100%;"></div>';
    const chart = document.getElementById('bubbleBarChart');

    // For each century, create a diverging block (oldest at top)
    centuryLabels.forEach((century, centuryIdx) => {
        const males = centuryMap[century].male;
        const females = centuryMap[century].female;
        if (!males.length && !females.length) return;

        // Calculate rows needed for each side
        const maleRows = Math.ceil(males.length / maxBubblesPerRow);
        const femaleRows = Math.ceil(females.length / maxBubblesPerRow);
        const blockRows = Math.max(maleRows, femaleRows, 1);
        const blockHeight = blockRows * (bubbleSize + 2 * bubbleMargin) + 32; // 32px for label/line

        // Block container (grid: male | center | female)
        const block = document.createElement('div');
        block.style.display = 'grid';
        block.style.gridTemplateColumns = '1fr 60px 1fr';
        block.style.alignItems = 'center';
        block.style.justifyItems = 'center';
        block.style.margin = '32px 0 0 0';
        block.style.width = '100%';
        block.style.position = 'relative';
        block.style.minHeight = blockHeight + 'px';
        block.style.background = bgColors[centuryIdx % bgColors.length];
        block.style.borderRadius = '18px';
        block.style.boxSizing = 'border-box';
        block.style.boxShadow = '0 1px 6px 0 rgba(0,0,0,0.03)';

        // Male stack (right-aligned, wraps)
        const maleStack = document.createElement('div');
        maleStack.style.display = 'flex';
        maleStack.style.flexDirection = 'row-reverse';
        maleStack.style.flexWrap = 'wrap';
        maleStack.style.alignItems = 'flex-start';
        maleStack.style.justifyContent = 'flex-end';
        maleStack.style.gap = bubbleMargin + 'px';
        maleStack.style.width = '100%';
        maleStack.style.minHeight = (blockRows * (bubbleSize + 2 * bubbleMargin)) + 'px';
        maleStack.style.textAlign = 'right';

        // Use d3 for tooltip, matching composers.js
        d3.select(maleStack)
            .selectAll('.composer')
            .data(males)
            .join('div')
            .attr('class', 'composer')
            .style('width', bubbleSize + 'px')
            .style('height', bubbleSize + 'px')
            .style('margin', bubbleMargin + 'px')
            .style('border-radius', '50%')
            .style('background', d => d.composerImgURL ? '#e0e0e0' : 'black') // placeholder color
            .attr('data-img', d => d.composerImgURL || '')
            .style('border', '3px solid #09abe9')
            .style('transition', 'background 0.5s, opacity 0.5s, transform 0.5s cubic-bezier(0.4,0,0.2,1)')
            .style('opacity', 0)
            .style('transform', 'translateX(40px) scale(0.5)')
            .on('mouseover', function(event, d) {
                d3.select('#tooltip1')
                    .transition().duration(200).style('opacity', 0.9);
                d3.select('#tooltip1')
                    .html(`Name: ${d.composerName}<br>Born: ${d.composerBornYear}<br>Died: ${d.composerDeadthYear}<br>Gender: ${d.gender}`)
                    .style('left', (event.pageX + 50) + 'px')
                    .style('top', (event.pageY - 100) + 'px');
            })
            .on('mouseout', function() {
                d3.select('#tooltip1')
                    .transition().duration(500).style('opacity', 0);
            })
            .on('click', function(event, d) {
                window.open(d.composerURL, '_blank');
            })
            .each(function(d, i) {
                setTimeout(() => {
                    d3.select(this)
                        .style('opacity', 1)
                        .style('transform', 'translateX(0) scale(1)');
                }, 100 + i * 10 + centuryIdx * 30);
            });
        block.appendChild(maleStack);

        // Center line and label container
        const centerContainer = document.createElement('div');
        centerContainer.style.display = 'flex';
        centerContainer.style.flexDirection = 'column';
        centerContainer.style.alignItems = 'center';
        centerContainer.style.justifyContent = 'center';
        centerContainer.style.width = '60px';
        centerContainer.style.height = '100%';
        centerContainer.style.position = 'relative';

        // Label above the line
        const label = document.createElement('div');
        label.textContent = century;
        label.style.fontSize = '14px';
        label.style.fontWeight = 'bold';
        label.style.marginBottom = '2px';
        label.style.textAlign = 'center';
        centerContainer.appendChild(label);

        // Vertical center line (full height of block)
        const line = document.createElement('div');
        line.style.width = '4px';
        line.style.height = '100%';
        line.style.background = 'linear-gradient(to bottom, #bbb 60%, #333 100%)';
        line.style.margin = '0 auto';
        line.style.borderRadius = '2px';
        line.style.flex = '1 1 0';
        centerContainer.appendChild(line);

        block.appendChild(centerContainer);

        // Female stack (left-aligned, wraps)
        const femaleStack = document.createElement('div');
        femaleStack.style.display = 'flex';
        femaleStack.style.flexDirection = 'row';
        femaleStack.style.flexWrap = 'wrap';
        femaleStack.style.alignItems = 'flex-start';
        femaleStack.style.justifyContent = 'flex-start';
        femaleStack.style.gap = bubbleMargin + 'px';
        femaleStack.style.width = '100%';
        // femaleStack.style.minHeight = (blockRows * (bubbleSize + 2 * bubbleMargin)) + 'px';
        femaleStack.style.textAlign = 'left';

        // Use d3 for tooltip, matching composers.js
        d3.select(femaleStack)
            .selectAll('.composer')
            .data(females)
            .join('div')
            .attr('class', 'composer')
            .style('width', bubbleSize + 'px')
            .style('height', bubbleSize + 'px')
            .style('margin', bubbleMargin + 'px')
            .style('border-radius', '50%')
            .style('background', d => d.composerImgURL ? '#e0e0e0' : 'black') // placeholder color
            .attr('data-img', d => d.composerImgURL || '')
            .style('border', '3px solid #ef5990')
            .style('transition', 'background 0.5s, opacity 0.5s, transform 0.5s cubic-bezier(0.4,0,0.2,1)')
            .style('opacity', 0)
            .style('transform', 'translateX(-40px) scale(0.5)')
            .on('mouseover', function(event, d) {
                d3.select('#tooltip1')
                    .transition().duration(200).style('opacity', 0.9);
                d3.select('#tooltip1')
                    .html(`Name: ${d.composerName}<br>Born: ${d.composerBornYear}<br>Died: ${d.composerDeadthYear}<br>Gender: ${d.gender}`)
                    .style('left', (event.pageX + 50) + 'px')
                    .style('top', (event.pageY - 100) + 'px');
            })
            .on('mouseout', function() {
                d3.select('#tooltip1')
                    .transition().duration(500).style('opacity', 0);
            })
            .on('click', function(event, d) {
                window.open(d.composerURL, '_blank');
            })
            .each(function(d, i) {
                setTimeout(() => {
                    d3.select(this)
                        .style('opacity', 1)
                        .style('transform', 'translateX(0) scale(1)');
                }, 100 + i * 10 + centuryIdx * 30);
            });
        block.appendChild(femaleStack);

        chart.appendChild(block);

        // Add horizontal separator except after last block
        if (centuryIdx < centuryLabels.length - 1) {
            const separator = document.createElement('div');
            separator.style.width = '90%';
            separator.style.height = '1px';
            separator.style.background = 'linear-gradient(to right, transparent 0%, #bbb 20%, #bbb 80%, transparent 100%)';
            separator.style.margin = '12px 0 0 0';
            chart.appendChild(separator);
        }

        // Lazy load bubble images using IntersectionObserver
        if (!window._bubbleImageObserver) {
            window._bubbleImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const imgUrl = el.getAttribute('data-img');
                        if (imgUrl) {
                            el.style.background = `url('${imgUrl}') center/cover`;
                        }
                        observer.unobserve(el);
                    }
                });
            }, { rootMargin: '100px' });
        }
        d3.selectAll('.composer').each(function() {
            window._bubbleImageObserver.observe(this);
        });
    });
}; 
