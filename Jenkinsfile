pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPO = '542202863403.dkr.ecr.us-east-1.amazonaws.com/demo-project'
        IMAGE_TAG = "${BUILD_NUMBER}"
        SWARM_MANAGER = '54.83.114.40'
    }

    stages {

        stage('Build Image') {
            steps {
                sh '''
                    docker build -t ${ECR_REPO}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Push Image to ECR') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecr',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} |
                        docker login --username AWS --password-stdin ${ECR_REPO}

                        docker push ${ECR_REPO}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy to Docker Swarm') {
            steps {
                sshagent(['swarm-manager-ssh']) {
                    sh '''
                        echo "Copying Docker Stack file to Swarm Manager..."

                        scp -o StrictHostKeyChecking=no \
                            docker-stack.yml \
                            ubuntu@${SWARM_MANAGER}:/home/ubuntu/docker-stack.yml

                        echo "Deploying to Docker Swarm..."

                        ssh -o StrictHostKeyChecking=no ubuntu@${SWARM_MANAGER} "
                            export IMAGE_TAG=${IMAGE_TAG}

                            echo 'Logging in to ECR on Swarm Manager...'

                            aws ecr get-login-password --region ${AWS_REGION} |
                            docker login --username AWS --password-stdin ${ECR_REPO}

                            echo 'Deploying stack...'

                            docker stack deploy \
                                --with-registry-auth \
                                -c /home/ubuntu/docker-stack.yml \
                                demo

                            echo 'Checking services...'

                            docker service ls
                        "
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
