export type CompanyAppId = 'business-cocoon' | '4theblueprint'

export type CompanyAppConfig = {
  id: CompanyAppId
  url: string
  domain: string
  nameKey: 'businessCocoonApp' | 'blueprintApp'
  descKey: 'businessCocoonAppDesc' | 'blueprintAppDesc'
}

export const companyApps: CompanyAppConfig[] = [
  {
    id: 'business-cocoon',
    url: 'https://www.businesscocoon.com',
    domain: 'businesscocoon.com',
    nameKey: 'businessCocoonApp',
    descKey: 'businessCocoonAppDesc',
  },
  {
    id: '4theblueprint',
    url: 'https://www.4theblueprint.com',
    domain: '4theblueprint.com',
    nameKey: 'blueprintApp',
    descKey: 'blueprintAppDesc',
  },
]
