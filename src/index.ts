import {
	SMSOwner,
	calculateFineToBePaid,
	getCapturedVehicleViolationData,
	getLocationSpeedLimit,
	getTotalViolationCount,
	getVehicleInfo,
	getVehicleSpeed
} from './utils'

export const handler = ((vehicleId: string, locationId: string) => {
	try {
		//Step 1 : Query for all Camera-CapturedData from DB for particular VehicleID.
		const gettrafficViolatedVehicleData = getCapturedVehicleViolationData(
			vehicleId,
			locationId
		)
		console.log(
			'get Traffic Violated Vehicle Data :',
			gettrafficViolatedVehicleData
		)

		// Step 2 : Query for vehicleType and OwnerPhoneNumber from RTO DB.
		const { vehicleType, ownerPhoneNumber } = getVehicleInfo(vehicleId)
		console.log(
			`vehicleType : ${vehicleType}, ownerPhoneNumber : ${ownerPhoneNumber}`
		)

		//Step 3 : Calculate Speed for a given vehicle and query for Speed limit in the particular location from DB
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
		console.log('SpeedInfo :', SpeedInfo)

		// Step 4 : Based on above speeding calculate how many times speed violation taken place
		const TotalMistakeCount = getTotalViolationCount(SpeedInfo)
		console.log('TotalMistakeCount', TotalMistakeCount)

		//Step 5 : calculates fine amount based on speed violation
		const fineAmount = calculateFineToBePaid(vehicleType, TotalMistakeCount)
		console.log('fineAmount', fineAmount)

		//Step 6 : If there is any fine amount, then SMS user
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
