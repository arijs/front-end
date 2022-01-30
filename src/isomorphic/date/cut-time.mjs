import { cutNumber, cutNumberArray } from '../utils/cut-number.mjs';

const timeDivsMsToHour = [
	{ key: 'ms', count: 1000 },
	{ key: 's', count: 60 },
	{ key: 'm', count: 60 },
	{ key: 'h', count: 24 },
]

const timeDivsDayToMonth = [
	{ key: 'd', count: 365.25/12 },
	{ key: 'M', count: 12 },
]

const timeDayDivs = [
	...timeDivsMsToHour,
	{ key: 'd' },
]

const timeYearDivs = [
	...timeDivsMsToHour,
	...timeDivsDayToMonth,
	{ key: 'a' },
]

const timeDayDivArray = [
	1000, 60, 60, 24,
]

const timeYearDivArray = [
	...timeDayDivArray,
	365.25/12, 12,
]

export function cutTimeDays(number) {
	return cutNumber(timeDayDivs, number)
}

export function cutTimeYears(number) {
	return cutNumber(timeYearDivs, number)
}

export function cutTimeDaysArray(number) {
	return cutNumberArray(timeDayDivArray, number)
}

export function cutTimeYearsArray(number) {
	return cutNumberArray(timeYearDivArray, number)
}
