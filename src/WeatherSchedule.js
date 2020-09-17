import React from 'react';
import './index.css';
import Select from 'react-select'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar} from 'recharts';

const COLORS = [
    "#b02323",
    "#2b657e",
    "#4EAC5B",
    "#DDB03E",
    "#CD5135",
    "#AC9175",
    "#BDC5D4",
    "#3A647C"
];

class WeatherSchedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: {},
            rechartsArray: [],
            barChartsArray: [],
            cities: [
                { label: 'Minsk', value: '625144' },
                { label: 'Moscow', value: '524901' },
                { label: 'Kiev', value: '703448' }
            ],
            selectedCityId: "625144",
            units: "metric"
        };

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleUnitsChange = this.handleUnitsChange.bind(this);
        this.getWeatherData = this.getWeatherData.bind(this);
    }
    getWeatherData() {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${this.state.selectedCityId}&appid=dd85eb16c341cc88fed125ccfa1e9fdb&units=${this.state.units}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        data: result
                    });

                    let list = this.state.data.list
                    let barChartsArray = []

                    for (let i = 0; i < list.length; i++) {

                        let listDate = `${new Date(list[i].dt_txt).getDate()}.${new Date(list[i].dt_txt).getMonth()+1}.${new Date(list[i].dt_txt).getFullYear()}`

                        if (barChartsArray.length === 0) {
                            let obj = { "date": listDate };
                            obj[new Date(list[i].dt_txt).getHours()] = list[i].main.temp;
                            barChartsArray.push(obj)
                        }
                        else {
                            for (let j = 0; j < barChartsArray.length; j++) {
                                if ((barChartsArray[j].date) === listDate) {
                                    barChartsArray[j][new Date(list[i].dt_txt).getHours()] = list[i].main.temp.toString();
                                }
                                else {
                                    if ((barChartsArray[j].date) !== listDate && j === (barChartsArray.length - 1)) {
                                        let obj = { "date": listDate };
                                        obj[new Date(list[i].dt_txt).getHours()] = list[i].main.temp;
                                        barChartsArray.push(obj)
                                    }
                                }
                            }
                        }
                    }
                    let rechartsArray = this.state.data.list.map(item => (
                        {
                            date: `${new Date(item.dt_txt).getDate()}.0${new Date(item.dt_txt).getMonth() + 1}.${new Date(item.dt_txt).getFullYear()} ${new Date(item.dt_txt).getHours()}h`,
                            Temperature: item.main.temp,
                            Feels_Like: item.main.feels_like
                        }
                    ))
                    this.setState({
                        rechartsArray: rechartsArray,
                        barChartsArray: barChartsArray
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    handleSelectChange(e) {
        this.setState({
            selectedCityId: e.value
        }, () => { this.getWeatherData() })
    }
    handleUnitsChange(e) {
        this.setState({
            units: e.target.value
        }, () => this.getWeatherData());
    }

    render() {
        const values = [0, 3, 6, 9, 12, 15, 18, 21]
        return (

            <div>
                <div className={"controlsWrapper"}>
                    <div className={"selectWrapper"}>
                        <Select id="citySelect" onChange={this.handleSelectChange} options={this.state.cities} />
                    </div>
                    <div className={"radioButtonsWrapper"}>
                        <form onChange={this.handleUnitsChange}>
                            <label>
                                <input type="radio" name="group1" value="metric"></input>
                                <span>Celsius</span>
                            </label>
                            <label>
                                <input type="radio" name="group1" value="default"></input>
                                <span>Kelvin</span>
                            </label>
                        </form>
                    </div>
                </div>
                {this.state.isLoaded &&
                    <div>
                        <div className={"chartWrapper"}>
                            <LineChart
                                width={1000}
                                height={250}
                                data={this.state.rechartsArray}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip labelStyle={{margin: "0px;"}} />
                                <Legend />
                                <Line type="monotone" dataKey="Temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="Feels_Like" stroke="#82ca9d" />

                            </LineChart>
                        </div>
                        <div className={"chartWrapper"}>
                            <BarChart
                                width={1000}
                                height={250}
                                data={this.state.barChartsArray}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Legend />
                                {values.map((item) => {
                                    function getColor() {
                                        return COLORS[item / 3]
                                    }
                                    return <Bar key={"bar-" + item} dataKey={item} fill={getColor(item)} radius={20} ></Bar>
                                })}
                            </BarChart>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default WeatherSchedule;

