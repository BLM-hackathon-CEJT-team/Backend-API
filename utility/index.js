const { brooklynCommunityBoards } = require("../data/brooklynCommunityBoards")
const { queensCommunityBoards } = require("../data/queensCommunityBoards")
const { bronxCommunityBoards } = require("../data/bronxCommunityBoards")
const { manhattanCommunityBoards } = require("../data/manhattanCommunityBoards")

/*
    Get your local community. If community board isn't found by borough and zip,
    returns string "Community Board Not Found.", otherwise returns community board
*/
const getCommunityBoard = (borough, zip) => {
    let communityBoard

    // Get borough board members
    switch(borough) {
        case "Brooklyn":
            communityBoard = brooklynCommunityBoards.find(board => parseInt(board.zip) == zip)
            break
        case "Queens":
            communityBoard = queensCommunityBoards.find(board => parseInt(board.zip) == zip)
            break
        case "Bronx":
            communityBoard = bronxCommunityBoards.find(board => parseInt(board.zip) == zip)
            break
        case "Manhattan":
            communityBoard = manhattanCommunityBoards.find(board => parseInt(board.zip) == zip)
        default: 
            communityBoard = undefined
    }
    
    // Make sure we found board members, check for undefined
    if (communityBoard === undefined) {
        communityBoard = "Community Board Not Found."
    }

    return communityBoard
}

module.exports = { getCommunityBoard }