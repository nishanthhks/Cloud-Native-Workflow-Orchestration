# ----------------------------
# VPC Outputs
# ----------------------------
output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.eks-vpc.vpc_id
}

output "public_subnets" {
  description = "List of public subnet IDs"
  value       = module.eks-vpc.public_subnets
}

output "private_subnets" {
  description = "List of private subnet IDs"
  value       = module.eks-vpc.private_subnets
}

output "nat_gateway_ids" {
  description = "List of NAT Gateway IDs"
  value       = module.eks-vpc.natgw_ids
}

output "igw_id" {
  description = "Internet Gateway ID"
  value       = module.eks-vpc.igw_id
}

# ----------------------------
# EKS Cluster Outputs
# ----------------------------
output "eks_cluster_endpoint" {
  description = "Endpoint for the EKS Kubernetes API server"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_security_group_id" {
  description = "Security group ID attached to the EKS control plane"
  value       = module.eks.cluster_security_group_id
}

output "eks_node_security_group_id" {
  description = "Security group ID attached to EKS managed nodes"
  value       = module.eks.node_security_group_id
}


