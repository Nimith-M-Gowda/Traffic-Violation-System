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
 *@description This is the ROOT function takes Vehicle-ID and Location-ID
 * Step 1 : Query for all Camera-CapturedData from DB for particular VehicleID.
 * Step 2 : Query for vehicleType and OwnerPhoneNumber from RTO DB.
 * Step 3 : Calculate Speed for a given vehicle and query for Speed limit in the particular location from DB
 * Step 4 : Based on above speeding calculate how many times speed violation taken place
 * Step 5 : calculates fine amount based on speed violation
 * Step 6 : As fine is based on vehicle type, calculate total-Violation-Count multiply with fine amount
 * Step 7 : If there is any fine amount, then SMS user
 * Step 8 : If no fine print message "No violation from vehicle"
 */
export const handler = ((vehicleId: string, locationId: string) => {
	try {
		const gettrafficViolatedVehicleData = getCapturedVehicleViolationData(
			vehicleId,
			locationId
		)
		// console.log(
		// 	'gettrafficViolatedVehicleData :',
		// 	gettrafficViolatedVehicleData
		// )

		const { vehicleType, ownerPhoneNumber } = getVehicleInfo(vehicleId)
		// console.log(
		// 	'vehicleType:',
		// 	vehicleType,
		// 	'ownerPhoneNumber:',
		// 	ownerPhoneNumber
		// )

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
		// console.log('SpeedInfo :', SpeedInfo)

		const TotalMistakeCount = getTotalViolationCount(SpeedInfo)
		// console.log('TotalMistakeCount :', TotalMistakeCount)

		const fineAmount = calculateFineToBePaid(vehicleType, TotalMistakeCount)
		// console.log('fineAmount :', fineAmount)
		SMSOwner(
			vehicleId,
			ownerPhoneNumber,
			fineAmount,
			TotalMistakeCount,
			locationId
		)
	} catch (_err) {
		const error = _err as Error
		console.log(error.message)
	}
})('KA18EK7172', 'BrigadeRoad')
