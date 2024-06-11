

async function StartGrapi(limit) {
    try {
        const statictisType = await fetch(`/api/statictics/user/?limit=${limit}`);
        const json = await statictisType.json();
        
        console.log(json);

        const listSeries = [];
        const listLabels = [];
    
        for (let index = 0; index < json.body.length; index++) {
            const { paymentMethod, meney, stock, transaction, serviceType } = json.body[index]._count;
            // console.log(json.body[index].name, paymentMethod, meney, stock, transaction, serviceType);
            const serie = paymentMethod + meney + stock + transaction + serviceType;
            listSeries.push(serie);
            listLabels.push(json.body[index].name);
            // console.log(serie, json.body[index].name);
        }

        const options = {
            chart: {
                type: 'donut',
                width: 380
            },
            colors: ['#5c1ac3', '#e2a03f', '#e7515a'],
            dataLabels: {
            enabled: false
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '11px',
                markers: {
                width: 10,
                height: 10,
                }
            },
            plotOptions: {
            pie: {
                donut: {
                size: '65%',
                background: 'transparent',
                labels: {
                    show: true,
                    name: {
                    show: true,
                    fontSize: '29px',
                    fontFamily: 'Nunito, sans-serif',
                    color: undefined,
                    offsetY: -10
                    },
                    value: {
                    show: true,
                    fontSize: '26px',
                    fontFamily: 'Nunito, sans-serif',
                    color: '20',
                    offsetY: 16,
                    formatter: function (val) {
                        return val
                    }
                    },
                    total: {
                    show: true,
                    showAlways: true,
                    label: 'Total',
                    color: '#888ea8',
                    formatter: function (w) {
                        return w.globals.seriesTotals.reduce( function(a, b) {
                        return a + b
                        }, 0)
                    }
                    }
                }
                }
            }
            },
            stroke: {
            show: true,
            width: 25,
            },
            series: listSeries,
            labels: listLabels,
            responsive: [{
                breakpoint: 1599,
                options: {
                    chart: {
                        width: '350px',
                        height: '400px'
                    },
                    legend: {
                        position: 'bottom'
                    }
                },

                breakpoint: 1439,
                options: {
                    chart: {
                        width: '250px',
                        height: '390px'
                    },
                    legend: {
                        position: 'bottom'
                    },
                    plotOptions: {
                    pie: {
                        donut: {
                        size: '65%',
                        }
                    }
                    }
                },
            }]
        }

        const doc = document.getElementById("chart-2");
        doc.innerHTML = ``;

        var chart = new ApexCharts(
            document.querySelector("#chart-2"),
            options
        );

        chart.render();
    } catch (error) {
        console.log(error);
    }
}
StartGrapi(5);

const btnUser =document.getElementById(`btn-limit-user`);

btnUser.addEventListener(`click`, (ev) => {
    const input = document.getElementById(`input-limit-users`);
    const vl = input.value;
    console.log(vl);
    StartGrapi(vl);    

})
