import React from 'react'
import {
  MonitorConfig,
  PubSubConfig,
  BulkActionsConfig,
  FeatureFlagComponent,
  OAuthJobs,
} from 'uiSrc/components'
import { FeatureFlags } from 'uiSrc/constants'
import CommonAppSubscription from './CommonAppSubscription'

const GlobalSubscriptions = () => (
  <>
    <CommonAppSubscription />
    <MonitorConfig />
    <PubSubConfig />
    <FeatureFlagComponent name={FeatureFlags.disabledByEnv} enabledByDefault>
      <BulkActionsConfig />
    </FeatureFlagComponent>
    <FeatureFlagComponent name={FeatureFlags.cloudSso}>
      <OAuthJobs />
    </FeatureFlagComponent>
  </>
)

export default GlobalSubscriptions
