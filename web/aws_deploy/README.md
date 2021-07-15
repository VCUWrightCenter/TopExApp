# AWS Deployment Instructions
1) Make sure "topex" profile exists in *~/.aws/config* and *~/.aws/credentials*
2) The region corresponding to the "topex" profile in *~/.aws/config* should be "region=us-east-1"
3) Ask Evan for aws_access_key_id and aws_secret_access_key for *~/.aws/credentials*
4) Log in to aws.vcu.edu
5) Search for "ECR" and navigate to the Elastic Container Registry
6) Select the radio button for the desired container and click the "View push commands" button
7) Follow commands (in the corresponding subdirectory api|web) in the modal window to push an updated container image to the registry
8) Install Elastic Beanstalk cli 
    *~/> pip install awsebcli*
9) Deploy to elastic beanstalk
    *~/> cd aws_deploy*
    *~/aws_deploy> eb init*
    *~/aws_deploy> eb deploy*