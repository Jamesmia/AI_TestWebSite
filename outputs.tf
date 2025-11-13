output "static_webapp_default_hostname" {
  description = "The default hostname of the Azure Static Web App."
  value       = azurerm_static_web_app.static_app.default_host_name
}

output "resource_group_name" {
  description = "The name of the resource group created."
  value       = azurerm_resource_group.rg.name
}
