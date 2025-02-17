/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { FilesSetup, FilesStart, FilesClient } from '@kbn/files-plugin/public';

export interface FilesExamplePluginsSetup {
  files: FilesSetup;
}

export interface FilesExamplePluginsStart {
  files: FilesStart;
}

export interface FileClients {
  // Example file kind
  example: FilesClient;
}

export interface AppPluginStartDependencies {
  files: FileClients;
}
