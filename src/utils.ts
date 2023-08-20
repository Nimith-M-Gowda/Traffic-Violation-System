import { RTO_vehicleInfo } from './Database/Rto'
import { captured_VehicleData } from './Database/CapturedVehicleInfo'
import { SpeedLimitData } from './Database/SpeedLimit'
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
 * @returns Object : queries RTO DB and returns vehicle_Type and Owner_Phone_Number
 * @description Query for vehicleType and OwnerPhoneNumber from RTO DB
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
 * @description Query for all Camera-CapturedData from DB for particular VehicleID
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
 * @description Calculate Speed for a given vehicle and query for Speed limit in the particular location from DB
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
 * @description Based on speeding calculate how many times speed violation taken place
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
 * @description calculates fine amount based on speed violation
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
 * @param vehicleNumber string
 * @param phoneNumber string
 * @param fineAmount number
 * @param totalViolationCount number
 * @description  If there is any fine amount, then SMS user
 */
export const SMSOwner = (
	vehicleNumber: string,
	phoneNumber: string,
	fineAmount: number,
	totalViolationCount: number,
	locationId: string
) => {
	console.log('-------------------S M S-------------------------------')
	console.log(
		`Hi ${phoneNumber} This message is from Department of Traffic Police`
	)
	console.log(
		` Your Vehicle ${vehicleNumber} crossed the speedlimit ${totalViolationCount} time/times in ${locationId}`
	)
	console.log(`please pay the fine amount of ${fineAmount} Thanks You`)
}
