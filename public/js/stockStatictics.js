

async function StartGrapi() {
    try {
        const statictisType = await fetch(`/api/statictics/stock`);
        const json = await statictisType.json();
        console.log(json);
        const serviceType = json.resultServiceType;
        const equipment = json.resultEquipment;

        const serviceSeries = [];
        const serviceLabels = [];

        const equipmentSeries = [];
        const equipmentLabels = [];
        
        for (let index = 0; index < serviceType.length; index++) {
            const { name,count } = serviceType[index];
            serviceSeries.push(count);
            serviceLabels.push(`${name} (${count})`);
        }

        for (let index = 0; index < equipment.length; index++) {
            const { count,name } = equipment[index];
            equipmentSeries.push(count);
            equipmentLabels.push(`${name} (${count})`);
        }

        const optionsEquipment = {
            chart: { type: 'donut', width: 380 },
            colors: ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a0ff', '#e220af', '#02d034'],
            dataLabels: { enabled: false },
            legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '11px', markers: { width: 10, height: 10 } },
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
            stroke: { show: true, width: 25 },
            series: equipmentSeries,
            labels: equipmentLabels,
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

        const optionsServiceType = {
            chart: {
                type: 'donut',
                width: 380
            },
            colors: ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a0ff', '#e220af', '#02d034'],
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
            series: serviceSeries,
            labels: serviceLabels,
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

        const equipemntChar = new ApexCharts(
            document.querySelector("#chart-equipment"),
            optionsEquipment
        );

        const serviceTypeChar = new ApexCharts(
            document.querySelector("#chart-service-type"),
            optionsServiceType
        );

        equipemntChar.render();
        serviceTypeChar.render();
        return;
    } catch (error) {
        console.log(error);
    }
}
StartGrapi();
