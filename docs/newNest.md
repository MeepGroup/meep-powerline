# Register and Provision a new Nest

## Prerequisites

For Alpha, we require the nest to be running Ubuntu 12+, Other distributions of
Linux will be supported during Beta.

Additionally we assume you have curl installed. Your machine must also be
accessible to public networking.

To register or provision a new nest you must be an admin on the API.
(subject to change after alpha.) Follow the guide below to setup your node with
Meep system.

## Registering your Nest

Post to the Meep API with the following schema:

Route: `https://api.gomeep.com/nest/register`

```
{
  address: '127.0.0.1',
  password: 'abcXYZ123',
  port: 22,
  name: 'Clever Nest Name',
  os: 'Ubuntu 14.04',
  provider: 'Softlayer (IBM)',
  location: 'Washington, DC',
  network: '1Gb/s Public',
  package: '512MB Public VPS Instance'
}
```

## Provision your Nest

Post to the Meep API with the following schema:

Route: `https://api.gomeep.com/nest/provision`

```
{
  address: '127.0.0.1'
}
```

## Closing remarks

It is important to note that in the Beta phase this step will be managed
automatically and only accessible by ordering a new machine from one of the
supported providers.
