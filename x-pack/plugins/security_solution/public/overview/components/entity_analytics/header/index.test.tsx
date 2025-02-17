/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { EntityAnalyticsHeader } from '.';
import { Direction, RiskScoreFields, RiskSeverity } from '../../../../../common/search_strategy';
import type { SeverityCount } from '../../../../common/components/severity/types';
import { TestProviders } from '../../../../common/mock';
import { hostsActions } from '../../../../hosts/store';
import { HostsType } from '../../../../hosts/store/model';
import { usersActions } from '../../../../users/store';
import { UsersTableType } from '../../../../users/store/model';

const mockSeverityCount: SeverityCount = {
  [RiskSeverity.low]: 1,
  [RiskSeverity.high]: 1,
  [RiskSeverity.moderate]: 1,
  [RiskSeverity.unknown]: 1,
  [RiskSeverity.critical]: 99,
};

jest.mock('../../../../common/hooks/use_experimental_features', () => ({
  useIsExperimentalFeatureEnabled: () => true,
}));

jest.mock('../../../../risk_score/containers', () => {
  return {
    useHostRiskScoreKpi: () => ({ severityCount: mockSeverityCount }),
    useUserRiskScoreKpi: () => ({ severityCount: mockSeverityCount }),
  };
});

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const original = jest.requireActual('react-redux');
  return {
    ...original,
    useDispatch: () => mockDispatch,
  };
});

describe('RiskScoreDonutChart', () => {
  it('renders critical hosts', () => {
    const { getByTestId } = render(
      <TestProviders>
        <EntityAnalyticsHeader />
      </TestProviders>
    );

    expect(getByTestId('critical_hosts_quantity')).toHaveTextContent('99');
  });

  it('renders critical users', () => {
    const { getByTestId } = render(
      <TestProviders>
        <EntityAnalyticsHeader />
      </TestProviders>
    );

    expect(getByTestId('critical_users_quantity')).toHaveTextContent('99');
  });

  it('dispatches user risk tab filters actions', () => {
    const { getByTestId } = render(
      <TestProviders>
        <EntityAnalyticsHeader />
      </TestProviders>
    );

    act(() => {
      fireEvent.click(getByTestId('critical_users_link'));
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      usersActions.updateUserRiskScoreSeverityFilter({
        severitySelection: [RiskSeverity.critical],
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      usersActions.updateTableSorting({
        sort: { field: RiskScoreFields.riskScore, direction: Direction.desc },
        tableType: UsersTableType.risk,
      })
    );
  });

  it('dispatches host risk tab filters actions', () => {
    const { getByTestId } = render(
      <TestProviders>
        <EntityAnalyticsHeader />
      </TestProviders>
    );

    act(() => {
      fireEvent.click(getByTestId('critical_hosts_link'));
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      hostsActions.updateHostRiskScoreSeverityFilter({
        severitySelection: [RiskSeverity.critical],
        hostsType: HostsType.page,
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      hostsActions.updateHostRiskScoreSort({
        sort: { field: RiskScoreFields.riskScore, direction: Direction.desc },
        hostsType: HostsType.page,
      })
    );
  });
});
