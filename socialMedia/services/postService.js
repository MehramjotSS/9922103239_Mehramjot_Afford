const { getUsers, getUserPosts, getPostComments } = require('./apiClient');

async function fetchAllPosts() {
    const usersList = await getUsers();
    let combinedPosts = [];

    for (let uid of Object.keys(usersList)) {
        const userPosts = await getUserPosts(uid);
        if (userPosts && userPosts.length > 0) {
            combinedPosts = combinedPosts.concat(userPosts);
        }
    }

    return combinedPosts;
}

async function getPostsByType(type) {
    const allPosts = await fetchAllPosts();

    if (type === 'latest') {
        return allPosts.sort((a, b) => b.id - a.id).slice(0, 5);
    }

    if (type === 'popular') {
        let enrichedPosts = [];

        for (let post of allPosts) {
            const comments = await getPostComments(post.id);
            enrichedPosts.push({
                ...post,
                commentCount: comments ? comments.length : 0
            });
        }

        let highest = Math.max(...enrichedPosts.map(p => p.commentCount));
        return enrichedPosts.filter(p => p.commentCount === highest);
    }

    return [];
}

module.exports = {
    getPostsByType
};
