/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import Url from 'url';
import cypress from 'cypress';
import { esTestConfig } from '@kbn/test';
import { apm, createLogger, LogLevel } from '@kbn/apm-synthtrace';
import path from 'path';
import { FtrProviderContext } from './ftr_provider_context';
import { createApmUsers } from '../scripts/create_apm_users/create_apm_users';

export async function cypressTestRunner({ getService }: FtrProviderContext) {
  const config = getService('config');
  const kibanaVersion = esTestConfig.getVersion();

  const kibanaUrl = Url.format({
    protocol: config.get('servers.kibana.protocol'),
    hostname: config.get('servers.kibana.hostname'),
    port: config.get('servers.kibana.port'),
  });

  const username = config.get('servers.elasticsearch.username');
  const password = config.get('servers.elasticsearch.password');

  // Creates APM users
  await createApmUsers({
    elasticsearch: { username, password },
    kibana: { hostname: kibanaUrl },
  });

  const esNode = Url.format({
    protocol: config.get('servers.elasticsearch.protocol'),
    port: config.get('servers.elasticsearch.port'),
    hostname: config.get('servers.elasticsearch.hostname'),
    auth: `${username}:${password}`,
  });

  const esRequestTimeout = config.get('timeouts.esRequestTimeout');
  const kibanaClient = new apm.ApmSynthtraceKibanaClient(
    createLogger(LogLevel.info)
  );

  await kibanaClient.installApmPackage(
    kibanaUrl,
    kibanaVersion,
    username,
    password
  );

  const cypressProjectPath = path.join(__dirname);
  const { open, ...cypressCliArgs } = getCypressCliArgs();
  const cypressExecution = open ? cypress.open : cypress.run;
  const res = await cypressExecution({
    ...cypressCliArgs,
    project: cypressProjectPath,
    config: {
      baseUrl: kibanaUrl,
      requestTimeout: 10000,
      responseTimeout: 60000,
      defaultCommandTimeout: 15000,
    },
    env: {
      KIBANA_URL: kibanaUrl,
      ES_NODE: esNode,
      ES_REQUEST_TIMEOUT: esRequestTimeout,
      TEST_CLOUD: process.env.TEST_CLOUD,
    },
  });

  return res;
}

function getCypressCliArgs() {
  if (!process.env.CYPRESS_CLI_ARGS) {
    return {};
  }

  const { $0, _, ...cypressCliArgs } = JSON.parse(
    process.env.CYPRESS_CLI_ARGS
  ) as Record<string, unknown>;

  return cypressCliArgs;
}
