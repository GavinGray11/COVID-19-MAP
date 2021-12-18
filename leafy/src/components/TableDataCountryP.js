
import React, { useEffect, Component } from "react";
import axios from 'axios';
import Parser from 'html-react-parser';


class TableDataCountryP extends Component {
    state = {
      countryData: 0,
      countryTable: '',
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

        let countryResponse;
    
        try { 
          countryResponse = await axios.get('https://disease.sh/v3/covid-19/countries');
        } catch(e) { 
          console.log('Failed to fetch countries: ${e.message}', e);
          return;
        }
    
        //console.log(countryResponse.data);
        let countryData = countryResponse.data;
        //console.log("Printing WITHIN CLASS countiesData");
        //console.log(countryData)
    
        var data_filter = countryData.filter( element => (true));
        //console.log(data_filter);
        data_filter.sort((a, b) => {
            return b.casesPerOneMillion - a.casesPerOneMillion;
          });
        //this.setState({countyData: countiesData});

        data_filter.sort(function(a, b) {
            return a.casesPerOneMillion > b.casesPerOneMillion;
          });
    
        var table = '<table><tr><th>Country</th><th>CasesPM</th><th>DeathsPM</th><th>RecoveredPM</th></tr>'
        var tr;
        for (var i = 0; i < data_filter.length; i++) {
            tr = '<tr>';
            tr += ('<td>' + data_filter[i].country + '</td>');
            tr += ('<td>' + data_filter[i].casesPerOneMillion + '</td>');
            tr += ('<td>' + data_filter[i].deathsPerOneMillion + '</td>');
            tr += ('<td>' + data_filter[i].recoveredPerOneMillion + '</td>');
            tr += '<tr/>'
            table += tr;
        }
        table += '</table>'

        this.setState({countryTable: table});
        return <div>Table Chart</div>
    }
    render() {
      return (
        <div>
            <p>Data by Country per Million</p>
            {/* {this.state.countyData} */}
            {/* <input
                type="text"
                id="state-search"
                placeholder="Search state counties"
                name="s"
                onChange={e => this.onTodoChange(e.target.value)}
            /> */}
            {Parser(this.state.countryTable)}
        </div>
      );
    }
  }


export default TableDataCountryP