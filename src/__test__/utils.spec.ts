import {
	calculateFineToBePaid,
	calculateSpeed,
	convertToKmsPerHr,
	getCapturedVehicleViolationData,
	getLocationSpeedLimit,
	getTotalViolationCount,
	getVehicleInfo,
	getVehicleSpeed
} from '../utils'

describe('test util functions', () => {
	it('convertToKmsPerHr', () => {
		expect(convertToKmsPerHr(5)).toBe(18)
	})

	it('calculateSpeed', () => {
		expect(Math.floor(calculateSpeed(60))).toBe(16)
	})

	it('getVehicleInfo', () => {
		expect(getVehicleInfo('KA18EH1616')).toStrictEqual({
			vehicleType: 'bike',
			ownerPhoneNumber: '8861874460'
		})
	})

	it('getLocationSpeedLimit', () => {
		expect(getLocationSpeedLimit('Street1', 'bike')).toBe(80)
	})

	it('getCapturedVehicleViolationData1', () => {
		expect(
			getCapturedVehicleViolationData('KA18Z0001', 'Street1')
		).toStrictEqual([
			{
				vehicleId: 'KA18Z0001',
				locationId: 'Street1',
				timeStamp1: '1692435540',
				timeStamp2: '1692435580'
			}
		])
	})

	it('getCapturedVehicleViolationData2', () => {
		expect(
			getCapturedVehicleViolationData('KA18EH1616', 'Street1')
		).toStrictEqual([
			{
				vehicleId: 'KA18EH1616',
				locationId: 'Street1',
				timeStamp1: '1692435479',
				timeStamp2: '1692435510'
			},
			{
				vehicleId: 'KA18EH1616',
				locationId: 'Street1',
				timeStamp1: '1692435779',
				timeStamp2: '1692435910'
			}
		])
	})

	it('getVehicleSpeed', () => {
		expect(getVehicleSpeed('1692435540', '1692435660')).toBe(30.000000000000004)
	})

	it('getTotalViolationCount1', () => {
		expect(
			getTotalViolationCount([{ locationSpeedLimitData: 30, vehicleSpeed: 60 }])
		).toBe(1)
	})

	it('getTotalViolationCount2', () => {
		expect(
			getTotalViolationCount([{ locationSpeedLimitData: 60, vehicleSpeed: 30 }])
		).toBe(0)
	})

	it('calculateFineToBePaid1', () => {
		expect(calculateFineToBePaid('bus', 2)).toBe(1200)
	})

	it('calculateFineToBePaid2', () => {
		expect(calculateFineToBePaid('truck', 2)).toBe(1600)
	})
	it('calculateFineToBePaid3', () => {
		expect(calculateFineToBePaid('bike', 1)).toBe(200)
	})

	it('calculateFineToBePaid4', () => {
		expect(calculateFineToBePaid('car', 3)).toBe(1200)
	})
})
