const connection = require('../config/db.config');
const request = require('request');
const util = require('util');
const get = util.promisify(request.get);
const post = util.promisify(request.post);
const consumer_key = 'GzJDGrcFoqUSwHff6fxCP1QC9'; // Twitter Consumer Key
const consumer_secret = 'acJWk9jWTlh4uH1hpRuC6BhyCPitTWXzJWB6jZoFIH4KKLOi2I'; // Twitter Consumer Secret
const bearerTokenURL = new URL('https://api.twitter.com/oauth2/token');
const searchURL = new URL('https://api.twitter.com/1.1/search/tweets.json');

// Generate twitter bearer token 
async function bearerToken(auth) {
    const requestConfig = {
        url: bearerTokenURL,
        auth: {
            user: consumer_key,
            pass: consumer_secret,
        },
        form: {
            grant_type: 'client_credentials',
        },
    };
    const response = await post(requestConfig);
    return JSON.parse(response.body).access_token;
}

// Get tweets from Twitter
(async () => {
    let token;
    const query = 'from:CNNEE';
    const maxResults = 1;

    try {
        // Exchange credentials for a Bearer token
        token = await bearerToken({ consumer_key, consumer_secret });
    } catch (e) {
        console.error(`Could not generate a Bearer token. Please check that your credentials are correct and that the Filtered Stream preview is enabled in your Labs dashboard. (${e})`);
        process.exit(-1);
    }

    const requestConfig = {
        url: searchURL,
        qs: {
            q: query,
            max_results: maxResults
        },
        auth: {
            bearer: token,
        },
        headers: {
            'User-Agent': 'LabsRecentSearchQuickStartJS',
        },
        json: true,
    };

    try {
        const res = await get(requestConfig);
        const result = res.body.statuses;

        // delete table if exists
        connection.query(`DROP TABLE IF EXISTS tweet`, function (err, results, fields) {
            if (err) {
                console.log(err.message);
            }
        });
        // create tweet table
        connection.query(`CREATE TABLE tweet(id int NOT NULL AUTO_INCREMENT,created_at VARCHAR(30),twitter_text VARCHAR(200),user_screen_name VARCHAR(50),user_profile_image_url VARCHAR(250),user_name VARCHAR(250),PRIMARY KEY (id))`, function (err, results, fields) {
            if (err) {
                console.log(err.message);
            }
        });

        result.forEach(element => {

            // Create tweet object
            var tweet = {
                created_at: element.created_at,
                twitter_text: element.text,
                user_screen_name: element.user.screen_name,
                user_profile_image_url: element.user.profile_image_url,
                user_name: element.user.name
            };

            // Insert tweet in database
            connection.query(`INSERT INTO tweet SET ?`, tweet, (error, result) => {
                if (error) throw error;
            });

        });
        if (res.statusCode !== 200) {
            throw new Error(res.json);
            return;
        }
    } catch (e) {
        console.error(`Could not get search results. An error occurred: ${e}`);
        process.exit(-1);
    }
})();


// Get tweet endpoint
const router = app => {
    app.get('/tweets', (request, response) => {
        // return tweets from database
        connection.query('SELECT * FROM tweet', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });
}

module.exports = router;

