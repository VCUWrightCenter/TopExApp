# AWS Deployment Instructions
1) Log in to aws.vcu.edu
2) Search for "ECR" and navigate to the Elastic Container Registry
3) Select the radio button for the desired container and click the "View push commands" button
4) Follow commands (in the corresponding subdirectory api|web) in the modal window to push an updated container image to the registry
5) Install Elastic Beanstalk cli 
    *~/> pip install awsebcli*
6) Deploy to elastic beanstalk
    *~/> cd aws_deploy*
    *~/> eb init*
    *~/> eb deploy*