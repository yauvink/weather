import React from 'react';
import Select from 'react-select'


class WeatherForecast extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: {},
            cities: [
                { label: 'Minsk', value: '625144' },
                { label: 'Moscow', value: '524901' },
                { label: 'Kiev', value: '703448' }
            ]
        };

        this.handleSelectChange = this.handleSelectChange.bind(this);
    }
    getWeatherData(id) {
        this.setState({
            isLoaded: false
        });
        fetch(`http://api.openweathermap.org/data/2.5/forecast/?id=${id}&appid=dd85eb16c341cc88fed125ccfa1e9fdb&units=metric`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        data: result
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
        this.getWeatherData(e.value);
    }

    render() {
        return (
            <div>
                <div className={"controlsWrapper"}>
                    <div className={"selectWrapper"}>
                        <Select id="citySelect" onChange={this.handleSelectChange} options={this.state.cities} />
                    </div></div>
                <div className={"currentWeatherWrapper"}>
                    {this.state.isLoaded &&
                        <div>
                            <h2>{this.state.data.city.name}</h2>
                            <p>Temperature: {this.state.data.list[0].main.temp}&deg;</p>
                            <p>Feels like: {this.state.data.list[0].main.feels_like}&deg;</p>
                            <p>Weather: {this.state.data.list[0].weather[0].main}</p>
                            <p>Wind speed: {this.state.data.list[0].wind.speed} m/s</p>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default WeatherForecast;
