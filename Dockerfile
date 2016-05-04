FROM node

MAINTAINER Dylan Frankland <dylan@frankland.io>

# Set short code for ZeroCater
ENV ZEROCATER_SHORTCODE XXXX

# Set token from Slack
ENV SLACK_TOKEN XXXXXXXXXXXXXXXXXXXXXXXX

# Set port to listen on
ENV PORT 3000

# Make directory for app
RUN mkdir -p /usr/src/app

# Install all dependencies
COPY package.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm install

# Copy app source
COPY . /usr/src/app

# Expose port (expose different port if you change the PORT env)
EXPOSE 3000

# Command to start app
CMD ["npm", "start"]
