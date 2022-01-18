/*
 * Copyright 2021 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { canSeeDemoData } from 'common/utils/permissions';
import {
  GENERAL,
  INTEGRATIONS,
  NOTIFICATIONS,
  DEFECT,
  ANALYSIS,
  DEMO_DATA,
  PATTERN_ANALYSIS,
} from 'common/constants/settingsTabs';
import { settingsTabSelector } from 'controllers/pages';
import { activeProjectRoleSelector, userAccountRoleSelector } from 'controllers/user';
import { uiExtensionSettingsTabsSelector } from 'controllers/plugins';
import { SETTINGS_PAGE_EVENTS } from 'components/main/analytics/events';
import { BetaBadge } from 'pages/inside/common/betaBadge';
import { NavigationTabs } from 'components/main/navigationTabs';
import { GeneralTab } from './generalTab';
import { AutoAnalysisTab } from './autoAnalysisTab';
import { NotificationsTab } from './notificationsTab';
import { DemoDataTab } from './demoDataTab';
import { IntegrationsTab } from './integrationsTab';
import { DefectTypesTab } from './defectTypesTab';
import { PatternAnalysisTab } from './patternAnalysisTab';
import styles from './settingsPage.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  general: {
    id: 'SettingsPage.general',
    defaultMessage: 'General',
  },
  notifications: {
    id: 'SettingsPage.notifications',
    defaultMessage: 'Notifications',
  },
  integrations: {
    id: 'SettingsPage.integrations',
    defaultMessage: 'Integrations',
  },
  defect: {
    id: 'SettingsPage.defect',
    defaultMessage: 'Defect types',
  },
  analysis: {
    id: 'SettingsPage.analysis',
    defaultMessage: 'Auto-Analysis',
  },
  demoData: {
    id: 'SettingsPage.demoData',
    defaultMessage: 'Demo data',
  },
  patternAnalysis: {
    id: 'SettingsPage.patternAnalysis',
    defaultMessage: 'Pattern-analysis',
  },
});

export const SettingsPage = injectIntl(
  connect((state) => ({
    activeTab: settingsTabSelector(state),
    accountRole: userAccountRoleSelector(state),
    userRole: activeProjectRoleSelector(state),
    tabExtensions: uiExtensionSettingsTabsSelector(state),
  }))(({ activeTab, onChangeTab, intl, createTabLink, accountRole, userRole, tabExtensions }) => {
    const createExtensionTabs = () => {
      return tabExtensions.reduce(
        (acc, extension) => ({
          ...acc,
          [extension.name]: {
            name: extension.title || extension.name,
            link: createTabLink(extension.name),
            component: <extension.component />,
            mobileDisabled: true,
            eventInfo: SETTINGS_PAGE_EVENTS.extensionTabClick(extension.title || extension.name),
          },
        }),
        {},
      );
    };

    const createTabsConfig = () => {
      const extensionTabs = createExtensionTabs();
      const tabsConfig = {
        [GENERAL]: {
          name: intl.formatMessage(messages.general),
          link: createTabLink(GENERAL),
          component: <GeneralTab />,
          eventInfo: SETTINGS_PAGE_EVENTS.GENERAL_TAB,
          mobileDisabled: true,
        },
        [INTEGRATIONS]: {
          name: (
            <span>
              {intl.formatMessage(messages.integrations)}
              <BetaBadge className={cx('beta')} />
            </span>
          ),
          link: createTabLink(INTEGRATIONS),
          component: <IntegrationsTab />,
          eventInfo: SETTINGS_PAGE_EVENTS.INTEGRATIONS_TAB,
        },
        [NOTIFICATIONS]: {
          name: intl.formatMessage(messages.notifications),
          link: createTabLink(NOTIFICATIONS),
          component: <NotificationsTab />,
          eventInfo: SETTINGS_PAGE_EVENTS.NOTIFICATIONS_TAB,
          mobileDisabled: true,
        },
        [DEFECT]: {
          name: intl.formatMessage(messages.defect),
          link: createTabLink(DEFECT),
          component: <DefectTypesTab />,
          eventInfo: SETTINGS_PAGE_EVENTS.DEFECT_TYPE_TAB,
          mobileDisabled: true,
        },
        [ANALYSIS]: {
          name: intl.formatMessage(messages.analysis),
          link: createTabLink(ANALYSIS),
          component: <AutoAnalysisTab />,
          eventInfo: SETTINGS_PAGE_EVENTS.AUTO_ANALYSIS_TAB,
          mobileDisabled: true,
        },
        [PATTERN_ANALYSIS]: {
          name: intl.formatMessage(messages.patternAnalysis),
          link: createTabLink(PATTERN_ANALYSIS),
          component: <PatternAnalysisTab />,
          eventInfo: SETTINGS_PAGE_EVENTS.PATTERN_ANALYSIS_TAB,
          mobileDisabled: true,
        },
        [DEMO_DATA]: {
          name: intl.formatMessage(messages.demoData),
          link: createTabLink(DEMO_DATA),
          component: <DemoDataTab />,
          eventInfo: SETTINGS_PAGE_EVENTS.DEMO_DATA_TAB,
          mobileDisabled: true,
        },
      };
      if (!canSeeDemoData(accountRole, userRole)) {
        delete tabsConfig[DEMO_DATA];
      }
      Object.keys(extensionTabs).forEach((tab) => {
        if (tabsConfig[tab]) {
          tabsConfig[tab].component = extensionTabs[tab].component;
          delete extensionTabs[tab];
        }
      });
      return { ...tabsConfig, ...extensionTabs };
    };

    const [config, setConfig] = useState(createTabsConfig());

    useEffect(() => {
      setConfig(createTabsConfig());
    }, [tabExtensions]);

    return (
      <div className={cx('settings-page')}>
        <NavigationTabs config={config} activeTab={activeTab} onChangeTab={onChangeTab} />
      </div>
    );
  }),
);
SettingsPage.propTypes = {
  projectId: PropTypes.string.isRequired,
  createTabLink: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  onChangeTab: PropTypes.func.isRequired,
  activeTab: PropTypes.string,
  accountRole: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  tabExtensions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string,
      component: PropTypes.func.isRequired,
    }),
  ),
};
SettingsPage.defaultProps = {
  activeTab: GENERAL,
  tabExtensions: [],
  accountRole: '',
  userRole: '',
};
