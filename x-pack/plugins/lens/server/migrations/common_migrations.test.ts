/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { DataViewSpec } from '@kbn/data-views-plugin/common';
import { Filter } from '@kbn/es-query';
import { getLensDataViewMigrations, getLensFilterMigrations } from './common_migrations';

describe('Lens migrations', () => {
  describe('applying filter migrations', () => {
    it('creates a filter migrations map that works on a lens visualization', () => {
      const filterMigrations = {
        '1.1': (filters: Filter[]) => filters.map((filter) => ({ ...filter, version: '1.1' })),
        '2.2': (filters: Filter[]) => filters.map((filter) => ({ ...filter, version: '2.2' })),
        '3.3': (filters: Filter[]) => filters.map((filter) => ({ ...filter, version: '3.3' })),
      };

      const lensVisualizationSavedObject = {
        attributes: {
          state: {
            filters: [{}, {}],
          },
        },
      };

      const migrationMap = getLensFilterMigrations(filterMigrations);

      expect(migrationMap['1.1'](lensVisualizationSavedObject).attributes.state.filters).toEqual([
        { version: '1.1' },
        { version: '1.1' },
      ]);
      expect(migrationMap['2.2'](lensVisualizationSavedObject).attributes.state.filters).toEqual([
        { version: '2.2' },
        { version: '2.2' },
      ]);
      expect(migrationMap['3.3'](lensVisualizationSavedObject).attributes.state.filters).toEqual([
        { version: '3.3' },
        { version: '3.3' },
      ]);
    });
  });

  describe('applying data view migrations', () => {
    it('creates a data view migrations map that works on a lens visualization', () => {
      const dataViewMigrations = {
        '1.1': (dataView: DataViewSpec) => ({ ...dataView, name: '1.1' }),
        '2.2': (dataView: DataViewSpec) => ({ ...dataView, name: '2.2' }),
        '3.3': (dataView: DataViewSpec) => ({ ...dataView, name: '3.3' }),
      };

      const lensVisualizationSavedObject = {
        attributes: {
          state: {
            adHocDataViews: {
              abc: {
                id: 'abc',
              },
              def: {
                id: 'def',
              },
            },
          },
        },
      };

      const migrationMap = getLensDataViewMigrations(dataViewMigrations);

      expect(
        migrationMap['1.1'](lensVisualizationSavedObject).attributes.state.adHocDataViews
      ).toEqual({
        abc: {
          id: 'abc',
          name: '1.1',
        },
        def: {
          id: 'def',
          name: '1.1',
        },
      });
      expect(
        migrationMap['2.2'](lensVisualizationSavedObject).attributes.state.adHocDataViews
      ).toEqual({
        abc: {
          id: 'abc',
          name: '2.2',
        },
        def: {
          id: 'def',
          name: '2.2',
        },
      });
      expect(
        migrationMap['3.3'](lensVisualizationSavedObject).attributes.state.adHocDataViews
      ).toEqual({
        abc: {
          id: 'abc',
          name: '3.3',
        },
        def: {
          id: 'def',
          name: '3.3',
        },
      });
    });
  });
});
