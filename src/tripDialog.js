import moment from 'moment';
import request from 'request-promise';
import { replies } from '../replies';

const CLICKBUS_URL = process.env.CLICKBUS_URL;

const tripDialogReply = context => {
    const {
        origin,
        destination,
        departureDay,
        apiError,
        trips
    } = context;
    const hasOrigin = origin !== undefined;
    const hasDestination = destination !== undefined;
    const hasApiError = apiError !== undefined;
    const hasTrips = trips !== undefined;
    const hasNoTrips = hasTrips && !trips.length;
    if (hasApiError) {
        return replies.apiError;
    }
    if (!hasOrigin && !hasDestination) {
        return replies.trip.noPlaces;
    }
    if (hasOrigin && !hasDestination) {
        return replies.trip.noDestination;
    }
    if (hasDestination && !hasOrigin) {
        return replies.trip.noOrigin;
    }
    if (hasDestination && hasOrigin && !hasTrips) {
        const from = 'sao-paulo-tiete-sp';
        const to = 'santos-sp';
        const day = departureDay || moment();
        const departure = moment(day).format('YYYY-MM-DD');
        const url = `${CLICKBUS_URL}/trips?from=${from}&to=${to}&departure=${departure}`;
        console.log(`requesting ${url}`);
        return request(url);
    }
    if (hasDestination && hasOrigin && hasTrips && hasNoTrips) {
        return replies.trip.noTrips(origin, destination);
    }
    return replies.trip.departureList(origin, destination, departureDay, trips.length);
};

export { tripDialogReply };