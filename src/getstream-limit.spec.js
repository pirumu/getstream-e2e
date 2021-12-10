const {
    addActivities,
    getTotalActivity,
    removeActivities
} = require('./setup');


describe('Getstream Limit', function () {
    const userId = '1';
    const newsfeedSlug = 'newsfeed';
    const timelineSlug = 'timeline';
    const totalExpect = 501;

    jest.setTimeout(100000);

    beforeAll(async () => {
        await addActivities(timelineSlug, userId);
    })
    afterAll(async () => {
        await removeActivities(timelineSlug, userId);
    });

    describe('Newsfeed', function () {
        it('should resolve total activity in the newsfeed to be greater than total expect', async () => {

            const total = await getTotalActivity(newsfeedSlug, userId, null, 0);

            expect(total).toBeGreaterThan(totalExpect);

        });
    });

    describe('TimeLine', function () {
        it('should resolve total activity in the timeline to be greater than total expect', async () => {

            const total = await getTotalActivity(timelineSlug, userId, null, 0);

            expect(total).toBeGreaterThan(totalExpect);

        });
    });
})
