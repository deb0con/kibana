/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { uiSettingsServiceMock } from '@kbn/core-ui-settings-browser-mocks';
import { coreMock } from '@kbn/core/public/mocks';
import { dataViewPluginMocks } from '@kbn/data-views-plugin/public/mocks';
import { uiActionsPluginMock } from '@kbn/ui-actions-plugin/public/mocks';
import {
  createIndexPatternService,
  IndexPatternServiceProps,
  IndexPatternServiceAPI,
} from '../indexpattern_service/service';

export function createIndexPatternServiceMock({
  core = coreMock.createStart(),
  uiSettings = uiSettingsServiceMock.createStartContract(),
  dataViews = dataViewPluginMocks.createStartContract(),
  uiActions = uiActionsPluginMock.createStartContract(),
  updateIndexPatterns = jest.fn(),
  replaceIndexPattern = jest.fn(),
}: Partial<IndexPatternServiceProps> = {}): IndexPatternServiceAPI {
  return createIndexPatternService({
    core,
    uiSettings,
    updateIndexPatterns,
    replaceIndexPattern,
    dataViews,
    uiActions,
  });
}
