variable "resource_group_name" {
  description = "The name of the resource group for the static web app."
  type        = string
  default     = "my-azure-website-tf-rg" # A new name to avoid conflict with previous RG
}

variable "static_webapp_name" {
  description = "The name of the Azure Static Web App."
  type        = string
  default     = "my-azure-website-tf" # A new name to avoid conflict
}

variable "location" {
  description = "The Azure region where the resources will be deployed."
  type        = string
  default     = "westus2"
}
