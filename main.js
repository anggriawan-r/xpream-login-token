const axios = require('axios');
const fs = require('fs');
const path = require('path');
const qs = require('qs');

const DESTINATION_PATH = {
  jobcard:
    '../shell-angular/projects/jobcard-angular/src/app/core/interceptors/auth.interceptor.ts',
  mdr: '../shell-angular/projects/mdr-angular/src/app/core/interceptors/auth.interceptor.ts',
  mrm: '../shell-angular/projects/mrm-angular/src/app/core/interceptors/auth.interceptor.ts',
};

// === Configuration ===
const LOGIN_URL =
  'https://dev-auth.gmf-aeroasia.co.id/auth/realms/xpream-dev-hend/protocol/openid-connect/token';
const AUTH_FILE_PATH = path.join(__dirname, DESTINATION_PATH.jobcard);

const credentials = {
  username: 'ivo@gmail.com',
  password: '123',
  client_id: 'xpream-frontend',
  client_secret: '9pxbHb0LUVaz0Txi6dozr6FwBnjwnJmm',
  grant_type: 'password',
};

// === Fetch token and update file ===
async function fetchAndUpdateToken() {
  try {
    const response = await axios.post(LOGIN_URL, qs.stringify(credentials), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const token = response.data.access_token;
    if (!token) throw new Error('No token in response');

    console.log('Received Token:', token);

    // Read the file
    let fileContent = fs.readFileSync(AUTH_FILE_PATH, 'utf8');

    // Replace or insert token line
    const tokenPattern = /const\s+customToken\s*=\s*['"`].*?['"`];?/;
    const tokenLine = `const customToken = '${token}';`;

    if (tokenPattern.test(fileContent)) {
      fileContent = fileContent.replace(tokenPattern, tokenLine);
    } else {
      fileContent = tokenLine + '\n' + fileContent;
    }

    fs.writeFileSync(AUTH_FILE_PATH, fileContent, 'utf8');
    console.log('Token updated in auth.service.ts');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchAndUpdateToken();
