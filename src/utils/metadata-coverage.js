const debug = require('debug')('qdx')
const _ = require('lodash')

const report = [
  {
    type: 'ActionLinkGroupTemplate',
  },
  {
    type: 'AnimationRule',
  },
  {
    type: 'ApexClass',
    folder: 'classes',
  },
  {
    type: 'ApexComponent',
  },
  {
    type: 'ApexEmailNotifications',
  },
  {
    type: 'ApexPage',
  },
  {
    type: 'ApexTestSuite',
  },
  {
    type: 'ApexTrigger',
  },
  {
    type: 'AppMenu',
  },
  {
    type: 'ApprovalProcess',
  },
  {
    type: 'AssignmentRules',
  },
  {
    type: 'AuraDefinitionBundle',
  },
  {
    type: 'AuthProvider',
  },
  {
    type: 'AutoResponseRules',
  },
  {
    type: 'BrandingSet',
  },
  {
    type: 'CallCenter'
  },
  {
    type: 'CampaignInfluenceModel',
  },
  {
    type: 'CanvasMetadata',
  },
  {
    type: 'Certificate',
  },
  {
    type: 'ChannelLayout',
  },
  {
    type: 'ChatterExtension',
  },
  {
    type: 'CleanDataService',
  },
  {
    type: 'Community',
  },
  {
    type: 'CommunityTemplateDefinition',
  },
  {
    type: 'CommunityThemeDefinition',
  },
  {
    type: 'ConnectedApp',
  },
  {
    type: 'ContentAsset',
  },
  {
    type: 'CorsWhitelistOrigin',
  },
  {
    type: 'CspTrustedSite',
  },
  {
    type: 'CustomApplication',
  },
  {
    type: 'CustomApplicationComponent',
  },
  {
    type: 'CustomFeedFilter',
  },
  {
    type: 'CustomHelpMenuSection',
  },
  {
    type: 'CustomLabels',
  },
  {
    type: 'CustomMetadata',
  },
  {
    type: 'CustomNotificationType',
  },
  {
    type: 'CustomObject',
  },
  {
    type: 'CustomObjectTranslation',
  },
  {
    type: 'CustomPageWebLink',
  },
  {
    type: 'CustomPermission',
  },
  {
    type: 'CustomSite',
  },
  {
    type: 'CustomTab',
  },
  {
    type: 'DataCategoryGroup',
  },
  {
    type: 'DelegateGroup',
  },
  {
    type: 'DuplicateRule',
  },
  {
    type: 'EclairGeoData',
  },
  {
    type: 'EmailServicesFunction',
  },
  {
    type: 'EntitlementProcess',
  },
  {
    type: 'EntitlementTemplate',
  },
  {
    type: 'EscalationRules',
  },
  {
    type: 'FlexiPage',
  },
  {
    type: 'Flow',
  },
  {
    type: 'FlowCategory',
  },
  {
    type: 'GlobalValueSet',
  },
  {
    type: 'GlobalValueSetTranslation',
  },
  {
    type: 'Group',
  },
  {
    type: 'HomePageComponent',
  },
  {
    type: 'HomePageLayout',
  },
  {
    type: 'IframeWhiteListUrlSettings',
  },
  {
    type: 'InstalledPackage',
  },
  {
    type: 'KeywordList',
  },
  {
    type: 'Layout',
  },
  {
    type: 'Letterhead',
  },
  {
    type: 'LightningBolt',
  },
  {
    type: 'LightningComponentBundle',
  },
  {
    type: 'LightningExperienceTheme',
  },
  {
    type: 'LightningMessageChannel',
  },
  {
    type: 'MatchingRules',
  },
  {
    type: 'MilestoneType',
  },
  {
    type: 'ModerationRule',
  },
  {
    type: 'NamedCredential',
  },
  {
    type: 'NavigationMenu',
  },
  {
    type: 'Network',
  },
  {
    type: 'NetworkBranding',
  },
  {
    type: 'NotificationTypeConfig',
  },
  {
    type: 'OauthCustomScope',
  },
  {
    type: 'PathAssistant',
  },
  {
    type: 'PermissionSet',
  },
  {
    type: 'PermissionSetGroup',
  },
  {
    type: 'PlatformCachePartition',
  },
  {
    type: 'PlatformEventChannel',
  },
  {
    type: 'PlatformEventChannelMember',
  },
  {
    type: 'PostTemplate',
  },
  {
    type: 'PresenceDeclineReason',
  },
  {
    type: 'PresenceUserConfig',
  },
  {
    type: 'Profile',
  },
  {
    type: 'ProfilePasswordPolicy',
  },
  {
    type: 'ProfileSessionSetting',
  },
  {
    type: 'Prompt',
  },
  {
    type: 'Queue',
  },
  {
    type: 'QueueRoutingConfig',
  },
  {
    type: 'QuickAction',
  },
  {
    type: 'RecommendationStrategy',
  },
  {
    type: 'RecordActionDeployment',
  },
  {
    type: 'RedirectWhitelistUrl',
  },
  {
    type: 'RemoteSiteSetting',
  },
  {
    type: 'ReportType',
  },
  {
    type: 'Role',
  },
  {
    type: 'SamlSsoConfig',
  },
  {
    type: 'Scontrol',
  },
  {
    type: 'ServiceChannel',
  },
  {
    type: 'ServicePresenceStatus',
  },
  {
    type: 'Settings',
  },
  {
    type: 'SharingRules',
  },
  {
    type: 'SharingSet',
  },
  {
    type: 'SiteDotCom',
  },
  {
    type: 'Skill',
  },
  {
    type: 'StandardValueSetTranslation',
  },
  {
    type: 'StaticResource',
  },
  {
    type: 'SynonymDictionary',
  },
  {
    type: 'TopicsForObjects',
  },
  {
    type: 'TransactionSecurityPolicy',
  },
  {
    type: 'Translations',
  },
  {
    type: 'UserCriteria',
  },
  {
    type: 'Workflow',
  }
];

