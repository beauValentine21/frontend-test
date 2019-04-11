import {all, call, fork, put, select, take} from 'redux-saga/effects';
import {getAlternateLocationData, getBusinesses} from 'Services';
import {createAction, loadBusinesses, storeUpdatedPosition} from 'Store/actions';
import {selectFilters, selectLocation} from 'Store/selectors';
import signals from 'Store/signals';

function updatePosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 1000, // 1 second in ms
            maximumAge: 3600000, // 1 hour old in ms
        });
    });
}

function* locationSaga() {
    while (true) {
        let position;
        try {
            position = yield call(updatePosition);
        } catch (e) {
            console.warn('navigation.geolocation failed to give current position.');
            try {
                const data = yield call(getAlternateLocationData);
                position = data.zip || data.city;
                console.log(`Using ${position} for position, instead of geolocation.`);
            } catch (e) {
                console.log("I'm giving up...We're in San Francisco now!");
                position = 'San Francisco';
            }
        }
        yield put(storeUpdatedPosition(position));
        yield put(createAction(signals.LOCATION_UPDATED));
        yield take(signals.UPDATE_LOCATION);
    }
}

function* initLoadBusinesses() {
    yield put(loadBusinesses());
}

function* watchUpdateFilters() {
    let {updateFilters} = yield all({
        updateFilters: take(signals.UPDATE_FILTERS),
        waitForLocation: take(signals.LOCATION_UPDATED),
    });
    while (true) {
        const {type, ...params} = updateFilters;
        const location = selectLocation(yield select());
        const {filters, ...pagination} = params;
        yield updateBusinesses({...pagination, ...filters, ...location});
        updateFilters = yield take(signals.UPDATE_FILTERS);
    }
}

function* paginationSaga() {
    while (true) {
        const {limit, offset} = yield take(signals.UPDATE_PAGE);
        const state = yield select();
        const filters = selectFilters(state);
        const location = selectLocation(state);
        yield updateBusinesses({limit, offset, ...filters, ...location});
    }
}

function* updateBusinesses(params) {
    const response = yield call(getBusinesses, params);
    yield put(createAction(signals.BUSINESSES_LOADED, response.data.search));
}

export default function* root() {
    yield all([
        fork(watchUpdateFilters),
        fork(initLoadBusinesses),
        fork(locationSaga),
        fork(paginationSaga),
    ]);
}
