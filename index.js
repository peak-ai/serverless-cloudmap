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
    const {
      cloudmap
    } = this.serverless.service.custom;
    const rsrc = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
    const {
      services
    } = cloudmap;
    services.forEach((service) => {
      rsrc[service.cfname] = {
        'Type': 'AWS::ServiceDiscovery::Service',
        'Properties': {
          'Description': service.description,
          'Name': service.name,
          'NamespaceId': service.namespace,
        },
      };
      service.instances.forEach((instance) => {
        rsrc[instance.cfname] = {
          'Type': "AWS::ServiceDiscovery::Instance",
          'Properties': {
            'InstanceAttributes': {
              'arn': instance.arn,
              'handler': instance.name,
              'type': 'function',
              ...instance.config,
            },
            'InstanceId': instance.name,
            'ServiceId': {
              'Ref': service.cfname,
            }
          },
        };
      });
    });

    this.serverless.service.provider.compiledCloudFormationTemplate.Resources = rsrc;
  };
}

module.exports = Cloudmap;
