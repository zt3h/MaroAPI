# Maro's API Service

A Hypixel Skyblock focused API providing an easier way to communicate with Hypixel's API.

The API has different endpoints which include; auction data, networth data, bazaar data and forge profit data.

## Setup Instructions using NodeJS

### Prerequisites

- NodeJS >= 14
- Mongo Database

### Local Setup

To get started, clone the repository using:

    git clone https://github.com/zt3h/maro-api

Next go into the `maro-api` folder and install the required dependencies using either Yarn or NPM:

    yarn install
    npm install

Then you can start the API service using the following command using either Yarn or NPM:

    yarn start
    npm start

### Database Setup

First navigate into the `/backup` folder and import the .csv files into a Mongo Database.

    mongoimport --type csv -d maro -c auctions --headerline --drop auctions.csv <MongoConnectionString>
    mongoimport --type csv -d maro -c bazzar --headerline --drop bazzar.csv <MongoConnectionString>
    mongoimport --type csv -d maro -c leaderboards --headerline --drop leaderboards.csv <MongoConnectionString>
    mongoimport --type csv -d maro -c players --headerline --drop players.csv <MongoConnectionString>

To change the database name replace maro in `-d maro` with the desired database name.

Once done, you will then need to enter your Mongo DB URL to the `config.js` before starting the application.

### Endpoint Usage

Endpoints that require a valid parameter will be listed on the API documentation which can be found by navigating to the below route once the application has been started.

    http://localhost:3000/

For sending a request to the POST endpoints, details on the required body structure and the response format is found [here](https://gist.github.com/zt3h)

### Support / Contact

If you have any questions or queries about the code please join Maro's [discord](https://discord.gg/CAMZpQyCxU) and open a ticket and I'll try to answer it ASAP.

## License

Maro's API is an open-sourced software licensed under the [MIT](https://opensource.org/licenses/MIT)
