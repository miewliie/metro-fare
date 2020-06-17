import { METRO_STATION } from "../types/MetroStation";
import { METRO_FARE } from "../common/fare";
import { graphService, metroGraph } from "./graph.service";
import { RouteSegment } from "../types/RouteSegment";
import { FareType } from "../types/FareType";

export type TravelRoute = {
    route: {
        route: METRO_STATION[],
        fareType: FareType,
        fare: number
    }[],
    fare: number,
}

export const FareService = {
    calculate(source: METRO_STATION, destination: METRO_STATION): TravelRoute {
        const routeSegments = graphService.findRoute(source, destination, metroGraph);

        let totalFare = 0;
        const route = routeSegments.map((routeSegment: RouteSegment) => {
            const fare = this.calculateTotalFareFromRoute(routeSegment, routeSegments.length > 1);
            totalFare += fare;
            return {
                route: routeSegment.route,
                fareType: routeSegment.fareType,
                fare
            }
        });
        return {
            route,
            fare: totalFare
        }
    },
    calculateTotalFareFromRoute(routeSegment: RouteSegment, hasMoreThanOneSegment = false): number {
        const fareTable: number[] = METRO_FARE[routeSegment.fareType];

        const hops = routeSegment.route.length - 1;
        if (hops === 0 && hasMoreThanOneSegment) {
            return 0;
        }

        if (hops > fareTable.length - 1) {
            return fareTable[fareTable.length - 1];
        }

        return fareTable[hops];
    }
}