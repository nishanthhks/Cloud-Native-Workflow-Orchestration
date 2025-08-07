# -------------------------------------------------
# EKS Cluster Creation using Terraform EKS Module
# -------------------------------------------------
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0" 

  # ----------------------------
  # Basic Cluster Info
  # ----------------------------
  cluster_name    = var.cluster_name       # Name of the EKS cluster
  cluster_version = var.eks_version        # EKS Kubernetes version

  vpc_id = module.eks-vpc.vpc_id           # VPC where the cluster will be deployed

  # ----------------------------
  # IAM and Authentication
  # ----------------------------
  create_iam_role = true # Create IAM role for the EKS control plane to talk to other AWS services (default is true)
  authentication_mode = "API" # Use AWS API/IAM for authentication

  # EKS uses IAM for authentication. If you set authentication_mode = "API",
  # Terraform will automatically grant cluster access to the IAM user or role that created the cluster.
  # You can safely remove this line if your creator is an admin user who already has access via IAM credentials.
  # In companies, the user who ran Terraform gets access to the cluster via IAM.

  enable_cluster_creator_admin_permissions = true 
  # Gives admin (cluster-admin) permissions to the user who creates the cluster

  attach_cluster_encryption_policy = false
  # Skip attaching the default KMS encryption policy to the IAM role.
  # By default, Kubernetes Secrets are only base64-encoded, not encrypted.
  # Setting this to "true" enables envelope encryption using AWS KMS,
  # adding an extra layer of security for Secrets at rest.

  # ----------------------------
  # Access Configuration
  # ----------------------------
  # Allows resources inside your VPC to talk to the cluster's API.
  # Essential for worker nodes to function.
  cluster_endpoint_private_access = true
  # Allows access from outside your VPC (e.g., your laptop) to the cluster's API.
  # Needed to use 'kubectl' from your local machine.
  # "false" : for production, use VPN 
  cluster_endpoint_public_access = true

  # ----------------------------
  # Subnet Configuration
  # ----------------------------
  control_plane_subnet_ids = concat(module.eks-vpc.public_subnets, module.eks-vpc.private_subnets)
  # Place control plane across both public and private subnets (for HA)

  # ----------------------------
  # Security Groups
  # ----------------------------
  create_cluster_security_group = true
  cluster_security_group_description = "EKS cluster Security group"

  create_node_security_group = true
  node_security_group_description = "Used by nodes to communicate with the cluster"
  node_security_group_enable_recommended_rules = true # Add recommended security rules
  node_security_group_use_name_prefix = true          # Use prefix in SG name for uniqueness

  # ----------------------------
  # Add-ons (Self-managed bootstrap)
  # ----------------------------
  bootstrap_self_managed_addons = true # Automatically installs EKS add-ons like CNI, kube-proxy

  enable_security_groups_for_pods = true # Enable pod-level security groups (Advanced security feature)

  # ----------------------------
  # Managed Node Group
  # ----------------------------
  subnet_ids = module.eks-vpc.private_subnets # Worker nodes go in private subnets (best practice)

  eks_managed_node_groups = {
    group1 = {
      name           = "demo-eks-node-group"
      ami_type       = "AL2023_x86_64_STANDARD" # Amazon Linux 2023 AMI
      instance_type  = ["t3.medium"]            # Instance type used for worker nodes
      capacity_type  = "SPOT"                   # Use Spot Instances for cost savings

      min_size       = 1   # Minimum 1 node
      max_size       = 2   # Scale up to 2 nodes
      desired_size   = 1   # Start with 1 node
    }
  }

  # ----------------------------
  # Logging & Encryption Overrides
  # ----------------------------
  create_cloudwatch_log_group     = false # Don't create log group for EKS control plane logs
  create_kms_key                  = false # Don't create custom KMS key 
  enable_kms_key_rotation         = false # (no need if key isnt created)
  kms_key_enable_default_policy   = false # Don’t use AWS’s default key policy
  cluster_encryption_config       = {}     # No secret encryption enabled

  enable_irsa                     = false  # IRSA (IAM Roles for Service Accounts) is disabled
  enable_auto_mode_custom_tags    = false  # Don’t auto-tag custom resources

  # ----------------------------
  # Cluster Timing Config (terraform specific)
  # ----------------------------
  dataplane_wait_duration = "40s" # Wait time for node group creation before moving on
}
