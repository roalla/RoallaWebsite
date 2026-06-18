export type CompanyAppId = 'business-cocoon' | '4theblueprint' | 'boothlio' | 'pitch-hotshots'

export type CompanyAppConfig = {
  id: CompanyAppId
  url: string
  domain: string
  nameKey: 'businessCocoonApp' | 'blueprintApp' | 'boothlioApp' | 'pitchHotshotsApp'
  descKey: 'businessCocoonAppDesc' | 'blueprintAppDesc' | 'boothlioAppDesc' | 'pitchHotshotsAppDesc'
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
  {
    id: 'boothlio',
    url: 'https://boothlio.com',
    domain: 'boothlio.com',
    nameKey: 'boothlioApp',
    descKey: 'boothlioAppDesc',
  },
  {
    id: 'pitch-hotshots',
    url: 'https://www.pitchhotshot.com/',
    domain: 'pitchhotshot.com',
    nameKey: 'pitchHotshotsApp',
    descKey: 'pitchHotshotsAppDesc',
  },
]
