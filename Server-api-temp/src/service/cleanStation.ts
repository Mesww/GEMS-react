import Station from '../models/station_model';

export async function cleanStationWaitingLists() {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const result = await Station.updateMany(
            { "waiting.addedAt": { $lt: fiveMinutesAgo } },
            { $pull: { waiting: { addedAt: { $lt: fiveMinutesAgo } } } }
        );

        console.log(`Cleaned waiting lists. Modified ${result.modifiedCount} stations.`);
        return { status: "Success", message: `Cleaned waiting lists. Modified ${result.modifiedCount} stations.` };
    } catch (error) {
        console.error('Error cleaning station waiting lists:', error);
        return { status: "Error", message: "Error cleaning station waiting lists." };
    }
}
