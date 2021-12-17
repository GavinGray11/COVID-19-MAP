
import React, { useEffect, Component } from "react";
import axios from 'axios';
import Parser from 'html-react-parser';


class TableData extends Component {
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
        return <div>Table Chart</div>
    }
    render() {
      return (
        <div>
            <p>State County Data</p>
            <input
                type="text"
                id="state-search"
                placeholder="Search state"
                name="s"
                onChange={e => this.onTodoChange(e.target.value)}
            />
            {Parser(this.state.countyTable)}
        </div>
      );
    }
  }


export default TableData