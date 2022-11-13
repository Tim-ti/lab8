const chai = require('chai');
chai.use(require("chai-sorted"));

const { assert, expect } = chai;

const Airport = require('../Airport');

const MilitaryPlane = require('../planes/MilitaryPlane');
const PassengerPlane = require('../planes/PassengerPlane');
const ExperimentalPlane = require('../planes/ExperimentalPlane');

const MILITARY_TYPES = require('../models/militaryTypes');
const EXPERIMENTAL_TYPES = require('../models/experimentalTypes');
const CLASSIFICATION_LEVELS = require('../models/classificationLevels');

describe('Test cases of Airport', () => {

    const passengerPlanes = [
        new PassengerPlane('Boeing-737', 900, 12000, 60500, 164),
        new PassengerPlane('Boeing-737-800', 940, 12300, 63870, 192),
        new PassengerPlane('Boeing-747', 980, 16100, 70500, 242),
        new PassengerPlane('Airbus A320', 930, 11800, 65500, 188),
        new PassengerPlane('Airbus A330', 990, 14800, 80500, 222),
        new PassengerPlane('Embraer 190', 870, 8100, 30800, 64),
        new PassengerPlane('Sukhoi Superjet 100', 870, 11500, 50500, 140),
        new PassengerPlane('Bombardier CS300', 920, 11000, 60700, 196)
    ];

    const militaryBomberPlanes = [
        new MilitaryPlane('B-1B Lancer', 1050, 21000, 80000, MILITARY_TYPES.BOMBER),
        new MilitaryPlane('B-2 Spirit', 1030, 22000, 70000, MILITARY_TYPES.BOMBER),
        new MilitaryPlane('B-52 Stratofortress', 1000, 20000, 80000, MILITARY_TYPES.BOMBER)
    ];
    
    const militaryFighterPlanes = [
        new MilitaryPlane('F-15', 1500, 12000, 10000, MILITARY_TYPES.FIGHTER),
        new MilitaryPlane('F-22', 1550, 13000, 11000, MILITARY_TYPES.FIGHTER)
    ];

    const militaryTransportPlanes = [new MilitaryPlane('C-130 Hercules', 650, 5000, 110000, MILITARY_TYPES.TRANSPORT)];

    const militaryPlanes = [
        ...militaryBomberPlanes,
        ...militaryFighterPlanes,
        ...militaryTransportPlanes
    ];

    const classifiedExperimentalPlanes = [
        new ExperimentalPlane("Bell X-14", 277, 482, 500, EXPERIMENTAL_TYPES.HIGH_ALTITUDE, CLASSIFICATION_LEVELS.SECRET),
        new ExperimentalPlane("Ryan X-13 Vertijet", 560, 307, 500, EXPERIMENTAL_TYPES.VTOL, CLASSIFICATION_LEVELS.TOP_SECRET)
    ];

    const planes = [
        ...passengerPlanes,
        ...militaryPlanes,
        ...classifiedExperimentalPlanes
    ];

    const planeWithMaxPassengerCapacity = new PassengerPlane('Boeing-747', 980, 16100, 70500, 242);

    it('should have military Planes with transport type', () => {
        let airport = new Airport(planes);
        let transportMilitaryPlanes = airport.getTransportMilitaryPlanes();
        let flag = false;
        for (let militaryPlane of transportMilitaryPlanes) {
            if (militaryPlane.getMilitaryType() === MilitaryType.TYPE_TRANSPORT) {
                flag = true;
                break;
            }
        }
        assert.equal(flag,true);
    });

    it('should check passenger plane with max capacity', () => {
        let airport = new Airport(planes);
        let expectedPlaneWithMaxPassengersCapacity = airport.getPassengerPlaneWithMaxPassengersCapacity();
        assert.isFalse( expectedPlaneWithMaxPassengersCapacity == planeWithMaxPassengerCapacity);
    });


    it('GetPassengerPlaneWithMaxCapacity', () => {
        console.log("TEST testGetPassengerPlaneWithMaxCapacity started!");
        let airport = new Airport(planes);
        airport.sortByMaxLoadCapacity();
        let planesSortedByMaxLoadCapacity = airport.getPlanes();
        let nextPlaneMaxLoadCapacityIsHigherThanCurrent = true;
        for (let i = 0; i < planesSortedByMaxLoadCapacity.length - 1; i++) {
            let currentPlane = planesSortedByMaxLoadCapacity[i];
            let nextPlane = planesSortedByMaxLoadCapacity[i + 1];
            if (currentPlane.getMinLoadCapacity() > nextPlane.getMinLoadCapacity()) {
                nextPlaneMaxLoadCapacityIsHigherThanCurrent = false;
                break;
            }
        }
        assert.isTrue(nextPlaneMaxLoadCapacityIsHigherThanCurrent);
    })

    it('testHasAtLeastOneBomberInMilitaryPlanes', () => {
        let airport = new Airport(planes);
        let bomberMilitaryPlanes  = airport.getBomberMilitaryPlanes ();
        let flag = false;
        for (let militaryPlane of bomberMilitaryPlanes) {
            if (militaryPlane.getMilitaryType() === MilitaryType.BOMBER) {
                flag = true;
            }
            else{
                assert.fail("Test failed!");
            }
        }

        
    })

    it('should check that experimentsl planes has classification level higher than unclassified', () => {
        let airport = new Airport(planes);
        let bomberMilitaryPlanes  = airport.getExperimentalPlanes ();
        let hasUnclassifiedPlanes  = false;
        for (let experimentalPlane  of bomberMilitaryPlanes) {
            if (experimentalPlane.classificationLevel === ClassificationLevel.UNCLASSIFIED) {
                hasUnclassifiedPlanes = true;

        }
        assert.isFalse(hasUnclassifiedPlanes);

        }
    });

});



