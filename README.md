<img src="http://i.imgur.com/g9vkPYh.png" alt="Powerline Logo" width="350">

Powerline is the powerhouse API that runs Meep. It's build on NodeJS and supports
any frontend that can make Get, Post and Put requests.

## Getting Started

To start, please make sure you have NodeJS `v5.2.0` or greater installed. You
will also need to install MongoDB and have it running before beginning.

Powerline expects `meep-rooster` and `meep-hawk` to be running on the master Nest.
Additionally Powerline should only be run on the Master server for your Meep setup.

## Running Powerline

To build first `npm i`, then simply run `npm start`. You may then visit
`http://localhost:3002` in your browser, or start making requests.

```
npm install
npm start
```

## Documentation

Powerline Manual:
* [Feature List](https://github.com/MeepGroup/meep-powerline/blob/master/docs/featureList.md)
* [Registering a Nest](https://github.com/MeepGroup/meep-powerline/blob/master/docs/newNest.md)
* [Reserved Ports](https://github.com/MeepGroup/meep-powerline/blob/master/docs/portReserve.md)

## Apiary Documentation

API Developer documentation can be found on apiary.io via the link below.

http://docs.powerline.apiary.io/
