import {
	SMSOwner,
	calculateFineToBePaid,
	getCapturedVehicleViolationData,
	getLocationSpeedLimit,
	getTotalViolationCount,
	getVehicleInfo,
	getVehicleSpeed
} from './utils'

/**
 * This is the ROOT function takes Vehicle-ID and Location-ID
 * calculates fine amount based on speed violation
 * SMS vehicle owner regarding the fine
 */
export const handler = ((vehicleId: string, locationId: string) => {
	try {
		const { vehicleType, ownerPhoneNumber } = getVehicleInfo(vehicleId)

		const gettrafficViolatedVehicleData = getCapturedVehicleViolationData(
			vehicleId,
			locationId
		)

		const SpeedInfo = gettrafficViolatedVehicleData.map(eachViolatedData => {
			const locationSpeedLimitData = getLocationSpeedLimit(
				eachViolatedData.locationId,
				vehicleType
			)

			const vehicleSpeed = getVehicleSpeed(
				eachViolatedData.timeStamp1,
				eachViolatedData.timeStamp2
			)
			return {
				locationSpeedLimitData,
				vehicleSpeed
			}
		})

		const TotalMistakeCount = getTotalViolationCount(SpeedInfo)
		const fineAmount = calculateFineToBePaid(vehicleType, TotalMistakeCount)

		SMSOwner(vehicleId, ownerPhoneNumber, fineAmount, TotalMistakeCount)
	} catch (_err) {
		const error = _err as Error
		console.log(error.message)
	}
})('KA18EK7172', 'BrigadeRoad')
