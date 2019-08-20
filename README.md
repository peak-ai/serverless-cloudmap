# Serverless Cloudmap

This library is a Serverless plugin which allows for easy creation and configuration of Cloudmap services.

Cloudmap is an AWS tool for service discovery, and servide metadata. This is useful, as you can register your Lambda functions, DynamoDB tables, Elasticache instances and just about anything else in a serverless, highly available metadata store.

Imagine being able to resolve the location of any of your lambda functions with a user friendly name, such as `create.user`.

## Registering a service and your individual functions

serverless.yml

```yaml
custom:
  cloudmap:
    service:
      cfname: 'MyService' # Cloudformation friendly name
      name: 'my-service' # Service name
      namespace: 'namespace-id' # Reference to a namespace ID
      description: 'Some description'
    instances:
      - cfname: 'ThingInstance' # Cloudformation friendly name
        name: 'user.created' # Individual, friendly function name
        id: 'testing.123' # Unique ID (optional, can be used instead of name)
        arn: 'arn::etc' # Arn or reference to your individual serverless function
        config:
          retries: 3 # Additional configuration or metadata
```

## Using application libraries

You can utilise this plugin with some additional libraries created to provide a rich application framework feel to AWS + Serverless.

- JavaScript: https://github.com/peak-ai/ais-service-discovery-js 
- Golang: https://github.com/peak-ai/ais-service-discovery-go

Once you've registered your Lambda functions/services, you can then call them with the above libraries:

```javascript
const res = await Discovery.request('user.create', user); // Calls a Lambda
await Discovery.queue('new.users', user); // Puts a message on an SQS Queue
```

## Todo

- Generate namespaces
