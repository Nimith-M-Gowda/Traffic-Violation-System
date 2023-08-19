import { RTO_vehicleInfo } from './database/RTO'
import { captured_VehicleData } from './database/capturedVehicleInfo'
import { SpeedLimitData } from './database/speedLimit'
import { CAMERA_DISTANCE_IN_METRES, FINEAMOUNT_INR } from './constants'

/**
 *
 * @param value number
 * @returns number - this function converts given value from mts/sec to kms/hr
 */
export const convertToKmsPerHr = (value: number) => {
	try {
		if (value) return value * (18 / 5)
		else throw new Error('Invalid value to convert')
	} catch (_err) {
		const error = _err as Error
		throw error
	}
}

/**
 *
 * @param time :number
 * @returns speed in metres / sec
 */
export const calculateSpeed = (time: number) => {
	try {
		if (time) return CAMERA_DISTANCE_IN_METRES / time
		else throw new Error('Failed to calculate Speed')
	} catch (_err) {
		const error = _err as Error
		throw error
	}
}

/**
 *
 * @param vehicleId String
 * @returns Object : queries RTO DB and returns vwhicle_Type and Owner_Phone_Number
 */
export const getVehicleInfo = (vehicleId: string) => {
	try {
		const vehicleInfo = RTO_vehicleInfo?.find(
			vehicle => vehicle?.vehicleId === vehicleId
		)
		if (vehicleInfo)
			return {
				vehicleType: vehicleInfo?.vehicleType,
				ownerPhoneNumber: vehicleInfo?.ownerPhoneNumber
			}
		else throw new Error(`${vehicleId} not found`)
	} catch (_err) {
		const error = _err as Error
		throw error
	}
}

/**
 *
 * @param locationId String
 * @param vehicleType string
 * @returns Number : SpeedLimit of particular Location for particular VehicleType
 */
export const getLocationSpeedLimit = (
	locationId: string,
	vehicleType: string
) => {
	try {
		const locationSpeedLimit = SpeedLimitData?.find(
			limit => limit.placeId === locationId && limit.vehicleType === vehicleType
		)
		if (locationSpeedLimit?.speedLimit) {
			return locationSpeedLimit?.speedLimit
		} else throw new Error('No Speed Limit found in this Location')
	} catch (_err) {
		const error = _err as Error
		throw error
	}
}

/**
 *
 * @param vehicleId String
 * @param locationId String
 * @returns Object : captured violation data
 */
export const getCapturedVehicleViolationData = (
	vehicleId: string,
	locationId: string
) => {
	try {
		const captutredData = captured_VehicleData.filter(
			details =>
				details?.locationId === locationId && details?.vehicleId === vehicleId
		)
		if (captutredData.length) return captutredData
		else throw new Error(`This Vehicle ${vehicleId} is not captured `)
	} catch (_err) {
		const error = _err as Error
		throw error
	}
}

/**
 *
 * @param timeStamp1 String
 * @param timeStamp2 String
 * @returns Number : speed of a vehicle in kms / hr
 */
export const getVehicleSpeed = (timeStamp1: string, timeStamp2: string) => {
	const time1 = parseInt(timeStamp1)
	const time2 = parseInt(timeStamp2)

	const timeDifference = time2 - time1

	try {
		if (timeDifference > 0) {
			const speedInmetresPerSec = calculateSpeed(timeDifference)

			return convertToKmsPerHr(speedInmetresPerSec)
		} else throw new Error('timeStampData inValid')
	} catch (_err) {
		const error = _err as Error
		throw error
	}
}

/**
 *
 * @param SpeedInfo object
 * @returns Number : total number of times the Vehicle crossed the Speed Limit
 */
export const getTotalViolationCount = (
	SpeedInfo: { locationSpeedLimitData: number; vehicleSpeed: number }[]
) => {
	try {
		const finableDataCount = SpeedInfo.filter(
			eachSpeedInfo =>
				eachSpeedInfo.vehicleSpeed > eachSpeedInfo.locationSpeedLimitData
		)

		return finableDataCount.length
	} catch (_err) {
		const error = _err as Error
		throw error
	}
}

/**
 *
 * @param vehicleType 'bike' | 'car' | 'bus' | 'truck'
 * @param totalViolationCount number
 * @returns Number : Total amount to be paid
 */
export const calculateFineToBePaid = (
	vehicleType: 'bike' | 'car' | 'bus' | 'truck',
	totalViolationCount: number
) => {
	try {
		if (totalViolationCount !== 0)
			return FINEAMOUNT_INR[vehicleType] * totalViolationCount
		else throw new Error('No Violation is seen from this Vehicle')
	} catch (_err) {
		const error = _err as Error
		throw error
	}
}

/**
 *
 * @param vehicleNumber number
 * @param phnumber string
 * @param fineAmount number
 * @param totalViolationCount number
 */
export const SMSOwner = (
	vehicleNumber: string,
	phnumber: string,
	fineAmount: number,
	totalViolationCount: number
) => {
	console.log('-------------------S M S-------------------------------')
	console.log(
		`Hi ${phnumber} This message is from Department of Traffic Police`
	)
	console.log(
		` Your Vehicle ${vehicleNumber} crossed the speedlimit ${totalViolationCount} time/times`
	)
	console.log(`please pay the fine amount of ${fineAmount} Thanks You`)
}
