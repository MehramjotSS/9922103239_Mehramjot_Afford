const { getUsers, getUserPosts } = require('./apiClient');

async function fetchTopUsers() {
    const usersData = await getUsers();
    const userStats = [];

    for (let [userId, userName] of Object.entries(usersData)) {
        let postsForUser = await getUserPosts(userId);
        let count = Array.isArray(postsForUser) ? postsForUser.length : 0;

        userStats.push({
            id: userId,
            name: userName,
            postCount: count
        });
    }

    const sorted = userStats.sort((u1, u2) => {
        return u2.postCount - u1.postCount;
    });

    const topUsers = sorted.slice(0, 5);

    return topUsers;
}

module.exports = {
    fetchTopUsers
};
