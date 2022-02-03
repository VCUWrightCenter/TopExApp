# AWS Deployment Instructions
1) Install AWS CLI (https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
2) Make sure "topex" profile exists in *~/.aws/config* and *~/.aws/credentials*
3) The region corresponding to the "topex" profile in *~/.aws/config* should be "region=us-east-1"
4) Ask Evan for aws_access_key_id and aws_secret_access_key for *~/.aws/credentials*
5) Log in to aws.vcu.edu
6) Search for "ECR" and navigate to the Elastic Container Registry
7) Select the radio button for the desired container and click the "View push commands" button
8) Follow commands (in the corresponding subdirectory api|web) in the modal window to push an updated container image to the registry
9) Install Elastic Beanstalk cli 
    *~/> pip install awsebcli*
10) Deploy to elastic beanstalk
    *~/> cd aws_deploy*
    *~/aws_deploy> eb init*
    *~/aws_deploy> eb deploy*
