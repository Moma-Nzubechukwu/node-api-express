const express = require("express")
const data = require("./data/phones.json")
const apiKeys = require('./data/api-keys.json')
const app = express()
const port = 8080;
const host = "0.0.0.0"
//console.log(data)
//data.forEach((item)=>{
//	console.log(item["Company Name"])
//})
app.get("/api/phones/:devKey", (req, res)=>{
	console.log(req.params)
	console.log(req.query)
	const {devKey} = req.params
	let isInApiList = false
	let newData = data;
	if (devKey){
		apiKeys.forEach((api)=>{
			if (api === devKey){
				isInApiList = true
			}
		})
		
		if (isInApiList){	
			const  phoneName = req.query["Company Name"]
			const modelName = req.query["Model Name"]
			const mobileWeight = req.query["Mobile Weight"]
			const ramSize = req.query["RAM"]
			const frontCamera = req.query["Front Camera"]
			const backCamera = req.query["Back Camera"]
			const processor = req.query["Processor"]
			const battryCapacity = req.query["Battery Capacity"]
			const screenSize = req.query["Screen Size"]
			const launchedPrize = req.query["Launched Price"]
//			let newData = data;
			if (phoneName){
				newData = newData.filter(item => phoneName === item["Company Name"])
				


			}
			if (modelName){
				newData = newData.filter(item => modelNumber === item["Model Name"])
			}
			if (mobileWeight){
				newData = newData.filter(item => mobileWeight === item["Mobile Weight"])
			}
			if (ramSize){
				newData = newData.filter(item => ramSize === item["RAM"])

			}
			if (frontCamera){
				newData = newData.filter(item => frontCamera === item["Front Camera"])
			}
			if (backCamera){
				newData = newData.filter(item => backCamera === item["Back Camera"])
			}
			if (processor){
				newData = newData.filter(item => processor === item["Processor"])
			}
			if (battryCapacity){
				newData = newData.filter(item => battryCapacity === item["Battery Capacity"])
			}
			if (screenSize){
				newData = newData.filter(item => screenSize === item["Screen Size"])
			}
			if (launchedPrize){
				newData = newData.filter(item => launchedPrize === item["Launched Price"])
			}

		}else{
			newData = ({
				"status":"sucess",
				"message":"not authorized"

			})
		}
	}
	res.send(newData)

})
app.get("/api/get-api", (req, res)=>{
	res.sendFile(path.join(__dirname, 'index.html'));
})
app.listen(port, host, ()=>{
	console.log(`server listening on port ${port} at http://127.0.0.1:${port}`)
	console.log(`api started on http://127.0.0.1:${port}/api/phones/`)
})
