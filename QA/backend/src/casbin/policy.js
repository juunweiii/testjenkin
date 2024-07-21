"use strict"

// URL Builder
const base = "/api/";
const authV1 = "auth/v1/";
const subtopicsV1 = "subtopics/v1/";
const threadsV1 = "threads/v1/";
const topicsV1 = "topics/v1/";
const usersV1 = "users/v1/";

// A = admin
// U = user
// M = moderator
// * = all roles

// const baseRoutes = {
//     base: [base, "GET"],
//     authCheck: [base + "authCheck", "GET"],
// };

const authRoutes = {
    // login: ["*", base + authV1 + "login", "POST"],
    // loginOTP: ["*", base + authV1 + "loginOTP", "GET"],
    logout: ["*", base + authV1 + "logout", "POST"],
    // register: [base + authV1 + "register", "POST"],
    // registerOTP: [base + authV1 + "registerOTP", "GET"],
    // passwordReset: [base + authV1 + "passwordReset", "POST"],
    // passwordResetOTP: [base + authV1 + "passwordResetOTP", "POST"],
}

const subtopicsRoutes = {
    postSubTopics: ["UM", base + subtopicsV1 + "postSubTopics", "POST"],
    getAllSubTopics: ["*", base + subtopicsV1 + "getAllSubTopics", "GET"],
    updateSubTopics: ["UM", base + subtopicsV1 + "updateSubTopics", "PATCH"],
    deleteSubTopics: ["UM", base + subtopicsV1 + "deleteSubTopics", "DELETE"],
    getSubTopics: ["*", base + subtopicsV1 + "getSubTopics", "GET"],
    likeOrDislikeSubTopics: ["UM", base + subtopicsV1 + "likeOrDislikeSubTopics", "PATCH"],
};

const threadsRoutes = {
    postThreads: ["UM", base + threadsV1 + "postThreads", "POST"],
    getAllThreads: ["*", base + threadsV1 + "getAllThreads", "GET"],
    updateThreads: ["UM", base + threadsV1 + "updateThreads", "PATCH"],
    deleteThreads: ["UM", base + threadsV1 + "deleteThreads", "DELETE"],
    getThreads: ["*", base + threadsV1 + "getThreads", "GET"],
    likeOrDislikeThreads: ["UM", base + threadsV1 + "likeOrDislikeThreads", "PATCH"],
};

const topicsRoutes = {
    postTopics: ["M", base + topicsV1 + "postTopics", "POST"],
    getAllTopics: ["*", base + topicsV1 + "getAllTopics", "GET"],
    updateTopics: ["M", base + topicsV1 + "updateTopics", "PATCH"],
    deleteTopics: ["M", base + topicsV1 + "deleteTopics", "DELETE"],
    getTopics: ["*", base + topicsV1 + "getTopics", "GET"],
}

const usersRoutes = {
    banUsers: ["AM", base + usersV1 + "banUsers", "PATCH"],
    getAllUsers: ["AM", base + usersV1 + "getAllUsers", "GET"],
    updateUsers: ["*", base + usersV1 + "updateUsers", "PATCH"],
    updateUsersRole: ["A", base + usersV1 + "updateUsersRole", "PATCH"],
    getUsers: ["*", base + usersV1 + "getUsers", "GET"],
    getUsersRep: ["*", base + usersV1 + "getUsersRep", "GET"],
    selfUsersProfile: ["*", base + usersV1 + "selfUsersProfile", "GET"],
}

const user = ["user"];
const admin = ["admin"];
const moderator = ["moderator"];

let userPolicy = [];
let adminPolicy = [];
let moderatorPolicy = [];

async function getUserPolicy() {
    userPolicy = [];
    for (const route in authRoutes ) {
        const sub = authRoutes[route][0];
        const obj = authRoutes[route][1];
        const act = authRoutes[route][2];
        if ((sub === "*") || (sub.includes("U"))) {
            const policy = user.concat([obj, act]);
            userPolicy.push(policy);
        }
    }
    for (const route in subtopicsRoutes ) {
        const sub = subtopicsRoutes[route][0];
        const obj = subtopicsRoutes[route][1];
        const act = subtopicsRoutes[route][2];
        if ((sub === "*") || (sub.includes("U"))) {
            const policy = user.concat([obj, act]);
            userPolicy.push(policy);
        }
    }
    for (const route in threadsRoutes ) {
        const sub = threadsRoutes[route][0];
        const obj = threadsRoutes[route][1];
        const act = threadsRoutes[route][2];
        if ((sub === "*") || (sub.includes("U"))) {
            const policy = user.concat([obj, act]);
            userPolicy.push(policy);
        }
    }
    for (const route in topicsRoutes ) {
        const sub = topicsRoutes[route][0];
        const obj = topicsRoutes[route][1];
        const act = topicsRoutes[route][2];
        if ((sub === "*") || (sub.includes("U"))) {
            const policy = user.concat([obj, act]);
            userPolicy.push(policy);
        }
    }
    for (const route in usersRoutes ) {
        const sub = usersRoutes[route][0];
        const obj = usersRoutes[route][1];
        const act = usersRoutes[route][2];
        if ((sub === "*") || (sub.includes("U"))) {
            const policy = user.concat([obj, act]);
            userPolicy.push(policy);
        }
    }
    return userPolicy;
}

async function getAdminPolicy() {
    adminPolicy = [];
    for (const route in authRoutes ) {
        const sub = authRoutes[route][0];
        const obj = authRoutes[route][1];
        const act = authRoutes[route][2];
        if ((sub === "*") || (sub.includes("A"))) {
            const policy = admin.concat([obj, act]);
            adminPolicy.push(policy);
        }
    }
    for (const route in subtopicsRoutes ) {
        const sub = subtopicsRoutes[route][0];
        const obj = subtopicsRoutes[route][1];
        const act = subtopicsRoutes[route][2];
        if ((sub === "*") || (sub.includes("A"))) {
            const policy = admin.concat([obj, act]);
            adminPolicy.push(policy);
        }
    }
    for (const route in threadsRoutes ) {
        const sub = threadsRoutes[route][0];
        const obj = threadsRoutes[route][1];
        const act = threadsRoutes[route][2];
        if ((sub === "*") || (sub.includes("A"))) {
            const policy = admin.concat([obj, act]);
            adminPolicy.push(policy);
        }
    }
    for (const route in topicsRoutes ) {
        const sub = topicsRoutes[route][0];
        const obj = topicsRoutes[route][1];
        const act = topicsRoutes[route][2];
        if ((sub === "*") || (sub.includes("A"))) {
            const policy = admin.concat([obj, act]);
            adminPolicy.push(policy);
        }
    }
    for (const route in usersRoutes ) {
        const sub = usersRoutes[route][0];
        const obj = usersRoutes[route][1];
        const act = usersRoutes[route][2];
        if ((sub === "*") || (sub.includes("A"))) {
            const policy = admin.concat([obj, act]);
            adminPolicy.push(policy);
        }
    }
    return adminPolicy;
}

async function getModeratorPolicy() {
    moderatorPolicy = [];
    for (const route in authRoutes ) {
        const sub = authRoutes[route][0];
        const obj = authRoutes[route][1];
        const act = authRoutes[route][2];
        if ((sub === "*") || (sub.includes("M"))) {
            const policy = moderator.concat([obj, act]);
            moderatorPolicy.push(policy);
        }
    }
    for (const route in subtopicsRoutes ) {
        const sub = subtopicsRoutes[route][0];
        const obj = subtopicsRoutes[route][1];
        const act = subtopicsRoutes[route][2];
        if ((sub === "*") || (sub.includes("M"))) {
            const policy = moderator.concat([obj, act]);
            moderatorPolicy.push(policy);
        }
    }
    for (const route in threadsRoutes ) {
        const sub = threadsRoutes[route][0];
        const obj = threadsRoutes[route][1];
        const act = threadsRoutes[route][2];
        if ((sub === "*") || (sub.includes("M"))) {
            const policy = moderator.concat([obj, act]);
            moderatorPolicy.push(policy);
        }
    }
    for (const route in topicsRoutes ) {
        const sub = topicsRoutes[route][0];
        const obj = topicsRoutes[route][1];
        const act = topicsRoutes[route][2];
        if ((sub === "*") || (sub.includes("M"))) {
            const policy = moderator.concat([obj, act]);
            moderatorPolicy.push(policy);
        }
    }
    for (const route in usersRoutes ) {
        const sub = usersRoutes[route][0];
        const obj = usersRoutes[route][1];
        const act = usersRoutes[route][2];
        if ((sub === "*") || (sub.includes("M"))) {
            const policy = moderator.concat([obj, act]);
            moderatorPolicy.push(policy);
        }
    }
    return moderatorPolicy;
}

module.exports = {
    getAdminPolicy: getAdminPolicy,
    getModeratorPolicy: getModeratorPolicy,
    getUserPolicy: getUserPolicy,
}