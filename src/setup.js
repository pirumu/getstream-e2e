const dotenv = require("dotenv");
const getstream = require("getstream");
dotenv.config();

const client = getstream.connect(
    process.env.API_KEY,
    process.env.API_SECRET,
    process.env.APP_ID,
    {
        location: process.env.LOCATION,
        timeout: 15000,
        browser: false
    }
);

async function addActivities(feedSlug, userId) {

    const timeline = client.feed(feedSlug, userId)

    const time = new Date().getTime()
    // add 1k activity
    for (let n = 0; n < 10; n++) {

        const activities = [];

        for (let i = 0; i < 100; i++) {

            const _time = new Date(time + n * 100 + i).toISOString();

            activities.push({
                'actor': '1',
                'verb': 'tweet',
                'object': 'Tweet:1',
                'data': n * 100 + i,
                'foreign_id': 'c797482e-13f9-4d17-b699-f041942119a7',
                'time': _time
                });

        }
        await timeline.addActivities(activities);
    }
}

async function removeActivities(feedSlug, userId) {
    const timeline = client.feed(feedSlug,userId);
    await timeline.removeActivity({ foreign_id: 'src:777' })

}

async function getTotalActivity(feedSlug, userId, activityId = '', total = 0) {

    const newsfeed = client.feed(feedSlug, userId);

    try {
        const limit = 100;
        const offset = 0;
        let activities;

        if(activityId) {
            activities =  await newsfeed.get({  id_lt: activityId });
        } else {
            activities =  await newsfeed.get({  offset });

        }

        activityId = activities.results[activities.results.length -1]?.id;

        total+=activities.results.length;

        if(activities.next) {
            return  getTotalActivity(feedSlug, userId,activityId,total)
        }

        return total;
    } catch (error) {
        throw error
    }


}

module.exports = {
    addActivities,
    getTotalActivity,
    removeActivities
};