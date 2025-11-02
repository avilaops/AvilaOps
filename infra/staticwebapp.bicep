@description('Nome do Static Web App')
param name string = 'avilaops-com'
@description('Resource Group location (deployment scope must match)')
param location string = resourceGroup().location
@description('SKU: Free, Standard')
param sku string = 'Standard'
@description('Repo GitHub URL')
param repoUrl string
@description('Branch para build')
param branch string = 'main'

resource staticSite 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  sku: {
    name: sku
    tier: sku
  }
  properties: {
    repositoryUrl: repoUrl
    branch: branch
    buildProperties: {
      appLocation: '.'
      outputLocation: '.next'
      appBuildCommand: 'npm run build'
    }
  }
}

output staticSiteDefaultHostname string = staticSite.properties.defaultHostname
