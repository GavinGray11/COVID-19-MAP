
import React, { useEffect, Component } from "react";
import axios from 'axios';
import Parser from 'html-react-parser';
import 'chart.js/auto';
import './ChartCounty.css'
// import {Chart, ArcElement} from 'chart.js'
// Chart.register(ArcElement);


import {Line, Bar, Pie, defaults} from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';

// defaults.global.tooltips.enabled = false
// defaults.global.legend.position = 'bottom'

class ChartCounty extends Component {
    state = {
      countyData: 0,
      countyTable: '',
      chosenState: 'Alabama',
    }
    clear() {
        this.setState({actionCount: 0})
        this.setState({display: '0'})
    }
    componentDidMount() {
        this.getTableData();
    }
    onTodoChange(value){
        this.setState({
             chosenState: value
        });
        this.getTableData();
    }
    getTableData = async () => {

        let countiesResponse;
    
        try { 
          // https://disease.sh/v3/covid-19/
          countiesResponse = await axios.get('https://disease.sh/v3/covid-19/jhucsse/counties');
          // console.log( await axios.get('https://disease.sh/v3/covid-19/jhucsse/counties'));
          // response = await axios.get('https://corona.lmao.ninja/v2/countries');
        } catch(e) { 
          console.log('Failed to fetch countries: ${e.message}', e);
          return;
        }
    
        //console.log(countiesResponse.data);
        let countiesData = countiesResponse.data;
        //console.log("Printing WITHIN CLASS countiesData");
        //console.log(countiesData)
    
        var data_filter = countiesData.filter( element => (element.province === this.state.chosenState && element.stats.confirmed != 0));

        data_filter.sort((a, b) => {
          return b.stats.confirmed - a.stats.confirmed;
        });

        //console.log(data_filter);
        //this.setState({countyData: countiesData});
        
  
    
        var table = '<table><tr><th>State</th><th>County</th><th>Infections</th></tr>'
        var tr;
        for (var i = 0; i < data_filter.length; i++) {
            tr = '<tr>';
            tr += ('<td>' + data_filter[i].province + '</td>');
            tr += ('<td>' + data_filter[i].county + '</td>');
            tr += ('<td>' + data_filter[i].stats.confirmed + '</td>');
            tr += '<tr/>'
            table += tr;
        }
        table += '</table>'

        this.setState({countyTable: table});
    }
    render() {

      const countryLabels = ["USA", "India", "Brazil", "UK", "Russia", "Turkey", "France", "Germany", "Iran", "Spain"]
      const countryCases = [51541346,34732592,22209020,11190354,10159389,9136565,8518840,6755232,6167650,5455527]
      //const countryPop = [332475723, 	1393409038, 213993437, 68207116, 145912025, 85042738, 65426179, 83900473, 85028759, 46745216]
      const chartData = {
        labels: countryLabels,
        datasets: [{
          label: "Top 10 Country Cases",
          backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF","#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF"],
          borderWidth: 1,
          hoverBackgroundColor: "rgb(232,105,90)",
          hoverBorderColor: "orange",
          scaleStepWidth: 1,
          data: countryCases
        },]
      }
      const chartOptions = {
        plugins: {  // 'legend' now within object 'plugins {}'
          title: {
            display: true,
            text: 'Top 10 Country Cases',
            color: 'white',
          },
          legend: {
            display: false,
            labels: {
              color: "white",  // not 'fontColor:' anymore
              // fontSize: 18  // not 'fontSize:' anymore
              font: {
                size: 18 // 'size' now within object 'font {}'
              }
            }
          }
        },
        scales: {
          y: {  // not 'yAxes: [{' anymore (not an array anymore)
            ticks: {
              color: "white", // not 'fontColor:' anymore
              // fontSize: 18,
              font: {
                size: 18, // 'size' now within object 'font {}'
              },
              stepSize: 1,
              beginAtZero: true
            },
            grid: {
              color: "rgb(159,170,174,0.5)"
            },
          },
          x: {  // not 'xAxes: [{' anymore (not an array anymore)
            ticks: {
              color: "white",  // not 'fontColor:' anymore
              //fontSize: 14,
              font: {
                size: 14 // 'size' now within object 'font {}'
              },
              stepSize: 1,
              beginAtZero: true
            },
            grid: {
              color: "rgb(159,170,174,0.5)"
            },
          }
        }
      }

      const lineCases = [16,26930,33670,21970,57340,50794,33332,65353,108456,204544,291630,115363,67282,64136,73090,29031,16565,27077,22894,191475,98602,84844,58141]
      const lineLabels = ['Mar 2020','Apr 2020','May 2020','Jun 2020','Jul 2020','Aug 2020','Sep 2020','Oct 2020','Nov 2020','Dec 2020',
      'Jan 2021','Feb 2021','Mar 2021','May 2021','Jun 2021','Jul 2021','Aug 2021','Sep 2021','Oct 2021','Nov 2021','Dec 2021']
      const lineData = {
        labels:lineLabels,
        datasets:[{
            // responsive: false,
            // maintainAspectRatio: false,
            data: lineCases,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.3,
            borderWidth: 5,
        }]
    }

    const lineOptions = {
      plugins: {  // 'legend' now within object 'plugins {}'
        title: {
          display: true,
          text: 'US Cases Over Time (Mar 2020 - Dec 2021)',
          color: 'white',
        },
        legend: {
          display: false,
          labels: {
            color: "white",  // not 'fontColor:' anymore
            // fontSize: 18  // not 'fontSize:' anymore
            font: {
              size: 18 // 'size' now within object 'font {}'
            }
          }
        }
      },
      scales: {
        y: {  // not 'yAxes: [{' anymore (not an array anymore)
          ticks: {
            color: "white", // not 'fontColor:' anymore
            // fontSize: 18,
            font: {
              size: 18, // 'size' now within object 'font {}'
            },
            stepSize: 1,
            beginAtZero: true
          },
          grid: {
            color: "rgb(159,170,174,0.5)"
          },
        },
        x: {  // not 'xAxes: [{' anymore (not an array anymore)
          ticks: {
            color: "white",  // not 'fontColor:' anymore
            //fontSize: 14,
            font: {
              size: 14 // 'size' now within object 'font {}'
            },
            stepSize: 1,
            beginAtZero: true
          },
          grid: {
            color: "rgb(159,170,174,0.5)"
          },
        }
      }
    }

    const pieLabels = ['California', 'Texas', 'Florida', 'New York', 'Illinois']
    const pieCases = [52496854, 44845174, 37485951, 29456741, 19764183]
    const pieData = {
      labels:pieLabels,
      datasets:[{
          label:'Chart title',
          data:pieCases,
          backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF"],
          font: 'white',
          fontColor: 'white',
          borderColor: 'white',
      },
    ]
  }

  const pieOptions = {
    plugins: {  // 'legend' now within object 'plugins {}'
      title: {
        display: true,
        text: 'Top 5 US State Cases',
        color: 'white',
      },
      legend: {
        labels: {
          color: "white",  // not 'fontColor:' anymore
          // fontSize: 18  // not 'fontSize:' anymore
          font: {
            size: 15 // 'size' now within object 'font {}'
          }
        }
      }
    },
    scales: {
      y: {  // not 'yAxes: [{' anymore (not an array anymore)
        ticks: {
          display: false,
          color: "white", // not 'fontColor:' anymore
          // fontSize: 18,
          font: {
            size: 18, // 'size' now within object 'font {}'
          },
          beginAtZero: false
        },
      },
      x: {  // not 'xAxes: [{' anymore (not an array anymore)
        ticks: {
          display: false,
          color: "white",  // not 'fontColor:' anymore
          //fontSize: 14,
          font: {
            size: 14 // 'size' now within object 'font {}'
          },
          stepSize: 1,
          beginAtZero: true
        },
      }
    }
  }




      return (
        <div>
            {/* CHART DATA
            <input
                type="text"
                id="state-search"
                placeholder="Search state counties"
                name="s"
                onChange={e => this.onTodoChange(e.target.value)}
            /> */}
        <div class="chart-container">
        <div class='chart'>
          <Bar data={chartData} options={chartOptions}/>
        </div>
        <div class='half'>
        <Pie
            data={pieData}
            options={pieOptions}
        />
        </div>
        
        <div class='chart'>
          <Line data={lineData} options={lineOptions}/>
        </div>
        
        


            {/* {Parser(this.state.countyTable)} */}
        </div>
        </div>
      );
    }
  }


export default ChartCounty