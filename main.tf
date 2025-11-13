# Configure the Azure provider
provider "azurerm" {
  features {}
  subscription_id = "fb228b96-e64b-4521-9452-1d368153b434"
}

# Define a resource group
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

# Define the Azure Static Web App
resource "azurerm_static_web_app" "static_app" {
  name                = var.static_webapp_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  # You will need to manually link your GitHub repository in the Azure Portal
  # after the static site is created by Terraform.
  # Terraform does not directly manage the GitHub Action workflow for Static Web Apps.
  # The `az staticwebapp create` command does this automatically, but Terraform
  # focuses on the Azure resource itself.
}
