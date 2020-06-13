const express = require("express")
const axios = require("axios")

// DATA SETS
const { cityCouncil } = require("./data/cityCouncilMembers")
const { brooklynCommunityBoards } = require("./data/brooklynCommunityBoards")

const app = express()

/*
    MAIN and ONLY API ROUTE.
    Get address from req.params, format address for google api call.
    Get top level info and add to response obj.
*/
app.get("/api/info/:address", async (req, res) => {
    const address = req.params.address
    console.log(address)
    const formattedAddress = address.replace(/ /g,"%20");

    const key = process.env.GOOGLE_API_KEY
    try {
        const url = `https://www.googleapis.com/civicinfo/v2/representatives?key=${key}&address=${formattedAddress}`
        const response = await axios.get(url)
        let zip

        // Need zip to get borough board members
        // throw error if we don't have it
        if (response.data.normalizedInput.zip) {
            zip = response.data.normalizedInput.zip
        } else {
            throw new Error("Please include your zip code.")
        }
        
        const borough = response.data.normalizedInput.city
        const councilMembers = cityCouncil.filter(member => member.borough === borough)
        let communityBoard

        // Get borough board members
        if (borough === "Brooklyn") {

            communityBoard = brooklynCommunityBoards.find(board => {
                console.log(typeof parseInt(board.zip))
                console.log(typeof zip)
                return parseInt(board.zip) == zip
            })

            // Make sure we found board members, check for undefined
            if (communityBoard === undefined) {
                communityBoard = "Board Members Not Found."
            }
        }

        // Send back the offices and the council members
        res.send({ offices: response.data.offices, councilMembers, communityBoard })
    } catch (e) {
        res.status(500).send("Incorrect message format. Please provide full address")
    }
})

app.listen(process.env.PORT, () => console.log('Server up and running...'))