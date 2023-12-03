// Ruby Utils

class RubyUtils {
  ipCache = {};
  embedProperties = {};

  getInfo() {
    return {
      id: 'rubyutils',
      name: 'Ruby Utils',
      color1: "#b32ffa",
      color2: "#b32ffa",
      color3: "#b32ffa",
      blocks: [
        {
          opcode: 'wait',
          text: 'wait [TIME] seconds',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            TIME: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            }
          }
        },
        {
          opcode: 'fetch',
          text: 'fetch [URL]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://extensions.turbowarp.org/hello.txt'
            }
          }
        },
        {
          opcode: 'getFromGoogleImages',
          text: 'Get [SEARCH] from Google Images',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            SEARCH: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'cats'
            }
          }
        },
        {
          opcode: 'generateFakeIP',
          text: 'generate fake IP with name [NAME]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'user'
            }
          }
        },
        // Updated block for sending a basic webhook request
        {
          opcode: 'sendWebhook',
          text: 'send webhook with name [NAME] image url [IMAGEURL] message [MESSAGE] to webhook [WEBHOOK]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'user'
            },
            IMAGEURL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com/image.jpg'
            },
            MESSAGE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Hello, world!'
            },
            WEBHOOK: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://your.webhook.url'
            }
          }
        },
        // New blocks for setting a hex color and name
        {
          opcode: 'setHexColor',
          text: 'set hex color to [COLOR]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            COLOR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '#000000'
            }
          }
        },
        {
          opcode: 'setName',
          text: 'set name to [NAME]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Ruby Utils'
            }
          }
        },
        // New blocks for sending a webhook with embeds with optional inputs
        {
          opcode: 'setTitle',
          text: 'set embed title to [TITLE]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            TITLE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Title'
            }
          }
        },
        {
          opcode: 'setDescription',
          text: 'set embed description to [DESCRIPTION]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            DESCRIPTION: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Description'
            }
          }
        },
        {
          opcode: 'setFooter',
          text: 'set embed footer to [FOOTER]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            FOOTER: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Footer'
            }
          }
        },
        {
          opcode: 'sendWebhookWithEmbed',
          text: 'send webhook with embeds to webhook [WEBHOOK]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            WEBHOOK: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://your.webhook.url'
            }
          }
        }
      ]
    };
  }

  // Existing functions...

  wait(args) {
    return new Promise((resolve, reject) => {
      const timeInMilliseconds = args.TIME * 1000;
      setTimeout(() => {
        resolve();
      }, timeInMilliseconds);
    });
  }

  fetch(args) {
    return fetch(args.URL)
      .then((response) => {
        return response.text();
      })
      .catch((error) => {
        console.error(error);
        return 'Uh oh! Something went wrong.';
      });
  }

  getFromGoogleImages(args) {
    const searchQuery = args.SEARCH; // Search argument provided in the block
    const apiUrl = `https://corsproxy.io/?https://mubilop-api.vercel.app/api/getImageLink?query=${searchQuery}`;
    
    return fetch(apiUrl)
      .then((response) => {
        return response.text();
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        return 'Error fetching data.';
      });
  }

  generateFakeIP(args) {
    const name = args.NAME.toLowerCase().replace(/\s/g, ''); // Convert name to lowercase and remove spaces

    // Check if the fake IP for this name is already cached
    if (this.ipCache[name]) {
      return this.ipCache[name];
    }

    // Generate random numbers for each octet
    const firstOctet = Math.floor(Math.random() * 256);
    const secondOctet = Math.floor(Math.random() * 256);
    const thirdOctet = Math.floor(Math.random() * 256);
    const fourthOctet = name.charCodeAt(0) % 256;

    // Construct the fake IP
    const fakeIP = `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;

    // Cache the fake IP for future use
    this.ipCache[name] = fakeIP;

    return fakeIP;
  }

  // New functions for setting individual embed properties
  setTitle(args) {
    this.embedProperties.title = args.TITLE;
  }

  setDescription(args) {
    this.embedProperties.description = args.DESCRIPTION;
  }

  setFooter(args) {
    this.embedProperties.footer = args.FOOTER;
  }

  setHexColor(args) {
    this.embedProperties.hexColor = args.COLOR;
  }

  setName(args) {
    this.embedProperties.name = args.NAME;
  }

  sendWebhook(args) {
    const name = args.NAME;
    const imageUrl = args.IMAGEURL;
    const message = args.MESSAGE;
    const webhookUrl = args.WEBHOOK;

    const payload = {
      username: name,
      avatar_url: imageUrl,
      content: message
    };

    return fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        console.error('Webhook request failed:', response.statusText);
        return 'Webhook request failed';
      }
      return 'Webhook sent successfully';
    })
    .catch(error => {
      console.error('Error sending webhook:', error);
      return 'Error sending webhook';
    });
  }

  sendWebhookWithEmbed(args) {
    const embed = {};
    const name = {};

    if (this.embedProperties.title) {
      embed.title = this.embedProperties.title;
    }

    if (this.embedProperties.description) {
      embed.description = this.embedProperties.description;
    }

    if (this.embedProperties.footer) {
      embed.footer = { text: this.embedProperties.footer };
    }

    if (this.embedProperties.name) {
      name.name = this.embedProperties.name;
    }

    const webhookUrl = args.WEBHOOK;
    const payload = {
      embeds: [embed],
      username: name.name,
    };

    return fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        console.error('Webhook request with embeds failed:', response.statusText);
        return 'Webhook request with embeds failed';
      }
      return 'Webhook with embeds sent successfully';
    })
    .catch(error => {
      console.error('Error sending webhook with embeds:', error);
      return 'Error sending webhook with embeds';
    });
  }
}

Scratch.extensions.register(new RubyUtils());
