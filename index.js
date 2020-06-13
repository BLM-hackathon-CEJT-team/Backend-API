const express = require("express")
const axios = require("axios")
const { cityCouncil } = require("./data/cityCouncilMembers")

const app = express()

/*
    MAIN and ONLY API ROUTE.
    Get address from req.params, format address for google api call.
    Get top level info and add to response obj.
*/
app.get("/api/info/:address", async (req, res) => {
    const address = req.params.address
    const formattedAddress = address.replace(/ /g,"%20");

    const key = process.env.GOOGLE_API_KEY
    try {
        const url = `https://www.googleapis.com/civicinfo/v2/representatives?key=${key}&address=${formattedAddress}`
        const response = await axios.get(url)
        const borough = response.data.normalizedInput.city
        const councilMembers = cityCouncil.filter(member => member.borough === borough)
        // Send back the offices and the council members
        res.send({ offices: response.data.offices, councilMembers })
    } catch (e) {
        res.status(500).send("Incorrect message format. Please add city and state!")
    }
})

app.listen(process.env.PORT, () => console.log('Server up and running...'))