@description('Nome do Resource Group (deployment scope)')
param location string = resourceGroup().location
@description('Prefixo para nomear recursos')
param prefix string = 'avilaops'
@description('Cosmos DB throughput inicial (RU/s)')
param cosmosThroughput int = 400
@description('Azure OpenAI SKU (ex: S0)')
param openAiSkuName string = 'S0'
@description('Tenant ID para Key Vault (GUID)')
param tenantId string

// Storage Account
resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: '${prefix}store'
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

// Key Vault
resource kv 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: '${prefix}kv'
  location: location
  properties: {
    enableSoftDelete: true
    enableRbacAuthorization: true
    tenantId: tenantId
    sku: { name: 'standard', family: 'A' }
    enablePurgeProtection: true
    publicNetworkAccess: 'Enabled'
  }
}

// Application Insights (classic component)
resource insights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${prefix}-appinsights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

// Cosmos DB Account
resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' = {
  name: '${prefix}-cosmos'
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      { locationName: location }
    ]
    enableFreeTier: true
    enableAutomaticFailover: false
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    publicNetworkAccess: 'Enabled'
  }
}

// Cosmos DB SQL Database
resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-05-15' = {
  parent: cosmos
  name: 'avilaops'
  properties: {
    resource: { id: 'avilaops' }
  }
}

// Cosmos DB Container (memory)
resource cosmosContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-05-15' = {
  parent: cosmosDb
  name: 'memory'
  properties: {
    resource: {
      id: 'memory'
      partitionKey: { paths: ['/userId'], kind: 'Hash' }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [ { path: '/*' } ]
        excludedPaths: [ { path: '/"_etag"/?' } ]
      }
    }
    options: { throughput: cosmosThroughput }
  }
}

// Azure OpenAI (Cognitive Services account) - placeholder; requires region that supports
resource openAi 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: '${prefix}-openai'
  location: location
  sku: { name: openAiSkuName }
  kind: 'OpenAI'
  properties: {
    publicNetworkAccess: 'Enabled'
  }
}

output storageName string = storage.name
output keyVaultName string = kv.name
output cosmosEndpoint string = cosmos.properties.documentEndpoint
output openAiName string = openAi.name
output insightsName string = insights.name
