---
title: "Cloud"
description: "How on-demand computing works, including service models, regions, shared responsibility, infrastructure as code, and cost control."
category: "Infrastructure"
slug: "cloud"
status: "published"
---

## 1. Definition

Cloud computing is on-demand access to shared computing resources, such as [servers](/encyclopedia/server/), storage, [databases](/encyclopedia/database/), and networks, delivered over a network and generally billed by use.

NIST Special Publication 800-145 identifies five essential characteristics:

| Characteristic | Meaning |
|---|---|
| On-demand self-service | Provision resources with no human involvement from the provider |
| Broad network access | Available through standard network mechanisms |
| Resource pooling | Physical resources are shared among many customers |
| Rapid elasticity | Capacity can grow and shrink quickly |
| Measured service | Usage is metered and reported |

## 2. Purpose and background

Running your own hardware means buying for peak demand, then waiting for delivery, then maintaining the equipment. Cloud computing replaces much of that capital expense with operating expense and reduces provisioning from weeks to minutes.

Virtualization made it feasible to divide physical machines safely. Amazon Web Services launched S3 and EC2 in 2006, and Microsoft Azure and Google Cloud followed.

## 3. How it works

A provider operates data centers filled with commodity machines. A **control plane** handles API requests: authenticating the caller, placing workloads, and configuring networks. A **data plane** carries the actual workloads and traffic.

**Virtualization** divides a physical host between guests with a hypervisor. **Containers** further divide workloads at the [operating system](/encyclopedia/os/) level.

### 3.1 Service models

| Model | You manage | Provider manages | Examples |
|---|---|---|---|
| IaaS | OS, runtime, application, data | Hardware, virtualization | EC2, Compute Engine |
| PaaS | Application and data | OS and runtime as well | Heroku, Cloud Run |
| FaaS / Serverless | Functions and data | Servers and scaling | Lambda, Cloudflare Workers |
| SaaS | Your usage and data | Everything else | Gmail, Salesforce |

### 3.2 Deployment models

| Model | Description |
|---|---|
| Public | Shared provider infrastructure |
| Private | Dedicated to one organization |
| Hybrid | Connected public and private environments |
| Community | Shared by organizations with common concerns |

## 4. Internal structure

### 4.1 Regions and availability zones

A **region** is a geographic area. Providers generally divide it into **availability zones**: isolated groups of data centers with independent power and networking.

- Spread across multiple zones to survive the failure of one data center.
- Spread across multiple regions to survive a regional failure, or to serve users worldwide.

Latency, data residency law, and price all influence region selection.

### 4.2 Common building blocks

| Need | Service category | AWS example |
|---|---|---|
| Compute | Virtual machines, containers, functions | EC2, ECS, Lambda |
| Object storage | Files accessed by key | S3 |
| Block storage | Virtual disks | EBS |
| Managed database | Relational or NoSQL | RDS, DynamoDB |
| Network | Private networks and load balancing | VPC, ALB |
| Identity | Users, roles, and policies | IAM |
| Observability | Logs, metrics, and alerts | CloudWatch |

### 4.3 Shared responsibility

Security is divided between the provider and the customer. The provider secures the underlying facility and platform. The customer remains responsible for configuration, identities, and data.

A storage bucket left open to the public is a customer-side failure, despite running on perfectly secure infrastructure.

## 5. Practical usage

### 5.1 Infrastructure as code

Defining resources in version-controlled files makes environments reviewable and reproducible. A small Terraform example:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2" # Seoul
}

resource "aws_s3_bucket" "assets" {
  bucket = "expansion-example-assets"
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket                  = aws_s3_bucket.assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

```bash
terraform init
terraform plan    # shows what would change
terraform apply   # applies the reviewed change
```

### 5.2 Designing for failure

In the cloud, individual machines are expected to fail.

- Keep application servers stateless and place them behind a load balancer.
- Use health checks and automatic replacement.
- Store state in replicated managed services.
- Package applications as [Docker](/encyclopedia/docker/) images.
- Test your backups and restoration.

### 5.3 Cost control

- Set budget alerts before deploying anything.
- Tag resources by project and owner.
- Delete idle resources, including unattached disks and old snapshots.
- Right-size according to measured usage.
- Watch data egress, which is often overlooked and expensive.

## 6. Relationships with other concepts

- The cloud rents out [server](/encyclopedia/server/) capacity.
- [Linux](/encyclopedia/linux/) is the most common guest operating system.
- [Docker](/encyclopedia/docker/) images are a common unit of cloud deployment.
- A managed [database](/encyclopedia/database/) moves routine operations to the provider.
- Provider services are controlled entirely through an [API](/encyclopedia/api/).

## 7. Advantages and limitations

**Advantages**

- Little or no up-front hardware cost.
- Scales with demand.
- Managed services reduce operational work.
- Global infrastructure is accessible to small teams.

**Limitations**

- Costs can become unpredictable, and for steady high loads can exceed owning hardware.
- Provider-specific services create lock-in.
- A provider outage is out of your control.
- Multi-tenant platforms can have variable performance.
- Regulations may restrict where data can be stored.

## 8. Common errors and troubleshooting

| Symptom | Likely cause | Solution |
|---|---|---|
| Connection times out to a new instance | Security group or firewall | Check inbound rules and routes |
| `AccessDenied` | IAM policy lacks the permission | Read the denied action, grant the minimum |
| Unexpectedly large bill | Forgotten resources or egress | Cost explorer; budget alerts |
| Slow first request on serverless | Cold start | Reduce package size; provision capacity if needed |
| Deployment works in staging only | Configuration differs between environments | Define both from the same code |
| Secret keys were committed to Git | Credentials are exposed | Revoke immediately, then rotate |
| `SlowDown` or throttling errors | API rate limit | Retry with exponential backoff |

Avoid long-lived access keys when possible. Assign roles to workloads, enable MFA on administrator accounts, and do not use the root account for daily tasks.

## 9. Learning path

1. Understand [Server](/encyclopedia/server/) and [Linux](/encyclopedia/linux/) basics.
2. Package an application with [Docker](/encyclopedia/docker/).
3. Deploy it to a PaaS, then build the same thing on IaaS.
4. Learn networks, identity, and cost controls.
5. Define everything with infrastructure as code.

## 10. References

- [NIST SP 800-145: The NIST Definition of Cloud Computing](https://csrc.nist.gov/pubs/sp/800/145/final)
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
- [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
- [Terraform documentation](https://developer.hashicorp.com/terraform/docs)
