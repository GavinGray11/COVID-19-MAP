
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
    
        console.log(countiesResponse.data);
        let countiesData = countiesResponse.data;
        console.log("Printing WITHIN CLASS countiesData");
        console.log(countiesData)
    
        var data_filter = countiesData.filter( element => (element.province === this.state.chosenState && element.stats.confirmed != 0));

        data_filter.sort((a, b) => {
          return b.stats.confirmed - a.stats.confirmed;
        });

        console.log(data_filter);
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
      return (
        <div>
            CHART DATA
            <input
                type="text"
                id="state-search"
                placeholder="Search state counties"
                name="s"
                onChange={e => this.onTodoChange(e.target.value)}
            />
            {/* <Pie
        data={{
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
            // {
            //   label: 'Quantity',
            //   data: [47, 52, 67, 58, 9, 50],
            //   backgroundColor: 'orange',
            //   borderColor: 'red',
            // },
          ],
        }}
        height={400}
        width={600}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          legend: {
            labels: {
              fontSize: 25,
            },
          },
        }}
      /> */}

        {/* <div>
        <canvas id="myChart"></canvas>
        </div> */}
        <div class="chart-container">
        <div class='chart'>
        <Bar
            data={{
                labels:['Jan','Feb','Mar'],
                datasets:[{
                    label:'Chart title',
                    data:[100,200,300],
                    backgroundColor: 'red',
                }]
            }}
            options={{
                scales:{
                    yAxes:[
                        {
                            labelString:'Revenue',
                            display:true,
                            fontColor:'blue',
                            fontSize:20,
                            ticks:{
                                beginAtZero:true
                            }
                        }
                    ]
                }
            }}
        />
        </div>
        <div class='half'>
        <Pie
            data={{
                labels:['Jan','Feb','Mar'],
                datasets:[{
                    label:'Chart title',
                    data:[100,200,300],
                    backgroundColor: 'red',
                }]
            }}
            options={{
                scales:{
                    yAxes:[
                        {
                            ticks:{
                                beginAtZero:true
                            }
                        }
                    ]
                }
            }}
        />
        </div>
        
        <div class='chart'>
        <Line
            data={{
                labels:['Jan','Feb','Mar','April','May','June','July'],
                datasets:[{
                    // responsive: false,
                    // maintainAspectRatio: false,
                    label: 'My First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }}
            options={{
                scales:{
                    yAxes:[
                        {
                            ticks:{
                                beginAtZero:true
                            }
                        }
                    ]
                }
            }}
        />
        </div>
        
        


            {/* {Parser(this.state.countyTable)} */}
        </div>
        </div>
      );
    }
  }


export default ChartCounty