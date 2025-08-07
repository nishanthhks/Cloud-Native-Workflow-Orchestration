variable "cidr_block" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "tags" {
  description = "A map of tags to assign to the VPC"
  type        = map(string)
  default     = {
    terraform = "true"
    kubernetes = "devops-project-eks-cluster"
  } 
}

variable "vpc_name" {
  description = "The name of the VPC"
  type        = string
  default     = "devops-project-eks-vpc"

}

variable "eks_version" {
  description = "The version of EKS to use"
  type        = string
  default     = "1.31"
}

variable "cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
  default     = "devops-project-eks-cluster"
}

variable "region" {
  description = "The AWS region to deploy the EKS cluster in"
  type        = string
  default     = "us-east-1"
}