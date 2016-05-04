# zerocater-slack
Simple personal foray into slack slash commands using my newly created ZeroCater client.

### Getting Started
1. Clone into the repo
  ```bash
  git clone http://github.com/dfrankland/zerocater-slack.git
  cd ./zerocater-slack
  ```

2. Install dependencies
  ```bash
  npm install
  ```

3. Start node server (`process.env.PORT` is optional, default is 3000)
  ```bash
  ZEROCATER_SHORTCODE=XXXX SLACK_TOKEN=ABCDEFGHIJKLMNOP npm start
  ```

### Docker
1. Change the `Dockerfile` and add both the `ZEROCATER_SHORTCODE` & `SLACK_TOKEN` (replace the `XXX`s)
  ```Dockerfile
  # Set short code for ZeroCater
  ENV ZEROCATER_SHORTCODE XXXX

  # Set token from Slack
  ENV SLACK_TOKEN XXXXXXXXXXXXXXXXXXXXXXXX
  ```

2. Build your docker image `docker build -t zerocater-slack .`
3. Run the container in the background on port 3000 `docker run -d -p 3000:3000 zerocater-slack`
