class WeatherStation {
    constructor() {
        this.observers = [];
        this.temperature = 0;
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    setTemperature(temperature) {
        this.temperature = temperature;
        this.notifyObservers();
    }
    notifyObservers() {
        this.observers.forEach(observer => {

            observer.update(this.temperature);
        });
    }
}
class DisplayDevice {
    constructor(name) {
        this.name = name;
    }
    update(temperature) {
        console.log(`${this.name} Display: Temperature is ${temperature}°C`);
    }
}
const weatherStation = new WeatherStation();
const displayDevice1 = new DisplayDevice("Display 1");
const displayDevice2 = new DisplayDevice("Display 2");
weatherStation.addObserver(displayDevice1);
weatherStation.addObserver(displayDevice2);
weatherStation.setTemperature(25);
weatherStation.setTemperature(30);

