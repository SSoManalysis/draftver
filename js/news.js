// ****************************************************************** //
// chart_CandianNews --- Evolution of EDI discussion in Canadian news //
// ****************************************************************** //

const ctx = document.getElementById("chart_CandianNews").getContext("2d");
const chart_CandianNews = new Chart(ctx, {
    type: "bar", // Set to bar for mixed chart
    data: {
        labels: [
            "1990",
            "1991",
            "1992",
            "1993",
            "1994",
            "1995",
            "1996",
            "1997",
            "1998",
            "1999",
            "2000",
            "2001",
            "2002",
            "2003",
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
            "2022",
            "2023",
        ],
        datasets: [
            {
                type: "line", // Line chart
                label: "Canadian News",
                data: [
                    21, 20, 17, 25, 23, 27, 25, 35, 139, 228, 174, 81, 23, 22,
                    16, 30, 24, 26, 27, 12, 14, 18, 10, 12, 11, 10, 32, 30, 40,
                    95, 1911, 2468, 1742, 1012,
                ],
                fill: false,
                borderColor: "#c24040", // Line color
                tension: 0.1,
                yAxisID: "y1",
            },
            {
                type: "bar", // Bar chart
                label: "BIPOC Composers",
                data: [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    23,
                    14,
                    19,
                    25,
                    22,
                    27,
                    49,
                    17,
                    55,
                    19,
                    13,
                    50,
                    52,
                ],
                backgroundColor: "#00cadc", // Bar color
                yAxisID: "y2",
            },
        ],
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Disable default legend
            },
        },
        scales: {
            y1: {
                type: "linear",
                position: "left",
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Canadian News",
                    color: "#c24040",
                    font: {
                        weight: "bold",
                    },
                },
            },
            y2: {
                type: "linear",
                position: "right",
                beginAtZero: true,
                title: {
                    display: true,
                    text: "BIPOC (Black, Indigenous, People of Color) Composers",
                    color: "#00cadc",
                    font: {
                        weight: "bold",
                    },
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    },
});

// ****************************************************************** //
//  //
// ****************************************************************** //
