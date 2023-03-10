const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPosts,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dorpping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            active BOOLEAN DEFAULT true
        );
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id),
            title varchar(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        `);
    console.log("Finished building tables!");
  } catch (error) {
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({ username: "albert", password: "bertie99" });
    await createUser({ username: "sandra", password: "2sandy4me" });
    await createUser({ username: "glamgal", password: "soglam" });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creqaqting users!");
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("Starting to create posts...");
    await createPosts({
      authorId: albert.id,
      title: "First Post",
      content:
        "This is my first post. I hope I love writing blogs as much as I love writing them.",
    });

    await createPosts({
      authorId: sandra.id,
      title: "How does this work?",
      content: "Seriously, does this even do anything?",
    });

    await createPosts({
      authorId: glamgal.id,
      title: "Living the Glam Life",
      content: "Do you even? I swear that half of you are posing.",
    });
    console.log("Finished creating posts!");
  } catch (error) {
    console.log("Error creating posts!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      password: "123123a",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

module.exports = {
  client,
};
