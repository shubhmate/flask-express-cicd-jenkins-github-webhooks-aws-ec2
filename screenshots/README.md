# Screenshots

Place your screenshots in the correct subfolder with the exact filenames listed below.
They are referenced in the main README.md automatically once added.

## part1/
| Filename                  | What to capture                                      |
|---------------------------|------------------------------------------------------|
| 01-ec2-running.png        | EC2 instance with Instance State: Running            |
| 02-security-group.png     | Security group inbound rules (ports 22,3000,5000,8080)|
| 03-ssh-connected.png      | SSH terminal showing ubuntu@ip-...                   |
| 04-pm2-list.png           | pm2 list showing both apps online                    |
| 05-flask-browser.png      | Flask response at http://<EC2_PUBLIC_IP>:5000/       |
| 06-express-form.png       | Express form at http://<EC2_PUBLIC_IP>:3000/         |
| 07-form-submitted.png     | Form submitted with Flask response shown             |

## part2/
| Filename                        | What to capture                                  |
|---------------------------------|--------------------------------------------------|
| 08-jenkins-dashboard.png        | Jenkins dashboard with both pipeline jobs        |
| 09-flask-pipeline-green.png     | flask-backend pipeline all 4 stages green        |
| 10-express-pipeline-green.png   | express-frontend pipeline all 4 stages green     |
| 11-console-output.png           | Console Output showing Finished: SUCCESS         |
| 12-github-webhook.png           | GitHub webhook green tick (delivery successful)  |
| 13-auto-triggered-build.png     | Auto build triggered after git push              |
