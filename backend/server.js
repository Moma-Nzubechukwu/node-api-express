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
	if (devKey){
		apiKeys.forEach((api)=>{
			if (api === devKey){
				isInApiList = true
			}
		})
		
		if (isInApiList){	
			const  phoneName = req.query["Company Name"]
			if (phoneName){
				const newData = data.filter(item => phoneName === item["Company Name"])
				res.send((newData))


			}else{
				res.send(data.slice(0, 5))
			}
		}else{
			res.send({
				"status":"sucess",
				"message":"not authorized"

			})
		}
	}

})
app.get("/api/get-api", (req, res)=>{
	res.sendFile(path.join(__dirname, 'index.html'));
})
app.listen(port, host, ()=>{
	console.log(`server listening on port ${port} at http://127.0.0.1:${port}`)
	console.log(`api started on http://127.0.0.1:${port}/api/phones/`)
})
