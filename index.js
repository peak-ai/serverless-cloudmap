'use strict';

class Cloudmap {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      deploy: {
        lifecycleEvents: ['resources', 'functions'],
      },
    };

    this.hooks = {
      'package:initialize': this.generateCloudformation.bind(this),
    };
  }

  generateCloudformation() {
    const { cloudmap } = this.serverless.service.custom;
    const rsrc = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
    const { service, instances } = cloudmap;
    rsrc[service.cfname] = {
      'Type': 'AWS::ServiceDiscovery::Service',
      'Properties': {
        'Description': service.description,
        'Name': service.name,
        'NamespaceId': service.namespace,
      },
    };
    for (let i in instances) {
      const func = instances[i];
      rsrc[func.cfname] = {
        'Type': "AWS::ServiceDiscovery::Instance",
        'Properties': {
          'InstanceAttributes': {
            'arn': func.arn,
            'handler': func.name,
            'type': 'function',
            ...func.config,
          },
          'InstanceId': func.arn,
          'ServiceId': func.id,
        },
      };
    }
    this.serverless.service.provider.compiledCloudFormationTemplate.Resources = rsrc;
  };
}

module.exports = Cloudmap;
